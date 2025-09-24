/**
 * Google Custom Search API integration via Supabase Edge Function
 */

import { supabase } from '@/integrations/supabase/client';

export interface GoogleSearchResult {
  title: string;
  link: string;
  displayLink: string;
  snippet: string;
  formattedUrl: string;
  htmlTitle: string;
  htmlSnippet: string;
  pagemap?: {
    cse_thumbnail?: Array<{
      src: string;
      width: string;
      height: string;
    }>;
    metatags?: Array<{
      [key: string]: string;
    }>;
  };
}

export interface GoogleSearchResponse {
  kind: string;
  url: {
    type: string;
    template: string;
  };
  queries: {
    request: Array<{
      title: string;
      totalResults: string;
      searchTerms: string;
      count: number;
      startIndex: number;
      inputEncoding: string;
      outputEncoding: string;
      safe: string;
      cx: string;
    }>;
    nextPage?: Array<{
      title: string;
      totalResults: string;
      searchTerms: string;
      count: number;
      startIndex: number;
      inputEncoding: string;
      outputEncoding: string;
      safe: string;
      cx: string;
    }>;
  };
  context: {
    title: string;
  };
  searchInformation: {
    searchTime: number;
    formattedSearchTime: string;
    totalResults: string;
    formattedTotalResults: string;
  };
  items: GoogleSearchResult[];
}

/**
 * Perform Google Custom Search via Supabase Edge Function
 */
export const searchGoogle = async (
  query: string,
  options: {
    start?: number;
    num?: number;
    siteSearch?: string;
    fileType?: string;
    dateRestrict?: string;
  } = {}
): Promise<GoogleSearchResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('google-search', {
      body: {
        query,
        searchType: 'web',
        options
      }
    });

    if (error) {
      throw new Error(`Supabase function error: ${error.message}`);
    }

    if (!data.success) {
      throw new Error(data.error || 'Search failed');
    }

    return data.data;
  } catch (error) {
    console.error('Google Search API error:', error);
    throw error;
  }
};

/**
 * Search for academic papers (site-specific searches)
 */
export const searchAcademicPapers = async (query: string, options: { start?: number } = {}) => {
  try {
    const { data, error } = await supabase.functions.invoke('google-search', {
      body: {
        query,
        searchType: 'academic',
        options
      }
    });

    if (error) {
      throw new Error(`Supabase function error: ${error.message}`);
    }

    if (!data.success) {
      throw new Error(data.error || 'Academic search failed');
    }

    return data.data;
  } catch (error) {
    console.error('Academic search error:', error);
    throw error;
  }
};

/**
 * Search for water/groundwater specific resources
 */
export const searchWaterResources = async (query: string, options: { start?: number } = {}) => {
  try {
    const { data, error } = await supabase.functions.invoke('google-search', {
      body: {
        query,
        searchType: 'water',
        options
      }
    });

    if (error) {
      throw new Error(`Supabase function error: ${error.message}`);
    }

    if (!data.success) {
      throw new Error(data.error || 'Water resources search failed');
    }

    return data.data;
  } catch (error) {
    console.error('Water resources search error:', error);
    throw error;
  }
};

/**
 * Search for government documents and policies
 */
export const searchGovernmentDocs = async (query: string, options: { start?: number } = {}) => {
  try {
    const { data, error } = await supabase.functions.invoke('google-search', {
      body: {
        query,
        searchType: 'government',
        options
      }
    });

    if (error) {
      throw new Error(`Supabase function error: ${error.message}`);
    }

    if (!data.success) {
      throw new Error(data.error || 'Government documents search failed');
    }

    return data.data;
  } catch (error) {
    console.error('Government documents search error:', error);
    throw error;
  }
};

/**
 * Search for PDF documents
 */
export const searchPDFs = async (query: string, options: { start?: number } = {}) => {
  return searchGoogle(query, { ...options, fileType: 'pdf' });
};

/**
 * Search recent content (last year)
 */
export const searchRecent = async (query: string, options: { start?: number } = {}) => {
  return searchGoogle(query, { ...options, dateRestrict: 'y1' });
};

/**
 * Extract domain from URL for display
 */
export const extractDomain = (url: string): string => {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
};

/**
 * Format search result snippet with highlighting
 */
export const formatSnippet = (snippet: string, searchTerms: string): string => {
  const terms = searchTerms.toLowerCase().split(' ');
  let formatted = snippet;
  
  terms.forEach(term => {
    if (term.length > 2) {
      const regex = new RegExp(`(${term})`, 'gi');
      formatted = formatted.replace(regex, '<mark>$1</mark>');
    }
  });
  
  return formatted;
};

/**
 * Get search suggestions based on query
 */
export const getSearchSuggestions = (query: string): string[] => {
  const lowerQuery = query.toLowerCase();
  const suggestions: string[] = [];
  
  // Water-related suggestions
  if (lowerQuery.includes('water') || lowerQuery.includes('ground')) {
    suggestions.push(
      `${query} management techniques`,
      `${query} conservation methods`,
      `${query} policy frameworks`,
      `${query} quality assessment`
    );
  }
  
  // Research-related suggestions
  if (lowerQuery.includes('research') || lowerQuery.includes('study')) {
    suggestions.push(
      `${query} methodology`,
      `${query} case studies`,
      `${query} literature review`,
      `${query} data analysis`
    );
  }
  
  // Location-based suggestions
  if (lowerQuery.includes('india') || lowerQuery.includes('indian')) {
    suggestions.push(
      `${query} states comparison`,
      `${query} regional patterns`,
      `${query} government schemes`,
      `${query} CGWB reports`
    );
  }
  
  return suggestions.slice(0, 4);
};