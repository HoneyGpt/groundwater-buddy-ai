-- Create knowledge base table for storing parsed PDF content
CREATE TABLE public.knowledge_base (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL, -- 'groundwater', 'schemes', 'conservation', 'institutional'
  subcategory TEXT,
  state_id UUID,
  district_id UUID,
  tags TEXT[] DEFAULT '{}',
  source_document TEXT NOT NULL,
  source_url TEXT,
  language TEXT DEFAULT 'english',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', title || ' ' || content || ' ' || COALESCE(subcategory, ''))
  ) STORED
);

-- Create government schemes table for detailed scheme information
CREATE TABLE public.government_schemes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scheme_name TEXT NOT NULL,
  ministry TEXT NOT NULL,
  scheme_type TEXT, -- 'water', 'agriculture', 'msme', etc.
  description TEXT NOT NULL,
  eligibility_criteria TEXT,
  budget_allocation NUMERIC,
  application_process TEXT,
  contact_info TEXT,
  official_website TEXT,
  state_specific BOOLEAN DEFAULT false,
  applicable_states TEXT[],
  is_active BOOLEAN DEFAULT true,
  launch_date DATE,
  application_deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', scheme_name || ' ' || description || ' ' || COALESCE(ministry, ''))
  ) STORED
);

-- Create water resources insights table
CREATE TABLE public.water_resources_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_type TEXT NOT NULL, -- 'national', 'state', 'district', 'block'
  location_name TEXT NOT NULL,
  state_id UUID,
  district_id UUID,
  insight_type TEXT NOT NULL, -- 'groundwater_status', 'surface_water', 'quality', 'usage'
  metric_name TEXT NOT NULL,
  metric_value NUMERIC,
  metric_unit TEXT,
  assessment_year TEXT NOT NULL DEFAULT '2024-25',
  status_category TEXT, -- 'safe', 'semi_critical', 'critical', 'over_exploited'
  recommendations TEXT,
  data_source TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create conservation tips table
CREATE TABLE public.conservation_tips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'rainwater_harvesting', 'irrigation_efficiency', 'recharge', 'usage_reduction'
  difficulty_level TEXT DEFAULT 'easy', -- 'easy', 'medium', 'advanced'
  cost_range TEXT, -- 'low', 'medium', 'high'
  applicable_locations TEXT[], -- states/regions where applicable
  implementation_steps TEXT[],
  expected_impact TEXT,
  seasonal_relevance TEXT[], -- months when most relevant
  source_document TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', title || ' ' || description || ' ' || category)
  ) STORED
);

-- Enable RLS on all tables
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.government_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_resources_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conservation_tips ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Allow public read access to knowledge base" 
ON public.knowledge_base FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to government schemes" 
ON public.government_schemes FOR SELECT 
USING (is_active = true);

CREATE POLICY "Allow public read access to water insights" 
ON public.water_resources_insights FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to conservation tips" 
ON public.conservation_tips FOR SELECT 
USING (true);

-- Create indexes for better search performance
CREATE INDEX idx_knowledge_base_search ON public.knowledge_base USING GIN(search_vector);
CREATE INDEX idx_knowledge_base_category ON public.knowledge_base(category);
CREATE INDEX idx_knowledge_base_state ON public.knowledge_base(state_id);

CREATE INDEX idx_schemes_search ON public.government_schemes USING GIN(search_vector);
CREATE INDEX idx_schemes_type ON public.government_schemes(scheme_type);
CREATE INDEX idx_schemes_active ON public.government_schemes(is_active);

CREATE INDEX idx_water_insights_location ON public.water_resources_insights(location_type, state_id, district_id);
CREATE INDEX idx_water_insights_type ON public.water_resources_insights(insight_type);
CREATE INDEX idx_water_insights_status ON public.water_resources_insights(status_category);

CREATE INDEX idx_conservation_tips_search ON public.conservation_tips USING GIN(search_vector);
CREATE INDEX idx_conservation_tips_category ON public.conservation_tips(category);

-- Create triggers for updating timestamps
CREATE TRIGGER update_knowledge_base_updated_at
  BEFORE UPDATE ON public.knowledge_base
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_schemes_updated_at
  BEFORE UPDATE ON public.government_schemes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_water_insights_updated_at
  BEFORE UPDATE ON public.water_resources_insights
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conservation_tips_updated_at
  BEFORE UPDATE ON public.conservation_tips
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();