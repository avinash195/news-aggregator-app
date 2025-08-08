import type { Article, NewsApiResponse } from '../types';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

export class NewsApiService {
  private static async makeRequest(endpoint: string, params: Record<string, string | number> = {}): Promise<NewsApiResponse> {
    const url = new URL(`${NEWS_API_BASE_URL}${endpoint}`);
    
    // Add API key to params
    params.apiKey = NEWS_API_KEY;
    
    // Add all params to URL
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`NewsAPI request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(`NewsAPI error: ${data.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('NewsAPI request error:', error);
      throw error;
    }
  }

  static async getTopHeadlines(params: {
    country?: string;
    category?: string;
    sources?: string;
    q?: string;
    pageSize?: number;
    page?: number;
  } = {}): Promise<{ articles: Article[]; totalResults: number }> {
    try {
      const response = await this.makeRequest('/top-headlines', params);
      
      const articles: Article[] = response.articles.map((article, index) => ({
        id: `newsapi-${article.url}-${index}`,
        title: article.title || 'No title available',
        description: article.description || 'No description available',
        content: article.content || 'No content available',
        url: article.url,
        urlToImage: article.urlToImage || '/placeholder-image.jpg',
        publishedAt: article.publishedAt,
        author: article.author || 'Unknown Author',
        source: {
          id: article.source.id || 'unknown',
          name: article.source.name || 'Unknown Source'
        },
        category: params.category || 'general'
      }));

      return {
        articles,
        totalResults: response.totalResults
      };
    } catch (error) {
      console.error('Error fetching top headlines from NewsAPI:', error);
      return { articles: [], totalResults: 0 };
    }
  }

  static async searchArticles(params: {
    q: string;
    sources?: string;
    domains?: string;
    from?: string;
    to?: string;
    language?: string;
    sortBy?: string;
    pageSize?: number;
    page?: number;
  }): Promise<{ articles: Article[]; totalResults: number }> {
    try {
      const response = await this.makeRequest('/everything', params);
      
      const articles: Article[] = response.articles.map((article, index) => ({
        id: `newsapi-${article.url}-${index}`,
        title: article.title || 'No title available',
        description: article.description || 'No description available',
        content: article.content || 'No content available',
        url: article.url,
        urlToImage: article.urlToImage || '/placeholder-image.jpg',
        publishedAt: article.publishedAt,
        author: article.author || 'Unknown Author',
        source: {
          id: article.source.id || 'unknown',
          name: article.source.name || 'Unknown Source'
        },
        category: 'general'
      }));

      return {
        articles,
        totalResults: response.totalResults
      };
    } catch (error) {
      console.error('Error searching articles from NewsAPI:', error);
      return { articles: [], totalResults: 0 };
    }
  }

  static async getSources(params: {
    category?: string;
    language?: string;
    country?: string;
  } = {}): Promise<Array<{ id: string; name: string; category: string }>> {
    try {
      const response = await this.makeRequest('/sources', params) as any;
      return response.sources?.map((source: any) => ({
        id: source.id,
        name: source.name,
        category: source.category
      })) || [];
    } catch (error) {
      console.error('Error fetching sources from NewsAPI:', error);
      return [];
    }
  }
} 