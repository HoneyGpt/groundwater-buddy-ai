-- Create comprehensive groundwater database schema for INGRES-AI

-- States master table
CREATE TABLE IF NOT EXISTS public.states (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Districts table
CREATE TABLE IF NOT EXISTS public.districts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  state_id UUID NOT NULL REFERENCES public.states(id) ON DELETE CASCADE,
  code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(name, state_id)
);

-- Assessment units (blocks/taluks/mandals)
CREATE TABLE IF NOT EXISTS public.assessment_units (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  district_id UUID NOT NULL REFERENCES public.districts(id) ON DELETE CASCADE,
  unit_type TEXT DEFAULT 'block', -- block, taluk, mandal, etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(name, district_id)
);

-- Main groundwater assessments table
CREATE TABLE IF NOT EXISTS public.groundwater_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_year TEXT NOT NULL,
  state_id UUID NOT NULL REFERENCES public.states(id),
  district_id UUID NOT NULL REFERENCES public.districts(id),
  assessment_unit_id UUID REFERENCES public.assessment_units(id),
  
  -- Geographic data
  total_geographical_area_ha DECIMAL,
  recharge_worthy_area_ha DECIMAL,
  hilly_area_ha DECIMAL,
  
  -- Rainfall data
  rainfall_mm DECIMAL,
  
  -- Ground water recharge data (in ham - hectare meters)
  rainfall_recharge_ham DECIMAL,
  canal_recharge_ham DECIMAL,
  surface_irrigation_recharge_ham DECIMAL,
  groundwater_irrigation_recharge_ham DECIMAL,
  tanks_ponds_recharge_ham DECIMAL,
  conservation_structure_recharge_ham DECIMAL,
  pipeline_recharge_ham DECIMAL,
  sewage_flood_recharge_ham DECIMAL,
  total_annual_recharge_ham DECIMAL,
  
  -- Inflows and outflows
  base_flow_ham DECIMAL,
  stream_recharge_ham DECIMAL,
  lateral_flows_ham DECIMAL,
  vertical_flows_ham DECIMAL,
  evaporation_ham DECIMAL,
  transpiration_ham DECIMAL,
  evapotranspiration_ham DECIMAL,
  
  -- Environmental flows
  environmental_flows_ham DECIMAL,
  
  -- Extractable resources
  annual_extractable_resource_ham DECIMAL,
  
  -- Ground water extraction
  domestic_extraction_ham DECIMAL,
  industrial_extraction_ham DECIMAL,
  irrigation_extraction_ham DECIMAL,
  total_extraction_ham DECIMAL,
  
  -- Stage of extraction
  stage_of_extraction_percent DECIMAL,
  
  -- Allocation and availability
  domestic_allocation_2025_ham DECIMAL,
  net_annual_availability_ham DECIMAL,
  
  -- Quality indicators
  quality_safe BOOLEAN DEFAULT false,
  quality_critical BOOLEAN DEFAULT false,
  quality_semi_critical BOOLEAN DEFAULT false,
  quality_over_exploited BOOLEAN DEFAULT false,
  
  -- Additional resources
  additional_potential_resources_ham DECIMAL,
  
  -- Coastal area indicators
  is_coastal_area BOOLEAN DEFAULT false,
  
  -- Water table conditions
  waterlogged_area BOOLEAN DEFAULT false,
  shallow_water_table BOOLEAN DEFAULT false,
  flood_prone BOOLEAN DEFAULT false,
  spring_discharge BOOLEAN DEFAULT false,
  
  -- Aquifer data
  unconfined_groundwater_resources_ham DECIMAL,
  confined_groundwater_resources_ham DECIMAL,
  semi_confined_groundwater_resources_ham DECIMAL,
  total_groundwater_availability_ham DECIMAL,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(assessment_year, state_id, district_id, assessment_unit_id)
);

-- Water quality parameters table
CREATE TABLE IF NOT EXISTS public.water_quality_parameters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID NOT NULL REFERENCES public.groundwater_assessments(id) ON DELETE CASCADE,
  parameter_name TEXT NOT NULL,
  parameter_value DECIMAL,
  unit TEXT,
  is_within_limits BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Groundwater schemes table
CREATE TABLE IF NOT EXISTS public.groundwater_schemes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scheme_name TEXT NOT NULL,
  scheme_type TEXT, -- recharge, conservation, etc.
  state_id UUID REFERENCES public.states(id),
  district_id UUID REFERENCES public.districts(id),
  eligibility_criteria TEXT,
  budget_allocation DECIMAL,
  application_deadline DATE,
  official_link TEXT,
  contact_number TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Alerts and notifications table
CREATE TABLE IF NOT EXISTS public.groundwater_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type TEXT NOT NULL, -- critical, warning, info
  message TEXT NOT NULL,
  state_id UUID REFERENCES public.states(id),
  district_id UUID REFERENCES public.districts(id),
  assessment_unit_id UUID REFERENCES public.assessment_units(id),
  severity_level INTEGER DEFAULT 1, -- 1-5 scale
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groundwater_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_quality_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groundwater_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groundwater_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is public groundwater data)
CREATE POLICY "Allow public read access to states" 
ON public.states FOR SELECT USING (true);

CREATE POLICY "Allow public read access to districts" 
ON public.districts FOR SELECT USING (true);

CREATE POLICY "Allow public read access to assessment units" 
ON public.assessment_units FOR SELECT USING (true);

CREATE POLICY "Allow public read access to groundwater assessments" 
ON public.groundwater_assessments FOR SELECT USING (true);

CREATE POLICY "Allow public read access to water quality parameters" 
ON public.water_quality_parameters FOR SELECT USING (true);

CREATE POLICY "Allow public read access to active groundwater schemes" 
ON public.groundwater_schemes FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read access to active alerts" 
ON public.groundwater_alerts FOR SELECT USING (is_active = true);

-- Create indexes for better performance
CREATE INDEX idx_districts_state_id ON public.districts(state_id);
CREATE INDEX idx_assessment_units_district_id ON public.assessment_units(district_id);
CREATE INDEX idx_groundwater_assessments_state_district ON public.groundwater_assessments(state_id, district_id);
CREATE INDEX idx_groundwater_assessments_year ON public.groundwater_assessments(assessment_year);
CREATE INDEX idx_groundwater_assessments_extraction_stage ON public.groundwater_assessments(stage_of_extraction_percent);
CREATE INDEX idx_water_quality_assessment_id ON public.water_quality_parameters(assessment_id);
CREATE INDEX idx_schemes_state_district ON public.groundwater_schemes(state_id, district_id);
CREATE INDEX idx_alerts_state_district ON public.groundwater_alerts(state_id, district_id, is_active);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_states_updated_at
  BEFORE UPDATE ON public.states
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_districts_updated_at
  BEFORE UPDATE ON public.districts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assessment_units_updated_at
  BEFORE UPDATE ON public.assessment_units
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_groundwater_assessments_updated_at
  BEFORE UPDATE ON public.groundwater_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_groundwater_schemes_updated_at
  BEFORE UPDATE ON public.groundwater_schemes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample states from the data
INSERT INTO public.states (name, code) VALUES 
  ('ANDAMAN AND NICOBAR ISLANDS', 'AN'),
  ('ANDHRA PRADESH', 'AP')
ON CONFLICT (name) DO NOTHING;