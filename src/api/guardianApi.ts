import type { Article, GuardianApiResponse, GuardianSectionsResponse, GuardianTagsResponse } from '../types';

const GUARDIAN_API_KEY = 'test';
const GUARDIAN_API_BASE_URL = 'https://content.guardianapis.com';

export class GuardianApiService {
  private static async makeRequest(endpoint: string, params: Record<string, string | number> = {}): Promise<GuardianApiResponse> {
    const url = new URL(`${GUARDIAN_API_BASE_URL}${endpoint}`);
    
    // Add API key to params
    params['api-key'] = GUARDIAN_API_KEY;
    
    // Add all params to URL
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`Guardian API request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.response?.status === 'error') {
        throw new Error(`Guardian API error: ${data.response.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('Guardian API request error:', error);
      throw error;
    }
  }

  static async searchArticles(params: {
    q?: string;
    section?: string;
    'section-id'?: string;
    'tag'?: string;
    'from-date'?: string;
    'to-date'?: string;
    'order-by'?: string;
    'page-size'?: number;
    page?: number;
  } = {}): Promise<{ articles: Article[]; totalResults: number }> {
    try {
      const response = await this.makeRequest('/search', params);
      
      const articles: Article[] = response.response.results.map((result, index) => ({
        id: `guardian-${result.id}-${index}`,
        title: result.webTitle || 'No title available',
        description: result.fields?.bodyText?.substring(0, 200) + '...' || 'No description available',
        content: result.fields?.bodyText || 'No content available',
        url: result.webUrl,
        urlToImage: result.fields?.thumbnail || '/placeholder-image.jpg',
        publishedAt: result.webPublicationDate,
        author: result.fields?.byline || 'Unknown Author',
        source: {
          id: result.sectionId || 'unknown',
          name: 'The Guardian'
        },
        category: result.sectionName || 'general'
      }));

      return {
        articles,
        totalResults: response.response.total
      };
    } catch (error) {
      console.error('Error searching articles from Guardian API:', error);
      return { articles: [], totalResults: 0 };
    }
  }

  static async getSections(): Promise<Array<{ id: string; name: string }>> {
    try {
      const response = await this.makeRequest('/sections') as GuardianSectionsResponse;
      return response.response.results?.map((section) => ({
        id: section.id,
        name: section.webTitle
      })) || [];
    } catch (error) {
      console.error('Error fetching sections from Guardian API:', error);
      return [];
    }
  }

  static async getTags(): Promise<Array<{ id: string; name: string; type: string }>> {
    try {
      const response = await this.makeRequest('/tags') as GuardianTagsResponse;
      return response.response.results?.map((tag) => ({
        id: tag.id,
        name: tag.webTitle,
        type: tag.type
      })) || [];
    } catch (error) {
      console.error('Error fetching tags from Guardian API:', error);
      return [];
    }
  }
}
