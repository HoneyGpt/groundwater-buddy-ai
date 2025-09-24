/**
 * Google Custom Search API integration
 */

const GOOGLE_API_KEY = 'AIzaSyAKE8LeBqiIAgcYKnS_EW4Mej9Po0vKCnU';
const SEARCH_ENGINE_ID = '436035263b1de8a7cf';

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
 * Perform Google Custom Search
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
    const params = new URLSearchParams({
      key: GOOGLE_API_KEY,
      cx: SEARCH_ENGINE_ID,
      q: query,
    });

    // Add optional parameters
    if (options.start) params.append('start', options.start.toString());
    if (options.num) params.append('num', Math.min(options.num, 10).toString()); // Max 10 per request
    if (options.siteSearch) params.append('siteSearch', options.siteSearch);
    if (options.fileType) params.append('fileType', options.fileType);
    if (options.dateRestrict) params.append('dateRestrict', options.dateRestrict);

    const response = await fetch(`https://www.googleapis.com/customsearch/v1?${params}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Google Search API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Google Search API error:', error);
    throw error;
  }
};

/**
 * Search for academic papers (site-specific searches)
 */
export const searchAcademicPapers = async (query: string, options: { start?: number } = {}) => {
  const academicQuery = `${query} site:scholar.google.com OR site:researchgate.net OR site:arxiv.org OR site:pubmed.ncbi.nlm.nih.gov`;
  return searchGoogle(academicQuery, options);
};

/**
 * Search for water/groundwater specific resources
 */
export const searchWaterResources = async (query: string, options: { start?: number } = {}) => {
  const waterQuery = `${query} groundwater water resources hydrology`;
  return searchGoogle(waterQuery, options);
};

/**
 * Search for government documents and policies
 */
export const searchGovernmentDocs = async (query: string, options: { start?: number } = {}) => {
  const govQuery = `${query} site:gov.in OR site:nic.in OR site:india.gov.in`;
  return searchGoogle(govQuery, options);
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