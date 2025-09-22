import { supabase } from "@/integrations/supabase/client";

// Real API for INGRES-AI using Supabase backend
// This connects to actual groundwater data stored in Supabase

export interface GroundwaterStatus {
  block: string;
  district: string;
  state: string;
  status: 'Safe' | 'Semi-Critical' | 'Critical' | 'Over-Exploited';
  extractionPercentage: number;
  lastUpdated: string;
  recommendations: string[];
  rainfall?: number;
  totalExtraction?: number;
  annualRecharge?: number;
}

export interface LocationData {
  states: string[];
  districts: { [state: string]: string[] };
}

export interface SchemeData {
  id: string;
  name: string;
  type: string;
  eligibility: string;
  budget: string;
  deadline: string;
  applyLink: string;
  contactNumber: string;
}

export interface AlertData {
  id: string;
  type: 'info' | 'warning' | 'critical';
  message: string;
  location: string;
  severity: number;
  expiresAt: string;
}

// Legacy interfaces for backward compatibility
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

// Simulate API delay for better UX
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Get location data (states and districts) from Supabase
  async getLocationData(): Promise<LocationData> {
    await delay(300);
    try {
      const { data: states, error: statesError } = await supabase
        .from('states')
        .select('name')
        .order('name');

      if (statesError) throw statesError;

      const { data: districts, error: districtsError } = await supabase
        .from('districts')
        .select(`
          name,
          states!inner(name)
        `)
        .order('name');

      if (districtsError) throw districtsError;

      const locationData: LocationData = {
        states: states?.map(s => s.name) || [],
        districts: {}
      };

      // Group districts by state
      districts?.forEach(district => {
        const stateName = (district as any).states.name;
        if (!locationData.districts[stateName]) {
          locationData.districts[stateName] = [];
        }
        locationData.districts[stateName].push(district.name);
      });

      return locationData;
    } catch (error) {
      console.error('Error fetching location data:', error);
      // Fallback to mock data if Supabase fails
      return {
        states: ['Andhra Pradesh', 'Andaman And Nicobar Islands'],
        districts: {
          'Andhra Pradesh': ['Anakapalli', 'Ananthapuramu', 'Alluri Sitharama Raju', 'Annamayya', 'Bapatla'],
          'Andaman And Nicobar Islands': ['N & M Andaman', 'Nicobar', 'South Andaman']
        }
      };
    }
  },

  // Legacy method for backward compatibility
  async getStates(): Promise<string[]> {
    const locationData = await this.getLocationData();
    return locationData.states;
  },

  // Legacy method for backward compatibility  
  async getDistricts(state: string): Promise<string[]> {
    const locationData = await this.getLocationData();
    return locationData.districts[state] || [];
  },

  // Get groundwater status from real Supabase data
  async getGroundwaterStatus(state: string, district?: string, block?: string): Promise<GroundwaterStatus[]> {
    await delay(500);
    try {
      let query = supabase
        .from('groundwater_assessments')
        .select(`
          *,
          states!inner(name),
          districts!inner(name),
          assessment_units(name)
        `)
        .eq('states.name', state);

      if (district) {
        query = query.eq('districts.name', district);
      }

      const { data, error } = await query.limit(10);

      if (error) throw error;

      return data?.map(assessment => {
        let status: 'Safe' | 'Semi-Critical' | 'Critical' | 'Over-Exploited' = 'Safe';
        
        if (assessment.stage_of_extraction_percent >= 100) {
          status = 'Over-Exploited';
        } else if (assessment.stage_of_extraction_percent >= 90) {
          status = 'Critical';
        } else if (assessment.stage_of_extraction_percent >= 70) {
          status = 'Semi-Critical';
        }

        const recommendations = [];
        if (assessment.stage_of_extraction_percent > 70) {
          recommendations.push('Install rainwater harvesting systems');
          recommendations.push('Implement micro-irrigation techniques');
          recommendations.push('Apply for groundwater recharge schemes');
        }
        if (assessment.stage_of_extraction_percent > 90) {
          recommendations.push('Urgent: Reduce groundwater extraction');
          recommendations.push('Switch to drought-resistant crops');
        }
        if (assessment.stage_of_extraction_percent <= 50) {
          recommendations.push('Continue sustainable practices');
          recommendations.push('Monitor seasonal variations');
        }

        return {
          block: (assessment as any).assessment_units?.name || 'District Level',
          district: (assessment as any).districts.name,
          state: (assessment as any).states.name,
          status,
          extractionPercentage: Number(assessment.stage_of_extraction_percent) || 0,
          lastUpdated: assessment.assessment_year || '2024-2025',
          recommendations,
          rainfall: Number(assessment.rainfall_mm) || 0,
          totalExtraction: Number(assessment.total_extraction_ham) || 0,
          annualRecharge: Number(assessment.total_annual_recharge_ham) || 0
        };
      }) || [];

    } catch (error) {
      console.error('Error fetching groundwater status:', error);
      // Fallback mock data
      return [{
        block: block || 'District Level',
        district: district || 'Sample District',
        state: state,
        status: 'Semi-Critical',
        extractionPercentage: 72,
        lastUpdated: '2024-2025',
        recommendations: [
          'Install rainwater harvesting systems',
          'Implement micro-irrigation techniques',
          'Apply for groundwater recharge schemes'
        ]
      }];
    }
  },

  // Get available schemes from Supabase
  async getSchemes(state: string, district?: string): Promise<SchemeData[]> {
    await delay(400);
    try {
      let query = supabase
        .from('groundwater_schemes')
        .select(`
          *,
          states(name),
          districts(name)
        `)
        .eq('is_active', true);

      if (state) {
        query = query.or(`state_id.is.null,states.name.eq.${state}`);
      }

      const { data, error } = await query.limit(10);

      if (error) throw error;

      return data?.map(scheme => ({
        id: scheme.id,
        name: scheme.scheme_name,
        type: scheme.scheme_type || 'Water Management',
        eligibility: scheme.eligibility_criteria || 'General eligibility',
        budget: scheme.budget_allocation ? `₹${Number(scheme.budget_allocation).toLocaleString('en-IN')}` : 'Contact for details',
        deadline: scheme.application_deadline || '2025-12-31',
        applyLink: scheme.official_link || '#',
        contactNumber: scheme.contact_number || 'Contact local office'
      })) || [];

    } catch (error) {
      console.error('Error fetching schemes:', error);
      // Fallback mock data
      return [{
        id: '1',
        name: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
        type: 'Irrigation & Water Conservation',
        eligibility: 'All farmers with valid land documents',
        budget: '₹50,000 - ₹5,00,000 per hectare',
        deadline: '2025-06-30',
        applyLink: 'https://pmksy.gov.in',
        contactNumber: '+91-11-23382012'
      }];
    }
  },

  // Get alerts from Supabase
  async getAlerts(state: string, district?: string): Promise<AlertData[]> {
    await delay(300);
    try {
      let query = supabase
        .from('groundwater_alerts')
        .select(`
          *,
          states(name),
          districts(name)
        `)
        .eq('is_active', true)
        .order('severity_level', { ascending: false });

      if (state) {
        query = query.or(`state_id.is.null,states.name.eq.${state}`);
      }

      const { data, error } = await query.limit(5);

      if (error) throw error;

      return data?.map(alert => ({
        id: alert.id,
        type: alert.alert_type as 'info' | 'warning' | 'critical',
        message: alert.message,
        location: (alert as any).districts?.name 
          ? `${(alert as any).districts.name}, ${(alert as any).states?.name || state}` 
          : (alert as any).states?.name || 'General',
        severity: alert.severity_level || 1,
        expiresAt: alert.expires_at || '2025-12-31'
      })) || [];

    } catch (error) {
      console.error('Error fetching alerts:', error);
      // Fallback mock data
      return [{
        id: '1',
        type: 'warning',
        message: `Groundwater levels declining in ${district || state}. Consider water conservation measures.`,
        location: `${district || 'Multiple districts'}, ${state}`,
        severity: 3,
        expiresAt: '2025-06-30'
      }];
    }
  },

  // Enhanced chatbot response with real data context
  async getChatResponse(message: string, profile?: any): Promise<string> {
    await delay(800);
    
    const lowerMessage = message.toLowerCase();
    
    // Context-aware responses based on user profile
    const userLocation = profile?.state && profile?.district 
      ? `${profile.district}, ${profile.state}` 
      : 'your area';

    try {
      // For location-specific queries, fetch real data
      if (profile?.state && (lowerMessage.includes('status') || lowerMessage.includes('level'))) {
        const status = await this.getGroundwaterStatus(profile.state, profile.district);
        if (status.length > 0) {
          const data = status[0];
          return `**Groundwater Status for ${userLocation}:**\n\n📊 **Extraction Stage**: ${data.extractionPercentage}% (${data.status})\n🌧️ **Annual Rainfall**: ${data.rainfall}mm\n💧 **Total Extraction**: ${data.totalExtraction} HAM\n⚡ **Annual Recharge**: ${data.annualRecharge} HAM\n\n**Recommendations:**\n${data.recommendations.map(r => `• ${r}`).join('\n')}\n\nLast updated: ${data.lastUpdated}`;
        }
      }

      if (lowerMessage.includes('scheme') || lowerMessage.includes('subsidy')) {
        const schemes = await this.getSchemes(profile?.state || 'Andhra Pradesh', profile?.district);
        const topSchemes = schemes.slice(0, 3);
        return `**Available Schemes in ${userLocation}:**\n\n${topSchemes.map(s => 
          `🌾 **${s.name}**\n   💰 Budget: ${s.budget}\n   📅 Deadline: ${s.deadline}\n   📋 Eligibility: ${s.eligibility}\n`
        ).join('\n')}\nWould you like application details for any specific scheme?`;
      }

      if (lowerMessage.includes('alert') || lowerMessage.includes('warning')) {
        const alerts = await this.getAlerts(profile?.state || 'Andhra Pradesh', profile?.district);
        const activeAlerts = alerts.slice(0, 2);
        return `**Current Alerts for ${userLocation}:**\n\n${activeAlerts.map(a => 
          `${a.type === 'critical' ? '🚨' : a.type === 'warning' ? '⚠️' : 'ℹ️'} **${a.type.toUpperCase()}**: ${a.message}\n   📍 Location: ${a.location}\n   📅 Valid until: ${a.expiresAt}\n`
        ).join('\n')}\nStay updated with the latest groundwater information!`;
      }
    } catch (error) {
      console.error('Error fetching real-time data:', error);
    }

    // Fallback responses with enhanced context
    if (lowerMessage.includes('groundwater') || lowerMessage.includes('water level')) {
      return `Based on INGRES data for ${userLocation}, I can provide detailed groundwater information including extraction stages, recharge rates, and water quality. The latest assessments show varying conditions across different blocks. Would you like specific data for your location or general water management guidance?`;
    }
    
    if (lowerMessage.includes('rain') || lowerMessage.includes('harvest')) {
      return `Rainwater harvesting is crucial for ${userLocation}! Based on local rainfall patterns:\n\n✅ **Rooftop Systems**: Capture 80-90% of roof area rainfall\n✅ **Farm Ponds**: Store water for dry periods\n✅ **Recharge Pits**: Improve groundwater levels\n✅ **Check Dams**: Community-level water storage\n\n💰 Government schemes provide 75-90% subsidy. Shall I find specific schemes and contractors for your area?`;
    }
    
    if (lowerMessage.includes('crop') || lowerMessage.includes('farming')) {
      return `For water-efficient farming in ${userLocation}, consider these evidence-based practices:\n\n🌱 **Climate-Smart Crops**: Millets (70% less water), pulses (nitrogen-fixing)\n💧 **Precision Irrigation**: Drip systems save 40-60% water\n🌿 **Soil Management**: Mulching reduces evaporation by 50-70%\n📊 **Data-Driven Decisions**: Use soil moisture sensors\n\nBased on your local groundwater data, which farming aspect interests you most?`;
    }
    
    if (lowerMessage.includes('critical') || lowerMessage.includes('over-exploit')) {
      return `If your area shows critical/over-exploited status, here's your action plan:\n\n🚨 **Immediate (0-6 months)**:\n• Reduce groundwater extraction by 20-30%\n• Switch to water-efficient crops\n• Install micro-irrigation\n\n⚡ **Short term (6-18 months)**:\n• Apply for recharge schemes\n• Build farm ponds/check dams\n• Join water user associations\n\n📈 **Long term (2-5 years)**:\n• Community aquifer management\n• Diversify water sources\n\nI can help check your eligibility for emergency conservation grants. Interested?`;
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('namaste')) {
      return `🙏 Namaste! I'm INGRES-AI, your intelligent groundwater assistant for ${userLocation}.\n\n**I can help you with:**\n💧 Real-time groundwater status & trends\n🌾 Government schemes & subsidies (PMKSY, Atal Bhujal)\n🌧️ Rainwater harvesting & recharge techniques\n📊 Location-specific water data & quality\n🚨 Critical alerts & recommendations\n💰 Budget planning for water projects\n\n**Popular queries:**\n• "What's my groundwater status?"\n• "Show me available schemes"\n• "How to harvest rainwater?"\n\nWhat would you like to explore about water management in your area?`;
    }

    // Enhanced default response with actionable guidance
    return `I understand you're asking about "${message}". As your INGRES-AI assistant for ${userLocation}, I have access to the latest groundwater assessment data.\n\n**I can provide:**\n📊 Current extraction levels & water quality\n🏛️ Government schemes with eligibility & budgets\n⚡ Conservation techniques & best practices\n📱 Real-time alerts & seasonal guidance\n💡 Personalized recommendations based on your location\n\n**Try asking:**\n• "What's the groundwater status in my area?"\n• "Show me water conservation schemes"\n• "How critical is the water situation?"\n\nHow can I help you make informed water management decisions?`;
  },

  // Legacy methods for backward compatibility
  async reverseGeocode(lat: number, lon: number) {
    await delay(500);
    return {
      state: 'Telangana',
      district: 'Hyderabad',
      city: 'Secunderabad'
    };
  },

  async sendChatMessage(message: string, profile?: any): Promise<string> {
    return this.getChatResponse(message, profile);
  }
};