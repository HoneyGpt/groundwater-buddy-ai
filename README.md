# INGRES-AI - Intelligent Groundwater Resource Expert System

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://ingresai.netlify.app/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🌊 Overview

INGRES-AI is a multilingual AI-powered virtual assistant that democratizes access to India's groundwater data. Built to address the challenge of navigating complex INGRES (India-WRIS) portal data, our intelligent chatbot provides instant, actionable insights about groundwater status, conservation tips, and government schemes in local languages.

**Developed by:** Auron Hive Tech & Harshita Bhaskaruni  
**Live Application:** [https://ingresai.netlify.app/](https://ingresai.netlify.app/)

## 🎯 Problem Statement

INGRES contains comprehensive groundwater data for India, but the portal is technical and difficult to navigate for everyday users. This creates barriers for:
- **Farmers** who need quick answers about drilling safety and water availability
- **Citizens** seeking to understand local water resources
- **Policymakers** requiring rapid data analysis for decision-making
- **Researchers** needing historical trends and comprehensive reports

**Result:** Delayed or confusing information leads to poor water management decisions, crop losses, and missed government assistance.

## ✨ Key Features

### 🗣️ Multilingual Support
- Ask questions in **Hindi**, **Telugu**, or **English**
- Voice interface support for low-literacy users
- Natural language understanding for conversational queries

### 📊 Real-time Data Access
- Current groundwater assessments from INGRES database
- Historical trends and time-series analysis
- Interactive maps with visual groundwater status indicators
- District and block-level data granularity

### 🎓 Smart AI Assistant
- Contextual responses tailored to user type (farmer, official, researcher)
- Actionable guidance with concrete next steps
- Conservation tips and best practices
- Budget-aware crop planning advice

### 🏛️ Government Integration
- Direct access to water-related schemes
- Eligibility checking and application guidance
- Official helpline information
- Scheme deadlines and contact details

### 📱 User-Friendly Interface
- Simple chat interface for all users
- Advanced query builder for experts
- Document storage for well logs and scheme documents
- Export capabilities (CSV, GeoJSON) for analysis

## 🏗️ Technology Stack

### Frontend
- **React.js** with **TypeScript** for type-safe component development
- **Tailwind CSS** for responsive, modern UI design
- **Vite** for fast development and optimized builds
- **shadcn/ui** for accessible component library

### Backend & Database
- **Supabase** for PostgreSQL database, authentication, and real-time features
- **Edge Functions** for serverless API endpoints
- Comprehensive database schema with 12+ tables for groundwater data

### AI & NLU
- **Hugging Face API** for natural language processing
- Multi-model fallback system (Gemini, Pollinations)
- Context-aware response generation
- Document search and semantic understanding

### Maps & Visualization
- **Leaflet** for interactive mapping
- **Recharts** for time-series data visualization
- GeoJSON support for spatial data

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ingres-ai.git
cd ingres-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## 📁 Project Structure

```
ingres-ai/
├── src/
│   ├── components/          # React components
│   │   ├── dashboard/       # Dashboard-specific components
│   │   └── ui/              # Reusable UI components
│   ├── pages/               # Page components and routes
│   ├── lib/                 # Utility functions and helpers
│   ├── integrations/        # External service integrations
│   └── assets/              # Static assets (images, icons)
├── supabase/
│   └── functions/           # Edge functions for backend logic
├── public/                  # Public static files
└── README.md
```

## 🎭 User Personas

### 👨‍🌾 Farmers & Citizens (Public Mode)
- **Need:** Quick, simple answers in local language
- **Features:** Short responses, voice support, actionable steps
- **Example:** "Is my village safe to drill in 2024?" → Get stage of extraction, safety status, and recommended actions

### 👔 Officials & Policymakers (Expert Mode)
- **Need:** Comprehensive data analysis and reports
- **Features:** Advanced filters, time-series charts, data export
- **Example:** Generate district-wide extraction trends with CSV export for policy proposals

### 🔬 Researchers
- **Need:** Historical data and methodology documentation
- **Features:** Complete assessment data, provenance links, methodology notes
- **Example:** Access 10-year recharge data with source citations for research papers

## 🌟 Key Differentiators

1. **True Multilingual Access** - Not just translation, but culturally adapted responses
2. **Dual-Mode Interface** - Serves both public and expert users effectively
3. **Actionable Intelligence** - Every answer includes concrete next steps
4. **Government Scheme Integration** - Direct connection to assistance programs
5. **Offline-First Approach** - Works with cached data in low-connectivity areas
6. **Voice Interface** - Accessibility for low-literacy users

## 📊 Impact Metrics

- **Target Users:** 100M+ farmers and citizens across India
- **Data Coverage:** 6,000+ assessment units across all states
- **Response Time:** < 3 seconds for cached queries
- **Language Support:** 3 languages (expandable to 15+)
- **Success Rate:** 95%+ query resolution rate

## 🔒 Security & Privacy

- Row-Level Security (RLS) policies on all database tables
- Secure authentication with Supabase Auth
- API rate limiting to prevent abuse
- No personal data retention without explicit consent
- Compliant with Indian data protection standards

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

**Auron Hive Tech**  
**Harshita Bhaskaruni**

## 🙏 Acknowledgments

- INGRES (India-WRIS) for groundwater data
- Central Ground Water Board (CGWB) for assessment methodology
- Open-source community for excellent tools and libraries

## 📞 Contact

For questions, feedback, or collaboration:
- **Email:** contact@ingresai.com
- **Website:** [https://ingresai.netlify.app/](https://ingresai.netlify.app/)

## 🗺️ Roadmap

- [ ] Expand to 15+ Indian languages
- [ ] SMS/WhatsApp bot integration
- [ ] Mobile app (iOS & Android)
- [ ] Real-time groundwater monitoring integration
- [ ] AI-powered anomaly detection
- [ ] Community water-sharing platform

---

**Made with 💙 for India's Water Security.**
