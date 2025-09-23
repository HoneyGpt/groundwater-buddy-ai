// Comprehensive Indian Helpline Numbers Database
// Converted from Python to TypeScript

export interface Helpline {
  id: string;
  authority: string;
  purpose: string;
  phone: string;
  category: string;
  state?: string;
  district?: string;
  priority: 'emergency' | 'high' | 'medium' | 'low';
}

// National Emergency Numbers
export const nationalNumbers = {
  "NATIONAL EMERGENCY NUMBER": "112",
  "POLICE": "100 or 112",
  "FIRE": "101",
  "AMBULANCE": "102",
  "Disaster Management Services": "108",
  "Women Helpline": "1091",
  "Women Helpline (Domestic Abuse)": "181",
  "Air Ambulance": "9540161344",
  "AIDS Helpline": "1097",
  "Anti Poison (New Delhi)": "1066 or 011-1066",
  "Disaster Management (N.D.M.A)": "1078, 011-26701700",
  "EARTHQUAKE/FLOOD/DISASTER (N.D.R.F Headquarters)": "011-24363260, 9711077372",
  "Railway Enquiry": "139",
  "Senior Citizen Helpline": "14567",
  "Road Accident Emergency Service": "1033",
  "Kisan Call Centre": "18001801551",
  "Relief Commissioner For Natural Calamities": "1070",
  "Children In Difficult Situation": "1098",
  "National Poisons Information Centre - AIIMS NEW DELHI (24*7)": "1800116117, 011-26593677, 26589391",
  "Poison Information Centre (CMC, Vellore)": "18004251213",
  "Tourist Helpline": "1363 or 1800111363",
  "LPG Leak Helpline": "1906",
  "KIRAN MENTAL HEALTH Helpline": "18005990019",
  "CYBER CRIME HELPLINE": "1930",
  "COVID 19 HELPLINE": "011-23978046 OR 1075"
};

// State-wise helpline numbers
export const stateNumbers = {
  "ANDHRA PRADESH": {
    "Centralized Helpline": "112",
    "Capital": "Vijayawada",
    "CM Helpline": "1902",
    "Police": "100 or 112",
    "Police Control Room Vijayawada": "0866-2576956, 9440906878",
    "Mahila Police Station Vijayawada": "0866-2490934",
    "Fire": "101",
    "EMRI/Ambulance": "108 or 102",
    "DISHA Helpline": "181 or 112",
    "SPANDANA (Citizen Grievance Centre)": "1902",
    "Corruption Grievances": "14400",
    "Railways Enquiry": "139",
    "Tourist Information Centre": "040-23262152/23262151",
    "Department of Tourism": "040-23453110"
  },
  "DELHI": {
    "STD Code": "011",
    "Centralized Helpline": "112",
    "Police": "112 or 011-27491106, 27491115",
    "Fire": "101",
    "Ambulance": "102",
    "Disaster Management Helpline": "1077",
    "Women Helpline": "1091",
    "Women Helpline (Domestic Abuse)": "181",
    "Child Helpline": "1098",
    "AIDS Helpline": "1097",
    "Anti Poison (New Delhi)": "1066"
  },
  "MAHARASHTRA": {
    "Centralized Helpline": "112",
    "Police": "100 or 112",
    "Fire": "101",
    "Ambulance": "102",
    "Women Helpline": "1091",
    "Child Helpline": "1098",
    "Mumbai Police Control": "022-22621855"
  }
};

// Structured helpline data for easy use in the component
export const helplineData: Helpline[] = [
  // National Emergency Numbers
  { id: '1', authority: 'National Emergency Services', purpose: 'All emergencies - Police, Fire, Medical', phone: '112', category: 'Emergency', priority: 'emergency' },
  { id: '2', authority: 'Police Services', purpose: 'Report crimes, law enforcement assistance', phone: '100', category: 'Police', priority: 'emergency' },
  { id: '3', authority: 'Fire Department', purpose: 'Fire emergencies, rescue operations', phone: '101', category: 'Fire', priority: 'emergency' },
  { id: '4', authority: 'Medical Emergency', purpose: 'Ambulance services, medical emergencies', phone: '102', category: 'Medical', priority: 'emergency' },
  { id: '5', authority: 'Disaster Management Services', purpose: 'Natural disasters, emergency response coordination', phone: '108', category: 'Disaster', priority: 'high' },
  { id: '6', authority: 'Women Helpline', purpose: 'Women safety, harassment, domestic violence support', phone: '1091', category: 'Women Safety', priority: 'high' },
  { id: '7', authority: 'Women Helpline (Domestic Abuse)', purpose: 'Domestic violence, abuse reporting and support', phone: '181', category: 'Women Safety', priority: 'high' },
  { id: '8', authority: 'Air Ambulance Services', purpose: 'Emergency air medical transport', phone: '9540161344', category: 'Medical', priority: 'high' },
  { id: '9', authority: 'AIDS Helpline', purpose: 'HIV/AIDS information, counseling, support', phone: '1097', category: 'Health', priority: 'medium' },
  { id: '10', authority: 'Anti Poison Centre (Delhi)', purpose: 'Poison control, emergency antidote information', phone: '1066', category: 'Medical', priority: 'high' },
  { id: '11', authority: 'NDMA Disaster Management', purpose: 'National disaster response coordination', phone: '1078', category: 'Disaster', priority: 'high' },
  { id: '12', authority: 'NDRF Headquarters', purpose: 'Earthquake, flood, disaster rescue operations', phone: '011-24363260', category: 'Disaster', priority: 'high' },
  { id: '13', authority: 'Railway Enquiry', purpose: 'Train schedules, booking, railway information', phone: '139', category: 'Transport', priority: 'medium' },
  { id: '14', authority: 'Senior Citizen Helpline', purpose: 'Elder care support, assistance for seniors', phone: '14567', category: 'Social', priority: 'medium' },
  { id: '15', authority: 'Road Accident Emergency', purpose: 'Road accident response, emergency assistance', phone: '1033', category: 'Emergency', priority: 'high' },
  { id: '16', authority: 'Kisan Call Centre', purpose: 'Farmer support, agriculture guidance, crop advice', phone: '18001801551', category: 'Agriculture', priority: 'medium' },
  { id: '17', authority: 'Relief Commissioner', purpose: 'Natural calamity relief, disaster compensation', phone: '1070', category: 'Disaster', priority: 'high' },
  { id: '18', authority: 'Child Helpline', purpose: 'Child safety, abuse reporting, child welfare', phone: '1098', category: 'Child Safety', priority: 'high' },
  { id: '19', authority: 'Tourist Helpline', purpose: 'Travel assistance, tourist information, help', phone: '1363', category: 'Tourism', priority: 'low' },
  { id: '20', authority: 'LPG Leak Emergency', purpose: 'Gas leak reporting, LPG safety emergencies', phone: '1906', category: 'Emergency', priority: 'high' },
  { id: '21', authority: 'KIRAN Mental Health', purpose: 'Mental health support, counseling, crisis intervention', phone: '18005990019', category: 'Mental Health', priority: 'high' },
  { id: '22', authority: 'Cyber Crime Helpline', purpose: 'Report online fraud, cyber crimes, digital safety', phone: '1930', category: 'Cyber Security', priority: 'medium' },
  { id: '23', authority: 'COVID-19 Helpline', purpose: 'COVID information, health guidelines, support', phone: '1075', category: 'Health', priority: 'medium' },
  
  // State-wise numbers (sample from major states)
  { id: '24', authority: 'Andhra Pradesh CM Helpline', purpose: 'Chief Minister grievance redressal, public issues', phone: '1902', category: 'Government', state: 'Andhra Pradesh', priority: 'medium' },
  { id: '25', authority: 'AP SPANDANA Citizen Centre', purpose: 'Citizen grievances, government service issues', phone: '1902', category: 'Government', state: 'Andhra Pradesh', priority: 'medium' },
  { id: '26', authority: 'AP DISHA Helpline', purpose: 'Women safety, harassment reporting in AP', phone: '181', category: 'Women Safety', state: 'Andhra Pradesh', priority: 'high' },
  { id: '27', authority: 'Delhi Police Control Room', purpose: 'Police assistance, crime reporting in Delhi', phone: '011-27491106', category: 'Police', state: 'Delhi', priority: 'high' },
  { id: '28', authority: 'Delhi Disaster Management', purpose: 'Emergency response, disaster coordination in Delhi', phone: '1077', category: 'Disaster', state: 'Delhi', priority: 'high' },
  { id: '29', authority: 'Mumbai Police Control', purpose: 'Police services, emergency response in Mumbai', phone: '022-22621855', category: 'Police', state: 'Maharashtra', district: 'Mumbai', priority: 'high' },
  { id: '30', authority: 'Karnataka CM Helpline', purpose: 'Chief Minister office, public grievances', phone: '080-22340676', category: 'Government', state: 'Karnataka', priority: 'medium' },
  { id: '31', authority: 'Tamil Nadu Health Helpline', purpose: 'Health services, medical assistance', phone: '044-29510500', category: 'Health', state: 'Tamil Nadu', priority: 'medium' },
  { id: '32', authority: 'Gujarat Emergency Services', purpose: 'Integrated emergency response', phone: '1070', category: 'Emergency', state: 'Gujarat', priority: 'high' },
  { id: '33', authority: 'Rajasthan Tourist Helpline', purpose: 'Tourist assistance, travel information', phone: '1363', category: 'Tourism', state: 'Rajasthan', priority: 'low' },
  { id: '34', authority: 'West Bengal Disaster Management', purpose: 'Disaster response, emergency coordination', phone: '1070', category: 'Disaster', state: 'West Bengal', priority: 'high' },
  { id: '35', authority: 'UP Women Helpline', purpose: 'Women safety, support services', phone: '1090', category: 'Women Safety', state: 'Uttar Pradesh', priority: 'high' },
  
  // Water-related helplines
  { id: '36', authority: 'Central Water Commission', purpose: 'Water resource management, flood forecasting', phone: '011-26105592', category: 'Water', priority: 'medium' },
  { id: '37', authority: 'Jal Shakti Ministry', purpose: 'Water supply issues, sanitation complaints', phone: '011-23061014', category: 'Water', priority: 'medium' },
  { id: '38', authority: 'Haryana Water Board', purpose: 'Groundwater information, water conservation', phone: '0172-2560349', category: 'Water', state: 'Haryana', priority: 'medium' },
  { id: '39', authority: 'Delhi Jal Board', purpose: 'Water supply complaints, billing issues', phone: '1916', category: 'Water', state: 'Delhi', priority: 'medium' },
  { id: '40', authority: 'Mumbai Water Department', purpose: 'Water supply, quality complaints', phone: '1916', category: 'Water', state: 'Maharashtra', district: 'Mumbai', priority: 'medium' }
];