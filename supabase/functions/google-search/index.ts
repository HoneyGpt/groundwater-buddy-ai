import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, searchType = 'web', options = {} } = await req.json();

    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_SEARCH_API_KEY');
    const SEARCH_ENGINE_ID = Deno.env.get('GOOGLE_SEARCH_CX') ?? 'c35c85b4f765b4693';

    if (!GOOGLE_API_KEY) {
      throw new Error('GOOGLE_SEARCH_API_KEY is not configured');
    }

    if (!query) {
      throw new Error('Search query is required');
    }

    // Build search parameters
    const params = new URLSearchParams({
      key: GOOGLE_API_KEY,
      cx: SEARCH_ENGINE_ID,
      q: buildSearchQuery(query, searchType),
    });

    // Add optional parameters
    if (options.start) params.append('start', options.start.toString());
    if (options.num) params.append('num', Math.min(options.num || 10, 10).toString());
    if (options.siteSearch) params.append('siteSearch', options.siteSearch);
    if (options.fileType) params.append('fileType', options.fileType);
    if (options.dateRestrict) params.append('dateRestrict', options.dateRestrict);

    console.log('Making Google Search API request...');
    
    const response = await fetch(`https://www.googleapis.com/customsearch/v1?${params}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Google Search API Error:', errorData);
      throw new Error(`Google Search API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Google Search API response received successfully');

    return new Response(JSON.stringify({
      success: true,
      data: data,
      searchType: searchType
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in google-search function:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: (error as Error).message,
      fallbackResponse: "I'm having trouble searching right now. Please try again in a moment."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function buildSearchQuery(query: string, searchType: string): string {
  switch (searchType) {
    case 'academic':
      return `${query} site:scholar.google.com OR site:researchgate.net OR site:arxiv.org OR site:pubmed.ncbi.nlm.nih.gov`;
    case 'government':
      return `${query} site:gov.in OR site:nic.in OR site:india.gov.in`;
    case 'water':
      return `${query} groundwater water resources hydrology`;
    case 'pdf':
      return query; // fileType will be set to 'pdf' in params
    case 'recent':
      return query; // dateRestrict will be set to 'y1' in params
    default:
      return query;
  }
}