export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  author: string;
  source: {
    id: string;
    name: string;
  };
  category: string;
}

export interface Filter {
  category: string;
  source: string;
  dateRange: string;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

export interface GuardianApiResponse {
  response: {
    status: string;
    total: number;
    results: Array<{
      id: string;
      type: string;
      sectionId: string;
      sectionName: string;
      webPublicationDate: string;
      webTitle: string;
      webUrl: string;
      apiUrl: string;
      fields?: {
        thumbnail?: string;
        bodyText?: string;
        byline?: string;
      };
    }>;
  };
}

export interface GuardianSectionsResponse {
  response: {
    status: string;
    total: number;
    results: Array<{
      id: string;
      webTitle: string;
      webUrl: string;
      apiUrl: string;
    }>;
  };
}

export interface GuardianTagsResponse {
  response: {
    status: string;
    total: number;
    results: Array<{
      id: string;
      webTitle: string;
      type: string;
      webUrl: string;
      apiUrl: string;
    }>;
  };
}

export interface NYTApiResponse {
  status: string;
  copyright: string;
  response: {
    docs: Array<{
      abstract: string;
      byline: {
        original: string;
      };
      document_type: string;
      headline: {
        main: string;
        kicker: string;
        print_headline: string;
      };
      _id: string;
      keywords: Array<{
        name: string;
        value: string;
        rank: number;
      }>;
      multimedia: {
        caption: string;
        credit: string;
        default: {
          url: string;
          height: number;
          width: number;
        };
        thumbnail: {
          url: string;
          height: number;
          width: number;
        };
      };
      news_desk: string;
      print_page: string;
      print_section: string;
      pub_date: string;
      section_name: string;
      snippet: string;
      source: string;
      subsection_name: string;
      type_of_material: string;
      uri: string;
      web_url: string;
      word_count: number;
    }>;
    metadata: {
      hits: number;
      offset: number;
      time: number;
    };
  };
}

export interface NYTMostPopularResponse {
  status: string;
  copyright: string;
  num_results: number;
  results: Array<{
    uri: string;
    url: string;
    id: number;
    asset_id: number;
    source: string;
    published_date: string;
    updated: string;
    section: string;
    subsection: string;
    nytdsection: string;
    adx_keywords: string;
    column: string | null;
    byline: string;
    type: string;
    title: string;
    abstract: string;
    des_facet: string[];
    org_facet: string[];
    per_facet: string[];
    geo_facet: string[];
    media: Array<{
      type: string;
      subtype: string;
      caption: string;
      copyright: string;
      approved_for_syndication: number;
      "media-metadata": Array<{
        url: string;
        format: string;
        height: number;
        width: number;
      }>;
    }>;
    eta_id: number;
  }>;
}

export interface NYTSectionsResponse {
  status: string;
  copyright: string;
  num_results: number;
  results: Array<{
    section: string;
    display_name: string;
  }>;
}

export interface UserPreferences {
  preferredSources: string[];
  preferredCategories: string[];
  preferredAuthors: string[];
} 