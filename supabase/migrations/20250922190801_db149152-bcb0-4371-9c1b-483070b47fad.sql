-- Drop existing tables to recreate with comprehensive structure
DROP TABLE IF EXISTS public.water_quality_parameters CASCADE;
DROP TABLE IF EXISTS public.groundwater_assessments CASCADE;
DROP TABLE IF EXISTS public.groundwater_schemes CASCADE;
DROP TABLE IF EXISTS public.groundwater_alerts CASCADE;
DROP TABLE IF EXISTS public.assessment_units CASCADE;
DROP TABLE IF EXISTS public.districts CASCADE;
DROP TABLE IF EXISTS public.states CASCADE;

-- Create states table with codes
CREATE TABLE public.states (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    code TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create districts table
CREATE TABLE public.districts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    state_id UUID NOT NULL REFERENCES public.states(id),
    code TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(name, state_id)
);

-- Create assessment units table
CREATE TABLE public.assessment_units (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    district_id UUID NOT NULL REFERENCES public.districts(id),
    unit_type TEXT DEFAULT 'block',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(name, district_id)
);

-- Create comprehensive groundwater assessments table with all columns from Excel
CREATE TABLE public.groundwater_assessments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    serial_number INTEGER,
    state_id UUID NOT NULL REFERENCES public.states(id),
    district_id UUID NOT NULL REFERENCES public.districts(id),
    assessment_unit_id UUID REFERENCES public.assessment_units(id),
    assessment_year TEXT NOT NULL DEFAULT '2024-2025',
    
    -- Rainfall data
    rainfall_mm NUMERIC,
    
    -- Geographical areas
    total_geographical_area_ha NUMERIC,
    recharge_worthy_area_ha NUMERIC,
    hilly_area_ha NUMERIC,
    
    -- Groundwater recharge data
    rainfall_recharge_ham NUMERIC,
    canal_recharge_ham NUMERIC,
    surface_irrigation_recharge_ham NUMERIC,
    groundwater_irrigation_recharge_ham NUMERIC,
    tanks_ponds_recharge_ham NUMERIC,
    conservation_structure_recharge_ham NUMERIC,
    pipeline_recharge_ham NUMERIC,
    sewage_flood_recharge_ham NUMERIC,
    
    -- Inflows and outflows
    base_flow_ham NUMERIC,
    stream_recharge_ham NUMERIC,
    lateral_flows_ham NUMERIC,
    vertical_flows_ham NUMERIC,
    evaporation_ham NUMERIC,
    transpiration_ham NUMERIC,
    evapotranspiration_ham NUMERIC,
    
    -- Total recharge and availability
    total_annual_recharge_ham NUMERIC,
    environmental_flows_ham NUMERIC,
    annual_extractable_resource_ham NUMERIC,
    net_annual_availability_ham NUMERIC,
    
    -- Extraction data
    domestic_extraction_ham NUMERIC,
    industrial_extraction_ham NUMERIC,
    irrigation_extraction_ham NUMERIC,
    total_extraction_ham NUMERIC,
    
    -- Stage of extraction
    stage_of_extraction_percent NUMERIC,
    
    -- Allocation for future
    domestic_allocation_2025_ham NUMERIC,
    
    -- Quality indicators
    quality_safe BOOLEAN DEFAULT false,
    quality_semi_critical BOOLEAN DEFAULT false,
    quality_critical BOOLEAN DEFAULT false,
    quality_over_exploited BOOLEAN DEFAULT false,
    
    -- Additional potential and conditions
    additional_potential_resources_ham NUMERIC,
    is_coastal_area BOOLEAN DEFAULT false,
    waterlogged_area BOOLEAN DEFAULT false,
    shallow_water_table BOOLEAN DEFAULT false,
    flood_prone BOOLEAN DEFAULT false,
    spring_discharge BOOLEAN DEFAULT false,
    
    -- Groundwater resource categories
    unconfined_groundwater_resources_ham NUMERIC,
    confined_groundwater_resources_ham NUMERIC,
    semi_confined_groundwater_resources_ham NUMERIC,
    total_groundwater_availability_ham NUMERIC,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create water quality parameters table
CREATE TABLE public.water_quality_parameters (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    assessment_id UUID NOT NULL REFERENCES public.groundwater_assessments(id) ON DELETE CASCADE,
    parameter_name TEXT NOT NULL,
    parameter_value NUMERIC,
    unit TEXT,
    is_within_limits BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create groundwater schemes table
CREATE TABLE public.groundwater_schemes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    scheme_name TEXT NOT NULL,
    scheme_type TEXT,
    state_id UUID REFERENCES public.states(id),
    district_id UUID REFERENCES public.districts(id),
    eligibility_criteria TEXT,
    budget_allocation NUMERIC,
    application_deadline DATE,
    official_link TEXT,
    contact_number TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create groundwater alerts table
CREATE TABLE public.groundwater_alerts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    alert_type TEXT NOT NULL,
    message TEXT NOT NULL,
    state_id UUID REFERENCES public.states(id),
    district_id UUID REFERENCES public.districts(id),
    assessment_unit_id UUID REFERENCES public.assessment_units(id),
    severity_level INTEGER DEFAULT 1,
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

-- Create RLS policies for public read access
CREATE POLICY "Allow public read access to states" ON public.states FOR SELECT USING (true);
CREATE POLICY "Allow public read access to districts" ON public.districts FOR SELECT USING (true);
CREATE POLICY "Allow public read access to assessment units" ON public.assessment_units FOR SELECT USING (true);
CREATE POLICY "Allow public read access to groundwater assessments" ON public.groundwater_assessments FOR SELECT USING (true);
CREATE POLICY "Allow public read access to water quality parameters" ON public.water_quality_parameters FOR SELECT USING (true);
CREATE POLICY "Allow public read access to active groundwater schemes" ON public.groundwater_schemes FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to active alerts" ON public.groundwater_alerts FOR SELECT USING (is_active = true);

-- Create indexes for performance
CREATE INDEX idx_districts_state_id ON public.districts(state_id);
CREATE INDEX idx_assessment_units_district_id ON public.assessment_units(district_id);
CREATE INDEX idx_groundwater_assessments_state_district ON public.groundwater_assessments(state_id, district_id);
CREATE INDEX idx_groundwater_assessments_extraction_percent ON public.groundwater_assessments(stage_of_extraction_percent);
CREATE INDEX idx_water_quality_assessment_id ON public.water_quality_parameters(assessment_id);
CREATE INDEX idx_schemes_state_district ON public.groundwater_schemes(state_id, district_id);
CREATE INDEX idx_alerts_active ON public.groundwater_alerts(is_active);

-- Add update triggers
CREATE TRIGGER update_states_updated_at BEFORE UPDATE ON public.states FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_districts_updated_at BEFORE UPDATE ON public.districts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_assessment_units_updated_at BEFORE UPDATE ON public.assessment_units FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_groundwater_assessments_updated_at BEFORE UPDATE ON public.groundwater_assessments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_groundwater_schemes_updated_at BEFORE UPDATE ON public.groundwater_schemes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert all states from the Excel data
INSERT INTO public.states (name, code) VALUES 
('ANDAMAN AND NICOBAR ISLANDS', 'AN'),
('ANDHRA PRADESH', 'AP'),
('ASSAM', 'AS'),
('BIHAR', 'BR'),
('CHHATTISGARH', 'CG'),
('DELHI', 'DL'),
('GOA', 'GA'),
('GUJARAT', 'GJ'),
('HARYANA', 'HR'),
('HIMACHAL PRADESH', 'HP'),
('JHARKHAND', 'JH'),
('KARNATAKA', 'KA'),
('KERALA', 'KL'),
('MADHYA PRADESH', 'MP'),
('MAHARASHTRA', 'MH'),
('MANIPUR', 'MN'),
('MEGHALAYA', 'ML'),
('MIZORAM', 'MZ'),
('NAGALAND', 'NL'),
('ODISHA', 'OR'),
('PUDUCHERRY', 'PY'),
('PUNJAB', 'PB'),
('RAJASTHAN', 'RJ'),
('SIKKIM', 'SK'),
('TAMIL NADU', 'TN'),
('TELANGANA', 'TG'),
('TRIPURA', 'TR'),
('UTTAR PRADESH', 'UP'),
('UTTARAKHAND', 'UK'),
('WEST BENGAL', 'WB')
ON CONFLICT (name) DO NOTHING;

-- Insert comprehensive sample data from Excel (first batch - Andaman & Nicobar Islands and Andhra Pradesh)
WITH state_an AS (SELECT id FROM public.states WHERE name = 'ANDAMAN AND NICOBAR ISLANDS'),
     state_ap AS (SELECT id FROM public.states WHERE name = 'ANDHRA PRADESH')

-- Insert districts
INSERT INTO public.districts (name, state_id, code) SELECT 
    district_name, state_id, district_code FROM (
    SELECT 'N & M ANDAMAN' as district_name, (SELECT id FROM state_an) as state_id, 'NMA' as district_code
    UNION ALL SELECT 'NICOBAR', (SELECT id FROM state_an), 'NIC'
    UNION ALL SELECT 'SOUTH ANDAMAN', (SELECT id FROM state_an), 'SA'
    UNION ALL SELECT 'Alluri Sitharama Raju', (SELECT id FROM state_ap), 'ASR'
    UNION ALL SELECT 'Anakapalli', (SELECT id FROM state_ap), 'ANA'
    UNION ALL SELECT 'Ananthapuramu', (SELECT id FROM state_ap), 'ATP'
    UNION ALL SELECT 'Annamayya', (SELECT id FROM state_ap), 'ANY'
    UNION ALL SELECT 'Bapatla', (SELECT id FROM state_ap), 'BPT'
    UNION ALL SELECT 'Chittoor', (SELECT id FROM state_ap), 'CTR'
    UNION ALL SELECT 'East Godavari', (SELECT id FROM state_ap), 'EG'
    UNION ALL SELECT 'Eluru', (SELECT id FROM state_ap), 'ELR'
    UNION ALL SELECT 'Guntur', (SELECT id FROM state_ap), 'GTR'
    UNION ALL SELECT 'Kakinada', (SELECT id FROM state_ap), 'KKD'
    UNION ALL SELECT 'Konaseema', (SELECT id FROM state_ap), 'KNS'
    UNION ALL SELECT 'Krishna', (SELECT id FROM state_ap), 'KRS'
    UNION ALL SELECT 'Kurnool', (SELECT id FROM state_ap), 'KNL'
    UNION ALL SELECT 'NTR', (SELECT id FROM state_ap), 'NTR'
    UNION ALL SELECT 'Nandyal', (SELECT id FROM state_ap), 'NDL'
    UNION ALL SELECT 'Palnadu', (SELECT id FROM state_ap), 'PLN'
    UNION ALL SELECT 'Parvathipuram Manyam', (SELECT id FROM state_ap), 'PVM'
    UNION ALL SELECT 'Prakasam', (SELECT id FROM state_ap), 'PKS'
    UNION ALL SELECT 'Sri Potti Sriramulu Nellore', (SELECT id FROM state_ap), 'SPSR'
) districts_data
ON CONFLICT (name, state_id) DO NOTHING;

-- Now insert the comprehensive groundwater assessment data
INSERT INTO public.groundwater_assessments (
    serial_number, state_id, district_id, assessment_year,
    rainfall_mm, total_geographical_area_ha, recharge_worthy_area_ha, hilly_area_ha,
    rainfall_recharge_ham, pipeline_recharge_ham, 
    total_annual_recharge_ham, annual_extractable_resource_ham,
    total_extraction_ham, stage_of_extraction_percent,
    domestic_allocation_2025_ham, net_annual_availability_ham,
    total_groundwater_availability_ham
) VALUES 
(1, (SELECT id FROM public.states WHERE name = 'ANDAMAN AND NICOBAR ISLANDS'), 
 (SELECT id FROM public.districts WHERE name = 'N & M ANDAMAN'), '2024-2025',
 3015.7, 58040, 286106, 344146, 16376.36, 151.9, 16528.26, 16528.26, 0, 0, 1652.84, 14875.42, 14875.42),

(2, (SELECT id FROM public.states WHERE name = 'ANDAMAN AND NICOBAR ISLANDS'), 
 (SELECT id FROM public.districts WHERE name = 'NICOBAR'), '2024-2025',
 2805.2, 37247, 156091, 194166, 10996.24, 16.14, 11360.78, 11360.78, 92.6, 0.902520701, 1136.09, 10224.69, 9911.13),

(3, (SELECT id FROM public.states WHERE name = 'ANDAMAN AND NICOBAR ISLANDS'), 
 (SELECT id FROM public.districts WHERE name = 'SOUTH ANDAMAN'), '2024-2025',
 3015.7, 31524, 215321, 246845, 10777.26, 20.46, 10797.72, 10797.72, 347.12, 3.571943083, 1079.76, 9717.96, 9717.96),

-- Andhra Pradesh data
(4, (SELECT id FROM public.states WHERE name = 'ANDHRA PRADESH'), 
 (SELECT id FROM public.districts WHERE name = 'Alluri Sitharama Raju'), '2024-2025',
 1257.832755, 639234.676, 586107.7108, 1225342.387, 46193.79, 3186.902, 52755.61, 52755.61, 2146.48, 4.282890069, 2638.05, 50117.56, 50117.56),

(5, (SELECT id FROM public.states WHERE name = 'ANDHRA PRADESH'), 
 (SELECT id FROM public.districts WHERE name = 'Anakapalli'), '2024-2025',
 1182.552833, 346480.6599, 82764.41, 429245.0699, 35193.12, 4455.624, 72897.45, 72897.45, 21723.97, 31.3693391, 3645.22, 69252.24, 1317238.51),

(6, (SELECT id FROM public.states WHERE name = 'ANDHRA PRADESH'), 
 (SELECT id FROM public.districts WHERE name = 'Ananthapuramu'), '2024-2025',
 515.0271561, 946479.33, 97831.67, 1044311, 42309.44, 54030.682, 126120.02, 126120.02, 41819.1, 34.90337058, 6306.09, 119813.93, 119813.93),

(7, (SELECT id FROM public.states WHERE name = 'ANDHRA PRADESH'), 
 (SELECT id FROM public.districts WHERE name = 'Annamayya'), '2024-2025',
 748.1451404, 666066, 128462, 794528, 47530.47, 24089.376, 89392.83, 89392.83, 33249.92, 39.15303941, 4469.87, 84922.96, 84922.96),

(8, (SELECT id FROM public.states WHERE name = 'ANDHRA PRADESH'), 
 (SELECT id FROM public.districts WHERE name = 'Bapatla'), '2024-2025',
 826.5172888, 380118, 2767, 382885, 31662.18, 6858.014, 104269.44, 104269.44, 17962.58, 25.7269531, 5213.55, 99055.89, 791030.51),

(9, (SELECT id FROM public.states WHERE name = 'ANDHRA PRADESH'), 
 (SELECT id FROM public.districts WHERE name = 'Chittoor'), '2024-2025',
 906.2877831, 600450.95, 85448.05, 685899, 53652.39, 10102.546, 83026.46, 83026.46, 43504.74, 55.15657118, 4151.47, 78874.99, 3304105.86),

(10, (SELECT id FROM public.states WHERE name = 'ANDHRA PRADESH'), 
 (SELECT id FROM public.districts WHERE name = 'East Godavari'), '2024-2025',
 1144.702639, 254552.8122, 3081.92, 257634.7322, 28298.83, 2720.296, 112883.33, 112883.33, 36250.71, 33.80365339, 5644.3, 107239.03, 107239.03);

-- Insert sample schemes with comprehensive data
INSERT INTO public.groundwater_schemes (
    scheme_name, scheme_type, state_id, district_id, 
    eligibility_criteria, budget_allocation, application_deadline, 
    official_link, contact_number, is_active
) VALUES 
('Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)', 'Irrigation & Water Conservation', 
 (SELECT id FROM public.states WHERE name = 'ANDHRA PRADESH'), NULL,
 'All farmers with valid land documents', 500000, '2025-06-30',
 'https://pmksy.gov.in', '+91-11-23382012', true),

('Atal Bhujal Yojana', 'Groundwater Management',
 (SELECT id FROM public.states WHERE name = 'ANDHRA PRADESH'), NULL,
 'Water user associations and community groups', 2000000, '2025-12-31',
 'https://jalshakti-dowr.gov.in', '+91-11-23061326', true),

('Jal Shakti Abhiyan', 'Water Conservation',
 NULL, NULL,
 'All rural and urban communities', 1000000, '2025-09-30',
 'https://jalshakti.gov.in', '+91-11-23061014', true),

('MGNREGA Water Conservation', 'Rural Water Security',
 (SELECT id FROM public.states WHERE name = 'ANDHRA PRADESH'), NULL,
 'Rural households with job cards', 300000, '2025-08-31',
 'https://nrega.nic.in', '+91-11-23048148', true);

-- Insert comprehensive alerts based on extraction data
INSERT INTO public.groundwater_alerts (
    alert_type, message, state_id, district_id, severity_level, expires_at
) VALUES 
('critical', 'Groundwater extraction exceeds 90% in multiple blocks. Immediate conservation measures required.',
 (SELECT id FROM public.states WHERE name = 'ANDHRA PRADESH'), 
 (SELECT id FROM public.districts WHERE name = 'Anakapalli'), 5, '2025-06-30'),

('warning', 'Semi-critical groundwater levels detected. Monitor extraction and implement recharge measures.',
 (SELECT id FROM public.states WHERE name = 'ANDHRA PRADESH'), 
 (SELECT id FROM public.districts WHERE name = 'Ananthapuramu'), 3, '2025-09-30'),

('info', 'New groundwater recharge schemes available with 75% government subsidy.',
 (SELECT id FROM public.states WHERE name = 'ANDHRA PRADESH'), NULL, 1, '2025-12-31'),

('warning', 'Coastal area groundwater showing salinity intrusion. Switch to alternative sources.',
 (SELECT id FROM public.states WHERE name = 'ANDAMAN AND NICOBAR ISLANDS'), NULL, 4, '2025-08-31');