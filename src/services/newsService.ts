import type { Article, Filter } from '../types';
import { NewsApiService } from '../api/newsApi';
import { GuardianApiService } from '../api/guardianApi';
import { NYTApiService } from '../api/nytApi';

export class NewsService {
  static async getArticles(
    filters: Filter,
    searchQuery: string = '',
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ articles: Article[]; totalResults: number }> {
    const allArticles: Article[] = [];

    try {
      // Fetch from NewsAPI
      if (filters.source === 'All Sources' || filters.source === 'NewsAPI') {
        try {
          // Use search endpoint if there's a search query, otherwise use top-headlines
          let newsApiResult;
          
          if (searchQuery) {
            // Use search endpoint for queries
            const searchParams = {
              q: searchQuery,
              pageSize: pageSize,
              page
            };
            newsApiResult = await NewsApiService.searchArticles(searchParams);
          } else {
            // Use top-headlines for general news
            const topHeadlinesParams: {
              pageSize: number;
              page: number;
              country: string;
              category?: string;
            } = {
              pageSize: pageSize,
              page,
              country: 'us' // Default country parameter required by NewsAPI
            };
            
            if (filters.category && filters.category !== 'All Categories') {
              topHeadlinesParams.category = filters.category.toLowerCase();
            }
            
            newsApiResult = await NewsApiService.getTopHeadlines(topHeadlinesParams);
          }
          allArticles.push(...newsApiResult.articles);
        } catch (error) {
          console.error('NewsAPI failed:', error);
        }
      }

      // Fetch from Guardian API
      if (filters.source === 'All Sources' || filters.source === 'The Guardian') {
        try {
          const guardianParams: {
            'page-size': number;
            page: number;
            q?: string;
            section?: string;
          } = {
            'page-size': pageSize,
            page
          };

          if (searchQuery) {
            guardianParams.q = searchQuery;
          }
          if (filters.category && filters.category !== 'All Categories') {
            guardianParams.section = filters.category.toLowerCase();
          }

          const guardianResult = await GuardianApiService.searchArticles(guardianParams);
          allArticles.push(...guardianResult.articles);
        } catch (error) {
          console.error('Guardian API failed:', error);
        }
      }

      // Fetch from NYT API
      if (filters.source === 'All Sources' || filters.source === 'The New York Times') {
        try {
          const nytParams: {
            page: number;
            q?: string;
            fq?: string;
          } = {
            page: page
          };

          if (searchQuery) {
            nytParams.q = searchQuery;
          }
          if (filters.category && filters.category !== 'All Categories') {
            nytParams.fq = `news_desk:(${filters.category})`;
          }

          const nytResult = await NYTApiService.searchArticles(nytParams);
          
          allArticles.push(...nytResult.articles);
        } catch (error) {
          console.error('NYT API failed:', error);
        }
      }

      // Sort articles by date (newest first)
      allArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      // Apply date range filter
      const filteredArticles = this.applyDateRangeFilter(allArticles, filters.dateRange);

      // For infinite scroll, we don't slice the results here
      // The API calls handle pagination, we just return all fetched articles
      const totalResults = filteredArticles.length;

      return {
        articles: filteredArticles,
        totalResults
      };
    } catch (error) {
      console.error('Error fetching articles:', error);
      return {
        articles: [],
        totalResults: 0
      };
    }
  }

  private static applyDateRangeFilter(articles: Article[], dateRange: string): Article[] {
    const now = new Date();
    let cutoffDate: Date;

    switch (dateRange) {
      case 'Today':
        cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'This Week':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'This Month':
        cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        return articles;
    }

    return articles.filter(article => {
      const articleDate = new Date(article.publishedAt);
      return articleDate >= cutoffDate;
    });
  }



  static async getCategories(): Promise<string[]> {
    return [
      'All Categories',
      'Business',
      'Technology',
      'Entertainment',
      'Sports',
      'Science',
      'Health',
      'World',
      'Politics',
      'Environment'
    ];
  }

  static async getSources(): Promise<string[]> {
    return [
      'All Sources',
      'NewsAPI',
      'The Guardian',
      'The New York Times'
    ];
  }

  static async getDateRanges(): Promise<string[]> {
    return [
      'All Time',
      'Today',
      'This Week',
      'This Month'
    ];
  }


} 