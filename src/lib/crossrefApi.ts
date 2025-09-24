/**
 * CrossRef API integration for academic research
 */

const CROSSREF_BASE_URL = 'https://api.crossref.org';

export interface CrossRefWork {
  DOI: string;
  title: string[];
  author?: Array<{
    given?: string;
    family?: string;
  }>;
  published?: {
    'date-parts': number[][];
  };
  container_title?: string[];
  type: string;
  abstract?: string;
  URL: string;
}

export interface CrossRefResponse {
  status: string;
  message_type: string;
  message_version: string;
  message: {
    items: CrossRefWork[];
    'total-results': number;
    'items-per-page': number;
    query?: {
      'start-index': number;
      'search-terms': string;
    };
  };
}

/**
 * Search for academic works using CrossRef API
 */
export const searchWorks = async (
  query: string,
  limit: number = 10,
  offset: number = 0
): Promise<CrossRefResponse> => {
  try {
    const params = new URLSearchParams({
      query,
      rows: limit.toString(),
      offset: offset.toString(),
      mailto: 'research@ingres-ai.org' // Polite pool access
    });

    const response = await fetch(`${CROSSREF_BASE_URL}/works?${params}`, {
      headers: {
        'User-Agent': 'INGRES-AI-Research/1.0 (https://ingres-ai.org; mailto:research@ingres-ai.org)'
      }
    });

    if (!response.ok) {
      throw new Error(`CrossRef API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('CrossRef API error:', error);
    throw error;
  }
};

/**
 * Get work by DOI
 */
export const getWorkByDOI = async (doi: string): Promise<CrossRefWork> => {
  try {
    const response = await fetch(`${CROSSREF_BASE_URL}/works/${encodeURIComponent(doi)}?mailto=research@ingres-ai.org`, {
      headers: {
        'User-Agent': 'INGRES-AI-Research/1.0 (https://ingres-ai.org; mailto:research@ingres-ai.org)'
      }
    });

    if (!response.ok) {
      throw new Error(`CrossRef API error: ${response.status}`);
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('CrossRef API error:', error);
    throw error;
  }
};

/**
 * Search funders
 */
export const searchFunders = async (query: string, limit: number = 10) => {
  try {
    const params = new URLSearchParams({
      query,
      rows: limit.toString(),
      mailto: 'research@ingres-ai.org'
    });

    const response = await fetch(`${CROSSREF_BASE_URL}/funders?${params}`, {
      headers: {
        'User-Agent': 'INGRES-AI-Research/1.0'
      }
    });

    return await response.json();
  } catch (error) {
    console.error('CrossRef Funders API error:', error);
    throw error;
  }
};

/**
 * Search journals
 */
export const searchJournals = async (query: string, limit: number = 10) => {
  try {
    const params = new URLSearchParams({
      query,
      rows: limit.toString(),
      mailto: 'research@ingres-ai.org'
    });

    const response = await fetch(`${CROSSREF_BASE_URL}/journals?${params}`, {
      headers: {
        'User-Agent': 'INGRES-AI-Research/1.0'
      }
    });

    return await response.json();
  } catch (error) {
    console.error('CrossRef Journals API error:', error);
    throw error;
  }
};

/**
 * Get works by type (e.g., 'journal-article', 'book', 'conference-paper')
 */
export const getWorksByType = async (type: string, limit: number = 10, query?: string) => {
  try {
    const params = new URLSearchParams({
      filter: `type:${type}`,
      rows: limit.toString(),
      mailto: 'research@ingres-ai.org'
    });

    if (query) {
      params.append('query', query);
    }

    const response = await fetch(`${CROSSREF_BASE_URL}/works?${params}`, {
      headers: {
        'User-Agent': 'INGRES-AI-Research/1.0'
      }
    });

    return await response.json();
  } catch (error) {
    console.error('CrossRef Works by Type API error:', error);
    throw error;
  }
};

/**
 * Format author names for display
 */
export const formatAuthors = (authors?: Array<{ given?: string; family?: string }>): string => {
  if (!authors || authors.length === 0) return 'Unknown authors';
  
  const formattedAuthors = authors.map(author => {
    if (author.given && author.family) {
      return `${author.given} ${author.family}`;
    }
    return author.family || author.given || 'Unknown';
  });

  if (formattedAuthors.length === 1) return formattedAuthors[0];
  if (formattedAuthors.length === 2) return formattedAuthors.join(' and ');
  if (formattedAuthors.length <= 3) return formattedAuthors.slice(0, -1).join(', ') + ', and ' + formattedAuthors.slice(-1);
  
  return formattedAuthors.slice(0, 3).join(', ') + ` et al. (${formattedAuthors.length} authors)`;
};

/**
 * Format publication date
 */
export const formatPublicationDate = (published?: { 'date-parts': number[][] }): string => {
  if (!published || !published['date-parts'] || published['date-parts'].length === 0) {
    return 'Unknown date';
  }

  const dateParts = published['date-parts'][0];
  if (dateParts.length === 1) return dateParts[0].toString();
  if (dateParts.length === 2) return `${dateParts[1]}/${dateParts[0]}`;
  if (dateParts.length >= 3) return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
  
  return 'Unknown date';
};