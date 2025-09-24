import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sample data structure for ingesting knowledge from the parsed PDFs
const knowledgeEntries = [
  // National Water Overview Data
  {
    title: "India's Total Water Resources",
    content: "India has total annual water resources of 4000 BCM (Billion Cubic Meters), with utilisable water resources of 1123 BCM comprising 690 BCM surface water and 433 BCM groundwater. Per capita water availability in 2011 was 1544 cubic meters per year.",
    category: "groundwater",
    subcategory: "national_statistics",
    source_document: "complete-india-water-database.pdf",
    tags: ["water_resources", "national_data", "surface_water", "groundwater"]
  },
  {
    title: "Groundwater Development Categories 2024",
    content: "As per 2024 assessment: Safe (73% - 291.88 BCM), Semi-Critical (12% - 47.0 BCM), Critical (3% - 13.02 BCM), Over-Exploited (12% - 46.05 BCM), Saline (2%). Total assessment units: 7,089.",
    category: "groundwater",
    subcategory: "categorization",
    source_document: "complete-india-water-database.pdf",
    tags: ["groundwater_status", "assessment", "categories", "2024"]
  },
  {
    title: "Critical States - Over-exploitation",
    content: "Punjab (172% development - severely over-exploited), Rajasthan (137% - over-exploited), Haryana (134.14% - over-exploited), Delhi (98.16% - near critical). These states require immediate conservation measures.",
    category: "groundwater",
    subcategory: "state_wise_status",
    source_document: "complete-india-water-database.pdf",
    tags: ["punjab", "rajasthan", "haryana", "delhi", "over_exploited", "critical_states"]
  },
  // NWIC Framework
  {
    title: "National Water Informatics Centre (NWIC)",
    content: "Established March 28, 2018 under Ministry of Jal Shakti. Central Nodal Agency for Water Data with vision: Data as key driver for water governance. Five pillar strategy: Water Data Governance, Publishing, Visualizations, Decision Support Systems, and Innovations.",
    category: "institutional",
    subcategory: "nwic_framework",
    source_document: "complete-nwic-water-database.pdf",
    tags: ["nwic", "water_governance", "data_management", "institutional_framework"]
  }
];

const governmentSchemes = [
  {
    scheme_name: "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    scheme_type: "water",
    description: "Aims to achieve convergence of investments in irrigation, expand cultivated area, improve on-farm water use efficiency, and introduce sustainable water conservation practices.",
    eligibility_criteria: "Farmers with valid land documents, water availability, and technical feasibility for irrigation projects",
    budget_allocation: 50000,
    application_process: "Apply through respective State Departments of Agriculture or online through PMKSY portal",
    contact_info: "State Department of Agriculture offices",
    is_active: true,
    applicable_states: ["All States"]
  },
  {
    scheme_name: "Rashtriya Krishi Vikas Yojana (RKVY-RAFTAAR)",
    ministry: "Ministry of Agriculture & Farmers Welfare", 
    scheme_type: "agriculture",
    description: "Remunerative Approaches for Agriculture and Allied sector Rejuvenation - provides flexible funding for agriculture development",
    eligibility_criteria: "State governments for implementation of agriculture and allied sector projects",
    budget_allocation: 8500,
    application_process: "State governments submit proposals through dedicated portal",
    is_active: true,
    applicable_states: ["All States"]
  },
  {
    scheme_name: "PM MUDRA Yojana",
    ministry: "Ministry of Finance",
    scheme_type: "msme",
    description: "Provides collateral-free loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises for income generation activities",
    eligibility_criteria: "Non-corporate, non-farm small/micro enterprises with business plan and income generation activity",
    budget_allocation: 31,
    application_process: "Apply through participating banks, NBFCs, and MFIs with business plan and required documents",
    is_active: true,
    applicable_states: ["All States"]
  }
];

const waterInsights = [
  {
    location_type: "national",
    location_name: "India",
    insight_type: "groundwater_status",
    metric_name: "Overall Stage of Development",
    metric_value: 60.08,
    metric_unit: "percentage",
    assessment_year: "2024",
    status_category: "safe",
    recommendations: "Continue monitoring and implement conservation measures in over-exploited areas",
    data_source: "Central Ground Water Board Assessment 2024"
  },
  {
    location_type: "state",
    location_name: "Punjab",
    insight_type: "groundwater_status", 
    metric_name: "Stage of Development",
    metric_value: 172,
    metric_unit: "percentage",
    assessment_year: "2024",
    status_category: "over_exploited",
    recommendations: "Immediate implementation of water conservation, crop diversification, and artificial recharge measures",
    data_source: "Central Ground Water Board Assessment 2024"
  }
];

const conservationTips = [
  {
    title: "Rainwater Harvesting for Groundwater Recharge",
    description: "Install rooftop rainwater harvesting systems to collect and recharge groundwater. This can increase local water table levels and reduce dependency on groundwater extraction.",
    category: "rainwater_harvesting",
    difficulty_level: "easy",
    cost_range: "medium",
    applicable_locations: ["All States"],
    implementation_steps: [
      "Install gutters and downspouts on roof",
      "Set up collection tank or direct recharge pit",
      "Add first flush diverter to remove initial dirty water",
      "Connect to recharge well or infiltration pit",
      "Regular maintenance and cleaning"
    ],
    expected_impact: "Can recharge 1000-5000 liters per year depending on roof area and rainfall",
    seasonal_relevance: ["June", "July", "August", "September"],
    source_document: "complete-india-water-database.pdf"
  },
  {
    title: "Drip Irrigation for Water Efficiency",
    description: "Implement drip irrigation systems to reduce water usage by 30-50% while maintaining crop yields. Delivers water directly to plant roots minimizing evaporation and runoff.",
    category: "irrigation_efficiency",
    difficulty_level: "medium",
    cost_range: "medium",
    applicable_locations: ["All States"],
    implementation_steps: [
      "Conduct soil and crop water requirement analysis",
      "Design drip irrigation layout",
      "Install main and sub-main pipelines",
      "Set up drippers and emitters",
      "Install filtration and fertigation system",
      "Regular maintenance and monitoring"
    ],
    expected_impact: "30-50% reduction in water usage, 15-25% increase in crop yield",
    seasonal_relevance: ["All months"],
    source_document: "complete-india-water-database.pdf"
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { action } = await req.json();

    if (action === 'ingest') {
      console.log('Starting PDF knowledge ingestion process...');

      // Insert knowledge base entries
      const { error: kbError } = await supabaseClient
        .from('knowledge_base')
        .upsert(knowledgeEntries, { 
          onConflict: 'title,source_document',
          ignoreDuplicates: false 
        });

      if (kbError) {
        console.error('Error inserting knowledge base entries:', kbError);
        throw kbError;
      }

      // Insert government schemes
      const { error: schemeError } = await supabaseClient
        .from('government_schemes')
        .upsert(governmentSchemes, { 
          onConflict: 'scheme_name,ministry',
          ignoreDuplicates: false 
        });

      if (schemeError) {
        console.error('Error inserting government schemes:', schemeError);
        throw schemeError;
      }

      // Insert water insights
      const { error: insightError } = await supabaseClient
        .from('water_resources_insights')
        .upsert(waterInsights, { 
          onConflict: 'location_name,insight_type,metric_name',
          ignoreDuplicates: false 
        });

      if (insightError) {
        console.error('Error inserting water insights:', insightError);
        throw insightError;
      }

      // Insert conservation tips
      const { error: tipError } = await supabaseClient
        .from('conservation_tips')
        .upsert(conservationTips, { 
          onConflict: 'title,category',
          ignoreDuplicates: false 
        });

      if (tipError) {
        console.error('Error inserting conservation tips:', tipError);
        throw tipError;
      }

      console.log('Successfully ingested all PDF knowledge data');

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Knowledge base successfully populated from PDF data',
          stats: {
            knowledge_entries: knowledgeEntries.length,
            government_schemes: governmentSchemes.length,
            water_insights: waterInsights.length,
            conservation_tips: conservationTips.length
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in PDF knowledge ingestion:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to ingest PDF knowledge', 
        details: (error as Error).message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});