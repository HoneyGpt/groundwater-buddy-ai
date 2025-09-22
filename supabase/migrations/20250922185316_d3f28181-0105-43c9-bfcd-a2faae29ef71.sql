-- Populate districts from the uploaded data
INSERT INTO public.districts (name, state_id, code) 
SELECT DISTINCT 
  'N & M ANDAMAN' as name,
  s.id as state_id,
  'NANDA' as code
FROM public.states s 
WHERE s.name = 'ANDAMAN AND NICOBAR ISLANDS'
ON CONFLICT (name, state_id) DO NOTHING;

INSERT INTO public.districts (name, state_id, code) 
SELECT DISTINCT 
  'NICOBAR' as name,
  s.id as state_id,
  'NICO' as code
FROM public.states s 
WHERE s.name = 'ANDAMAN AND NICOBAR ISLANDS'
ON CONFLICT (name, state_id) DO NOTHING;

INSERT INTO public.districts (name, state_id, code) 
SELECT DISTINCT 
  'SOUTH ANDAMAN' as name,
  s.id as state_id,
  'SAND' as code
FROM public.states s 
WHERE s.name = 'ANDAMAN AND NICOBAR ISLANDS'
ON CONFLICT (name, state_id) DO NOTHING;

-- Sample Andhra Pradesh districts
INSERT INTO public.districts (name, state_id, code) VALUES 
  ((SELECT name FROM (VALUES 
    ('Alluri Sitharama Raju'), ('Anakapalli'), ('Ananthapuramu'), 
    ('Annamayya'), ('Bapatla'), ('Chittoor'), ('East Godavari'), 
    ('Eluru'), ('Guntur'), ('Kakinada'), ('Konaseema'), ('Krishna'),
    ('Kurnool'), ('NTR'), ('Nandyal'), ('Palnadu'), ('Parvathipuram Manyam'),
    ('Prakasam'), ('Sri Potti Sriramulu Nellore')
  ) AS t(name) LIMIT 1 OFFSET 0), 
  (SELECT id FROM public.states WHERE name = 'ANDHRA PRADESH'), 'ASR'),
  ((SELECT name FROM (VALUES 
    ('Alluri Sitharama Raju'), ('Anakapalli'), ('Ananthapuramu'), 
    ('Annamayya'), ('Bapatla'), ('Chittoor'), ('East Godavari'), 
    ('Eluru'), ('Guntur'), ('Kakinada'), ('Konaseema'), ('Krishna'),
    ('Kurnool'), ('NTR'), ('Nandyal'), ('Palnadu'), ('Parvathipuram Manyam'),
    ('Prakasam'), ('Sri Potti Sriramulu Nellore')
  ) AS t(name) LIMIT 1 OFFSET 1), 
  (SELECT id FROM public.states WHERE name = 'ANDHRA PRADESH'), 'ANK'),
  ((SELECT name FROM (VALUES 
    ('Alluri Sitharama Raju'), ('Anakapalli'), ('Ananthapuramu'), 
    ('Annamayya'), ('Bapatla'), ('Chittoor'), ('East Godavari'), 
    ('Eluru'), ('Guntur'), ('Kakinada'), ('Konaseema'), ('Krishna'),
    ('Kurnool'), ('NTR'), ('Nandyal'), ('Palnadu'), ('Parvathipuram Manyam'),
    ('Prakasam'), ('Sri Potti Sriramulu Nellore')
  ) AS t(name) LIMIT 1 OFFSET 2), 
  (SELECT id FROM public.states WHERE name = 'ANDHRA PRADESH'), 'ATP'),
  ((SELECT name FROM (VALUES 
    ('Alluri Sitharama Raju'), ('Anakapalli'), ('Ananthapuramu'), 
    ('Annamayya'), ('Bapatla'), ('Chittoor'), ('East Godavari'), 
    ('Eluru'), ('Guntur'), ('Kakinada'), ('Konaseema'), ('Krishna'),
    ('Kurnool'), ('NTR'), ('Nandyal'), ('Palnadu'), ('Parvathipuram Manyam'),
    ('Prakasam'), ('Sri Potti Sriramulu Nellore')
  ) AS t(name) LIMIT 1 OFFSET 3), 
  (SELECT id FROM public.states WHERE name = 'ANDHRA PRADESH'), 'ANM'),
  ((SELECT name FROM (VALUES 
    ('Alluri Sitharama Raju'), ('Anakapalli'), ('Ananthapuramu'), 
    ('Annamayya'), ('Bapatla'), ('Chittoor'), ('East Godavari'), 
    ('Eluru'), ('Guntur'), ('Kakinada'), ('Konaseema'), ('Krishna'),
    ('Kurnool'), ('NTR'), ('Nandyal'), ('Palnadu'), ('Parvathipuram Manyam'),
    ('Prakasam'), ('Sri Potti Sriramulu Nellore')
  ) AS t(name) LIMIT 1 OFFSET 4), 
  (SELECT id FROM public.states WHERE name = 'ANDHRA PRADESH'), 'BPT')
ON CONFLICT (name, state_id) DO NOTHING;

-- Insert sample groundwater assessment data from the Excel file
WITH states_data AS (
  SELECT id as state_id, name as state_name FROM public.states WHERE name IN ('ANDAMAN AND NICOBAR ISLANDS', 'ANDHRA PRADESH')
),
districts_data AS (
  SELECT d.id as district_id, d.name as district_name, s.state_id, s.state_name 
  FROM public.districts d 
  JOIN states_data s ON d.state_id = s.state_id
)
INSERT INTO public.groundwater_assessments (
  assessment_year,
  state_id,
  district_id,
  rainfall_mm,
  total_geographical_area_ha,
  recharge_worthy_area_ha,
  rainfall_recharge_ham,
  total_annual_recharge_ham,
  annual_extractable_resource_ham,
  total_extraction_ham,
  stage_of_extraction_percent,
  domestic_allocation_2025_ham,
  net_annual_availability_ham,
  quality_safe,
  quality_semi_critical,
  quality_critical,
  quality_over_exploited
) VALUES
-- Andaman and Nicobar Islands data
((SELECT '2024-2025'), 
 (SELECT state_id FROM districts_data WHERE district_name = 'N & M ANDAMAN'), 
 (SELECT district_id FROM districts_data WHERE district_name = 'N & M ANDAMAN'),
 3015.7, 58040, 3015.7, 16376.36, 16528.26, 14875.42, 346.11, 2.33, 269.19, 14522.18, 
 true, false, false, false),

((SELECT '2024-2025'), 
 (SELECT state_id FROM districts_data WHERE district_name = 'NICOBAR'), 
 (SELECT district_id FROM districts_data WHERE district_name = 'NICOBAR'),
 2805.2, 38075, 2805.2, 11344.64, 11360.78, 10224.69, 92.6, 0.90, 90.68, 9819.28, 
 true, false, false, false),

((SELECT '2024-2025'), 
 (SELECT state_id FROM districts_data WHERE district_name = 'SOUTH ANDAMAN'), 
 (SELECT district_id FROM districts_data WHERE district_name = 'SOUTH ANDAMAN'),
 3015.7, 31524, 3015.7, 10777.26, 10797.72, 9717.96, 347.12, 3.57, 331.62, 9362.07, 
 true, false, false, false),

-- Sample Andhra Pradesh data
((SELECT '2024-2025'), 
 (SELECT state_id FROM districts_data WHERE district_name = 'Anakapalli'), 
 (SELECT district_id FROM districts_data WHERE district_name = 'Anakapalli'),
 1182.55, 346480.66, 1176.35, 35193.12, 72897.45, 69252.24, 21723.97, 31.37, 8163.16, 45060.58, 
 false, true, false, false),

((SELECT '2024-2025'), 
 (SELECT state_id FROM districts_data WHERE district_name = 'Ananthapuramu'), 
 (SELECT district_id FROM districts_data WHERE district_name = 'Ananthapuramu'),
 515.03, 946479.33, 515.24, 42309.44, 126120.02, 119813.93, 41819.1, 34.90, 3466.8, 78907.83, 
 false, true, false, false)
ON CONFLICT (assessment_year, state_id, district_id, assessment_unit_id) DO NOTHING;

-- Insert sample groundwater schemes
INSERT INTO public.groundwater_schemes (
  scheme_name,
  scheme_type,
  state_id,
  district_id,
  eligibility_criteria,
  budget_allocation,
  application_deadline,
  official_link,
  contact_number,
  is_active
) VALUES
('Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)', 'recharge', 
 (SELECT id FROM public.states WHERE name = 'ANDHRA PRADESH'), 
 (SELECT id FROM public.districts WHERE name = 'Anakapalli' LIMIT 1),
 'Small and marginal farmers with land holding up to 5 acres', 
 50000000, 
 '2025-03-31', 
 'https://pmksy.gov.in/', 
 '+91-11-23382012',
 true),

('Atal Bhujal Yojana', 'conservation', 
 (SELECT id FROM public.states WHERE name = 'ANDHRA PRADESH'), 
 (SELECT id FROM public.districts WHERE name = 'Ananthapuramu' LIMIT 1),
 'Community participation in groundwater management', 
 60000000, 
 '2025-06-30', 
 'https://jalshakti-dowr.gov.in/schemes/atal-bhujal-yojana', 
 '+91-11-23062104',
 true),

('National Aquifer Mapping Programme', 'assessment', 
 (SELECT id FROM public.states WHERE name = 'ANDAMAN AND NICOBAR ISLANDS'), 
 null,
 'Scientific assessment of groundwater resources', 
 25000000, 
 '2025-12-31', 
 'https://cgwb.gov.in/naquim', 
 '+91-11-23073637',
 true)
ON CONFLICT DO NOTHING;

-- Insert sample alerts
INSERT INTO public.groundwater_alerts (
  alert_type,
  message,
  state_id,
  district_id,
  severity_level,
  is_active,
  expires_at
) VALUES
('warning', 
 'Groundwater extraction in Ananthapuramu district is at 34.90% - approaching semi-critical stage. Consider water conservation measures.',
 (SELECT id FROM public.states WHERE name = 'ANDHRA PRADESH'),
 (SELECT id FROM public.districts WHERE name = 'Ananthapuramu' LIMIT 1),
 3,
 true,
 '2025-12-31'),

('info', 
 'New recharge schemes available for farmers in Anakapalli district. Apply before March 31, 2025.',
 (SELECT id FROM public.states WHERE name = 'ANDHRA PRADESH'),
 (SELECT id FROM public.districts WHERE name = 'Anakapalli' LIMIT 1),
 2,
 true,
 '2025-03-31'),

('critical', 
 'Monsoon season approaching - optimal time for rainwater harvesting and recharge activities.',
 null,
 null,
 4,
 true,
 '2025-07-31')
ON CONFLICT DO NOTHING;