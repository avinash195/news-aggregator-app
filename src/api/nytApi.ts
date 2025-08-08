import type { Article, NYTApiResponse, NYTSectionsResponse } from '../types';

const NYT_API_KEY = import.meta.env.VITE_NYT_API_KEY;
const NYT_API_BASE_URL = 'https://api.nytimes.com/svc';

export class NYTApiService {
  private static async makeRequest(endpoint: string, params: Record<string, string | number> = {}): Promise<NYTApiResponse> {
    const url = new URL(`${NYT_API_BASE_URL}${endpoint}`);
    
    // Add API key to params
    params['api-key'] = NYT_API_KEY;
    
    // Add all params to URL
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`NYT API request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.fault) {
        throw new Error(`NYT API error: ${data.fault.faultstring}`);
      }
      
      return data;
    } catch (error) {
      console.error('NYT API request error:', error);
      throw error;
    }
  }

  static async searchArticles(params: {
    q?: string;
    fq?: string;
    begin_date?: string;
    end_date?: string;
    sort?: string;
    page?: number;
  } = {}): Promise<{ articles: Article[]; totalResults: number }> {
    try {
      const response = await this.makeRequest('/search/v2/articlesearch.json', params);
      
      const articles: Article[] = response.results.map((result, index) => ({
        id: `nyt-${result.uri}-${index}`,
        title: result.title || 'No title available',
        description: result.abstract || 'No description available',
        content: result.abstract || 'No content available',
        url: result.url,
        urlToImage: result.media?.[0]?.['media-metadata']?.[0]?.url || '/placeholder-image.jpg',
        publishedAt: result.published_date,
        author: result.byline || 'Unknown Author',
        source: {
          id: result.source || 'unknown',
          name: 'The New York Times'
        },
        category: result.section || 'general'
      }));

      return {
        articles,
        totalResults: response.num_results
      };
    } catch (error) {
      console.error('Error searching articles from NYT API:', error);
      return { articles: [], totalResults: 0 };
    }
  }

  static async getMostPopular(params: {
    section?: string;
    time_period?: number;
  } = {}): Promise<{ articles: Article[]; totalResults: number }> {
    try {
      const response = await this.makeRequest('/mostpopular/v2/viewed/1.json', params);
      
      const articles: Article[] = response.results.map((result, index) => ({
        id: `nyt-popular-${result.uri}-${index}`,
        title: result.title || 'No title available',
        description: result.abstract || 'No description available',
        content: result.abstract || 'No content available',
        url: result.url,
        urlToImage: result.media?.[0]?.['media-metadata']?.[0]?.url || '/placeholder-image.jpg',
        publishedAt: result.published_date,
        author: result.byline || 'Unknown Author',
        source: {
          id: result.source || 'unknown',
          name: 'The New York Times'
        },
        category: result.section || 'general'
      }));

      return {
        articles,
        totalResults: response.num_results
      };
    } catch (error) {
      console.error('Error fetching most popular articles from NYT API:', error);
      return { articles: [], totalResults: 0 };
    }
  }

  static async getSections(): Promise<Array<{ id: string; name: string }>> {
    try {
      const response = await this.makeRequest('/news/v3/content/section-list.json') as unknown as NYTSectionsResponse;
      return response.results?.map((section) => ({
        id: section.section,
        name: section.display_name
      })) || [];
    } catch (error) {
      console.error('Error fetching sections from NYT API:', error);
      return [];
    }
  }
}
