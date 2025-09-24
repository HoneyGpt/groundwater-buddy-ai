import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate consistent UUID from user name (same as frontend)
const generateUserIdFromName = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  const hashStr = Math.abs(hash).toString(16).padStart(8, '0');
  return `${hashStr.slice(0,8)}-${hashStr.slice(0,4)}-4${hashStr.slice(1,4)}-8${hashStr.slice(0,3)}-${hashStr.padEnd(12, '0').slice(0,12)}`;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { query, userName, filters = {} } = await req.json();

    if (!query || !userName) {
      throw new Error('Query and userName are required');
    }

    // Generate consistent user ID from name
    const userId = generateUserIdFromName(userName);

    // Build the search query with text search and filters
    let searchQuery = supabaseClient
      .from('user_documents')
      .select('*')
      .eq('user_id', userId)
      .textSearch('title,description,extracted_text', query.replace(/[^\w\s]/g, ''))
      .order('upload_date', { ascending: false });

    // Apply filters if provided
    if (filters.category && filters.category !== 'all') {
      searchQuery = searchQuery.eq('category', filters.category);
    }

    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      if (start) searchQuery = searchQuery.gte('upload_date', start);
      if (end) searchQuery = searchQuery.lte('upload_date', end);
    }

    if (filters.tags && filters.tags.length > 0) {
      searchQuery = searchQuery.overlaps('tags', filters.tags);
    }

    const { data: documents, error } = await searchQuery.limit(50);

    if (error) throw error;

    // Enhanced search with AI interpretation for natural language queries
    let smartResults = documents || [];
    
    // Check if query contains natural language patterns
    const nlPatterns = [
      { pattern: /aadhaar|aadhar/i, category: 'ID Proofs', tags: ['aadhaar'] },
      { pattern: /pan\s+card|pan/i, category: 'ID Proofs', tags: ['pan'] },
      { pattern: /passport/i, category: 'ID Proofs', tags: ['passport'] },
      { pattern: /bill|electricity|water|phone/i, category: 'Bills', tags: ['bill', 'electricity', 'water', 'phone'] },
      { pattern: /scheme|subsidy|government/i, category: 'Schemes', tags: ['scheme', 'subsidy', 'government'] },
      { pattern: /medical|health|prescription|report/i, category: 'Health', tags: ['medical', 'health', 'prescription'] },
      { pattern: /education|certificate|degree|marksheet/i, category: 'Education', tags: ['certificate', 'degree', 'education'] },
      { pattern: /bank|statement|financial/i, category: 'Financial', tags: ['bank', 'statement', 'financial'] },
      { pattern: /property|legal|agreement/i, category: 'Legal', tags: ['property', 'legal', 'agreement'] }
    ];

    // Apply smart filtering based on natural language patterns
    for (const pattern of nlPatterns) {
      if (pattern.pattern.test(query)) {
        smartResults = smartResults.filter(doc => 
          doc.category === pattern.category || 
          pattern.tags.some(tag => 
            doc.tags.some((docTag: string) => docTag.toLowerCase().includes(tag.toLowerCase())) ||
            doc.title?.toLowerCase().includes(tag.toLowerCase()) ||
            doc.original_name.toLowerCase().includes(tag.toLowerCase())
          )
        );
        break;
      }
    }

    // Generate AI suggestions for search improvement
    const suggestions = [];
    if (smartResults.length === 0) {
      suggestions.push("Try searching with document type (e.g., 'Aadhaar card', 'electricity bill')");
      suggestions.push("Search by category (ID Proofs, Bills, Schemes, Health, etc.)");
      suggestions.push("Use keywords from document content or filename");
    } else if (smartResults.length > 20) {
      suggestions.push("Try adding more specific terms to narrow down results");
      suggestions.push("Filter by date range or category for better results");
    }

    return new Response(JSON.stringify({
      success: true,
      results: smartResults,
      totalResults: smartResults.length,
      query: query,
      suggestions: suggestions,
      appliedFilters: filters
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AI Document Search Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: (error as Error).message || 'An error occurred during search'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});