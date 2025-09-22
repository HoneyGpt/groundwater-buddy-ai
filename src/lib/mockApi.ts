// Mock API utilities for INGRES-AI
// These will be replaced with real INGRES API endpoints

export interface LocationData {
  state: string;
  district: string;
  city: string;
}

export interface GroundwaterStatus {
  blockId: string;
  blockName: string;
  status: 'Safe' | 'Semi-Critical' | 'Critical' | 'Over-Exploited';
  extractionPercentage: number;
  lastUpdated: string;
  coordinates: [number, number];
}

export interface Alert {
  id: string;
  type: 'crisis' | 'scheme' | 'weather';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  coordinates: [number, number];
  helplineNumber?: string;
}

export interface Scheme {
  id: string;
  name: string;
  description: string;
  eligibility: string;
  documentsRequired: string[];
  applicationLink: string;
  deadline?: string;
  state: string;
  district?: string;
}

export const mockApi = {
  // Location APIs
  async getStates(): Promise<string[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
      'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
      'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
      'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
      'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
      'Uttarakhand', 'West Bengal'
    ];
  },

  async getDistricts(state: string): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock districts based on state
    const districtMap: Record<string, string[]> = {
      'Telangana': [
        'Hyderabad', 'Adilabad', 'Bhadradri Kothagudem', 'Jagtial', 'Jangaon',
        'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar',
        'Khammam', 'Komaram Bheem Asifabad', 'Mahabubabad', 'Mahabubnagar',
        'Mancherial', 'Medak', 'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool',
        'Nalgonda', 'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli',
        'Rajanna Sircilla', 'Ranga Reddy', 'Sangareddy', 'Siddipet',
        'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal Rural', 'Warangal Urban',
        'Yadadri Bhuvanagiri'
      ],
      'Karnataka': [
        'Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban',
        'Bidar', 'Chamarajanagar', 'Chikballapur', 'Chikkamagaluru', 'Chitradurga',
        'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan',
        'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya',
        'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru',
        'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir'
      ]
    };

    return districtMap[state] || ['District 1', 'District 2', 'District 3'];
  },

  async reverseGeocode(lat: number, lon: number): Promise<LocationData> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock reverse geocoding - in reality this would call a geocoding service
    return {
      state: 'Telangana',
      district: 'Hyderabad',
      city: 'Secunderabad'
    };
  },

  // INGRES Data APIs
  async getGroundwaterStatus(state: string, district?: string, city?: string): Promise<GroundwaterStatus[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Mock groundwater data
    const mockData: GroundwaterStatus[] = [
      {
        blockId: 'TG_HYD_001',
        blockName: 'Secunderabad',
        status: 'Semi-Critical',
        extractionPercentage: 72,
        lastUpdated: '2024-01-15',
        coordinates: [17.4399, 78.4983]
      },
      {
        blockId: 'TG_HYD_002', 
        blockName: 'Kukatpally',
        status: 'Critical',
        extractionPercentage: 89,
        lastUpdated: '2024-01-15',
        coordinates: [17.4850, 78.4867]
      },
      {
        blockId: 'TG_HYD_003',
        blockName: 'Jubilee Hills',
        status: 'Safe',
        extractionPercentage: 45,
        lastUpdated: '2024-01-15',
        coordinates: [17.4326, 78.4071]
      }
    ];

    return mockData.filter(block => 
      !city || block.blockName.toLowerCase().includes(city.toLowerCase())
    );
  },

  async getAlerts(lat: number, lon: number, radius: number = 50): Promise<Alert[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: 'alert_001',
        type: 'crisis',
        severity: 'high',
        title: 'Water Level Critical',
        description: 'Groundwater levels have dropped below critical threshold in this area.',
        coordinates: [17.4399, 78.4983],
        helplineNumber: '+91-40-23456789'
      },
      {
        id: 'alert_002',
        type: 'scheme',
        severity: 'medium',
        title: 'New Recharge Scheme Available',
        description: 'Apply for rainwater harvesting subsidy - deadline March 31st.',
        coordinates: [17.4850, 78.4867]
      }
    ];
  },

  async getSchemes(state: string, district?: string): Promise<Scheme[]> {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    return [
      {
        id: 'scheme_001',
        name: 'Rainwater Harvesting Subsidy',
        description: 'Get 50% subsidy for rainwater harvesting structures up to ₹25,000',
        eligibility: 'Farmers with land area > 1 acre',
        documentsRequired: ['Land Records', 'Aadhaar Card', 'Bank Passbook'],
        applicationLink: 'https://example.com/apply/rwh',
        deadline: '2024-03-31',
        state: state,
        district: district
      },
      {
        id: 'scheme_002',
        name: 'Drip Irrigation Support',
        description: 'Financial assistance for micro-irrigation systems',
        eligibility: 'Small and marginal farmers',
        documentsRequired: ['Farmer ID', 'Land Documents', 'Quotation'],
        applicationLink: 'https://example.com/apply/drip',
        state: state,
        district: district
      },
      {
        id: 'scheme_003',
        name: 'Well Recharge Program',
        description: 'Technical support and materials for well recharge structures',
        eligibility: 'Farmers with existing bore wells',
        documentsRequired: ['Well License', 'Land Records'],
        applicationLink: 'https://example.com/apply/recharge',
        state: state,
        district: district
      }
    ];
  },

  // Chat API
  async sendChatMessage(message: string, profile?: any): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock AI responses based on common queries
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('groundwater') && lowerMessage.includes('status')) {
      return `Based on the latest INGRES data, your area shows Semi-Critical groundwater levels (72% extraction). I recommend reducing water usage and considering rainwater harvesting. Would you like me to show nearby recharge schemes? 💧`;
    }
    
    if (lowerMessage.includes('scheme') || lowerMessage.includes('subsidy')) {
      return `Great! There are 3 active schemes in your area:\n\n1. Rainwater Harvesting Subsidy (50% up to ₹25,000)\n2. Drip Irrigation Support\n3. Well Recharge Program\n\nWhich one interests you most? I can help with the application process! 🌱`;
    }
    
    if (lowerMessage.includes('crop') || lowerMessage.includes('water')) {
      return `For your area's current water situation, I suggest:\n• Switch to drought-resistant crops like millets\n• Use drip irrigation to save 40% water\n• Harvest rainwater during monsoon\n\nWant specific crop recommendations for your soil type? 🌾`;
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      const name = profile?.name || 'friend';
      return `Hello ${name}! 🤗 I'm here to help with groundwater information, farming tips, and government schemes. What would you like to know about?`;
    }
    
    // Default response
    return `I understand you're asking about "${message}". As your groundwater assistant, I can help with water levels, farming advice, government schemes, and conservation tips. Could you be more specific about what you'd like to know? 💧`;
  }
};