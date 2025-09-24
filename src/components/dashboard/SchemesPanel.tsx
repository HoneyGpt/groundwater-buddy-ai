import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Gift, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign,
  FileText,
  ExternalLink,
  Heart,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';

interface Scheme {
  id: string;
  name: string;
  ministry: string;
  type: string;
  description: string;
  objectives: string[];
  eligibility: string[];
  benefits: string[];
  fundingPattern?: string;
  yearCommenced?: string;
  area: string;
  category: 'agriculture' | 'health' | 'education' | 'finance' | 'rural' | 'industry' | 'welfare' | 'other';
  status: 'active' | 'new' | 'updated';
  website?: string;
  isFavorite?: boolean;
}

const governmentSchemes: Scheme[] = [
  {
    id: '1',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    type: 'Central Sector Scheme',
    description: 'A comprehensive crop insurance scheme to provide insurance coverage and financial support to farmers in the event of failure of any of the notified crop as a result of natural calamities, pests & diseases.',
    objectives: [
      'Provide insurance coverage and financial support to farmers',
      'Stabilise the income of farmers',
      'Encourage farmers to adopt innovative and modern agricultural practices',
      'Ensure flow of credit to the agriculture sector'
    ],
    eligibility: [
      'All farmers including sharecroppers and tenant farmers',
      'Farmers growing notified crops in notified areas',
      'Coverage available for all Kharif, Rabi and Annual Commercial crops'
    ],
    benefits: [
      'Premium rates: 2% for Kharif crops, 1.5% for Rabi crops',
      'Actual premium rates to be paid by farmers capped at 5% for commercial crops',
      'Central Government provides subsidy for difference between actuarial premium and farmers share'
    ],
    yearCommenced: '2016',
    area: 'All States and Union Territories',
    category: 'agriculture',
    status: 'active',
    website: 'https://pmfby.gov.in/'
  },
  {
    id: '2',
    name: 'PM Kisan Samman Nidhi (PM-KISAN)',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    type: 'Central Sector Scheme',
    description: 'Income support scheme for all land holding farmer families to provide income support of ₹6,000 per year in three equal installments.',
    objectives: [
      'Provide income support to all land holding farmer families',
      'Supplement financial needs of farmers for procuring inputs',
      'Ensure proper crop health and appropriate yields'
    ],
    eligibility: [
      'All land holding farmer families',
      'Excludes institutional land holders',
      'Excludes farmers who pay income tax'
    ],
    benefits: [
      '₹6,000 per year in three installments of ₹2,000 each',
      'Direct benefit transfer to bank accounts',
      'No registration fee required'
    ],
    yearCommenced: '2019',
    area: 'All States and Union Territories',
    category: 'agriculture',
    status: 'active',
    website: 'https://pmkisan.gov.in/'
  },
  {
    id: '3',
    name: 'Agriculture Infrastructure Fund (AIF)',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    type: 'Central Sector Scheme',
    description: 'Medium-long term debt financing facility for investment in viable projects relating to post-harvest management infrastructure and community farming assets.',
    objectives: [
      'Mobilize investment in agriculture infrastructure',
      'Provide affordable financing to farmers and agri-entrepreneurs',
      'Reduce post-harvest losses',
      'Improve farmers income'
    ],
    eligibility: [
      'Primary Agricultural Credit Societies (PACS)',
      'Farmer Producer Organizations (FPOs)',
      'Agriculture entrepreneurs',
      'Self Help Groups (SHGs)',
      'Cooperatives'
    ],
    benefits: [
      '₹1,00,000 crore fund for agriculture infrastructure',
      '3% interest subvention',
      'Credit guarantee coverage',
      'Moratorium period available'
    ],
    fundingPattern: '100% Central funding for interest subvention and guarantee',
    yearCommenced: '2020',
    area: 'All States and Union Territories',
    category: 'agriculture',
    status: 'active'
  },
  {
    id: '4',
    name: 'Pradhan Mantri Jan Arogya Yojana (PMJAY)',
    ministry: 'Ministry of Health & Family Welfare',
    type: 'Centrally Sponsored Scheme',
    description: 'World largest health insurance scheme providing free treatment up to ₹5 lakh per family per year for secondary and tertiary care hospitalization.',
    objectives: [
      'Provide financial protection for health care',
      'Improve access to quality health care',
      'Reduce catastrophic health expenditure',
      'Improve health outcomes'
    ],
    eligibility: [
      'Families identified in SECC 2011 database',
      'Rural families with specific deprivation criteria',
      'Urban occupational category families',
      'Automatic inclusion for eligible families'
    ],
    benefits: [
      '₹5 lakh annual coverage per family',
      'Cashless and paperless treatment',
      '1,929 treatment packages covered',
      'Pre and post hospitalization expenses covered'
    ],
    fundingPattern: '60:40 (Centre:State), 90:10 for NE States',
    yearCommenced: '2018',
    area: 'All States and Union Territories',
    category: 'health',
    status: 'active',
    website: 'https://pmjay.gov.in/'
  },
  {
    id: '5',
    name: 'Pradhan Mantri Mudra Yojana (PMMY)',
    ministry: 'Ministry of Finance',
    type: 'Central Sector Scheme',
    description: 'Provides loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises for income generating activities.',
    objectives: [
      'Provide funding to non-corporate, non-farm sector',
      'Create employment opportunities',
      'Support entrepreneurship',
      'Financial inclusion of small businesses'
    ],
    eligibility: [
      'Non-corporate, non-farm enterprises',
      'Manufacturing, trading and service activities',
      'Loan amount up to ₹10 lakh',
      'No collateral required for loans up to ₹10 lakh'
    ],
    benefits: [
      'Shishu: Up to ₹50,000',
      'Kishore: ₹50,001 to ₹5 lakh',
      'Tarun: ₹5,00,001 to ₹10 lakh',
      'No processing fee, no guarantee required'
    ],
    yearCommenced: '2015',
    area: 'All States and Union Territories',
    category: 'finance',
    status: 'active',
    website: 'https://mudra.org.in/'
  },
  {
    id: '6',
    name: 'Samagra Shiksha',
    ministry: 'Ministry of Education',
    type: 'Centrally Sponsored Scheme',
    description: 'An integrated scheme for school education covering the entire education continuum from pre-school to class XII.',
    objectives: [
      'Ensure inclusive and equitable quality education',
      'Bridge social and gender gaps in education',
      'Strengthen infrastructure and learning outcomes',
      'Promote vocational education'
    ],
    eligibility: [
      'All government and aided schools',
      'Children aged 3-18 years',
      'Focus on disadvantaged groups',
      'Special provisions for girls education'
    ],
    benefits: [
      'Free textbooks and uniforms',
      'Mid-day meals',
      'Infrastructure development',
      'Teacher training and support'
    ],
    fundingPattern: '60:40 (Centre:State), 90:10 for NE States',
    yearCommenced: '2018',
    area: 'All States and Union Territories',
    category: 'education',
    status: 'active'
  },
  {
    id: '7',
    name: 'Rashtriya Krishi Vikas Yojana (RKVY-RAFTAAR)',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    type: 'Central Sector Scheme',
    description: 'Aims to strengthen farmers efforts through creation of pre and post-harvest agri-infrastructure and increase access to quality inputs, storage and market facilities.',
    objectives: [
      'Strengthen farmers efforts for infrastructure creation',
      'Provide autonomy and flexibility to States',
      'Promote value chain addition',
      'Mitigate risk and increase farmers income'
    ],
    eligibility: [
      'Individual farmers',
      'Family farmers',
      'Community groups',
      'Women farmers',
      'Youth entrepreneurs'
    ],
    benefits: [
      'Financial assistance for infrastructure',
      'Support for innovative projects',
      'Technology promotion',
      'Market linkage support'
    ],
    fundingPattern: '60:40 (Centre:State), 90:10 for NE and Himalayan States',
    yearCommenced: '2007',
    area: 'All States and Union Territories',
    category: 'agriculture',
    status: 'active'
  },
  {
    id: '8',
    name: 'National Food Security Mission (NFSM)',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    type: 'Central Sector Scheme',
    description: 'Aims to increase production of rice, wheat, pulses and coarse cereals through area expansion and productivity enhancement.',
    objectives: [
      'Increase production of food grains',
      'Restore soil fertility and productivity',
      'Create employment opportunities',
      'Enhance farm level economy'
    ],
    eligibility: [
      'Farmers in identified districts',
      'Focus on rice, wheat, pulses and coarse cereals',
      'Small and marginal farmers priority',
      'Women farmers encouraged'
    ],
    benefits: [
      'Improved seeds and technology',
      'Integrated nutrient management',
      'Resource conservation technologies',
      'Capacity building support'
    ],
    yearCommenced: '2007',
    area: 'Identified districts across all states',
    category: 'agriculture',
    status: 'active'
  },
  {
    id: '9',
    name: 'Atal Pension Yojana',
    ministry: 'Ministry of Finance',
    type: 'Central Sector Scheme',
    description: 'Government co-contributed pension scheme focused on all citizens in the unorganized sector.',
    objectives: [
      'Provide old age income security',
      'Encourage systematic savings',
      'Provide guaranteed pension',
      'Cover unorganized sector workers'
    ],
    eligibility: [
      'Indian citizens aged 18-40 years',
      'Have bank account and Aadhaar',
      'Not covered under statutory social security schemes',
      'Not income tax payers'
    ],
    benefits: [
      'Guaranteed pension of ₹1,000-₹5,000 per month',
      'Government co-contribution for eligible subscribers',
      'Spouse pension on death of subscriber',
      'Nominee gets pension corpus on death of both'
    ],
    yearCommenced: '2015',
    area: 'All States and Union Territories',
    category: 'finance',
    status: 'active'
  },
  {
    id: '10',
    name: 'Pradhan Mantri Awas Yojana (PMAY)',
    ministry: 'Ministry of Housing and Urban Affairs',
    type: 'Centrally Sponsored Scheme',
    description: 'Aims to provide affordable housing to urban poor with a target to build 2 crore affordable houses by 2022.',
    objectives: [
      'Provide affordable housing to urban poor',
      'Eliminate slums and rehabilitate slum dwellers',
      'Promote sustainable and inclusive cities',
      'Ensure housing for all by 2022'
    ],
    eligibility: [
      'Economically Weaker Section (EWS)',
      'Low Income Group (LIG)',
      'Middle Income Group (MIG)',
      'First time home buyers',
      'Women ownership mandatory'
    ],
    benefits: [
      'Central assistance up to ₹2.67 lakh',
      'Interest subsidy up to ₹2.35 lakh',
      'Additional carpet area at affordable rates',
      'Infrastructure development support'
    ],
    fundingPattern: 'Varies by component and state category',
    yearCommenced: '2015',
    area: 'All States and Union Territories',
    category: 'welfare',
    status: 'active'
  }
];

export const SchemesPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filteredSchemes, setFilteredSchemes] = useState<Scheme[]>(governmentSchemes);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('ingres_favorite_schemes');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    let filtered = governmentSchemes;

    if (searchTerm) {
      filtered = filtered.filter(scheme =>
        scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.ministry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      if (selectedCategory === 'favorites') {
        filtered = filtered.filter(scheme => favorites.includes(scheme.id));
      } else {
        filtered = filtered.filter(scheme => scheme.category === selectedCategory);
      }
    }

    setFilteredSchemes(filtered);
  }, [searchTerm, selectedCategory, favorites]);

  const toggleFavorite = (schemeId: string) => {
    const newFavorites = favorites.includes(schemeId)
      ? favorites.filter(id => id !== schemeId)
      : [...favorites, schemeId];
    
    setFavorites(newFavorites);
    localStorage.setItem('ingres_favorite_schemes', JSON.stringify(newFavorites));
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      agriculture: 'bg-green-100 text-green-800',
      health: 'bg-red-100 text-red-800',
      education: 'bg-blue-100 text-blue-800',
      finance: 'bg-yellow-100 text-yellow-800',
      rural: 'bg-purple-100 text-purple-800',
      industry: 'bg-indigo-100 text-indigo-800',
      welfare: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      new: 'bg-blue-100 text-blue-800',
      updated: 'bg-orange-100 text-orange-800'
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center">
            <Gift className="w-6 h-6 mr-2 text-primary" />
            Government Schemes
          </h1>
          <p className="text-muted-foreground">
            Comprehensive directory of government schemes and programs
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search schemes by name, ministry, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9 h-auto">
          <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
          <TabsTrigger value="favorites" className="text-xs">
            <Heart className="w-3 h-3 mr-1" />
            Favorites
          </TabsTrigger>
          <TabsTrigger value="agriculture" className="text-xs">Agriculture</TabsTrigger>
          <TabsTrigger value="health" className="text-xs">Health</TabsTrigger>
          <TabsTrigger value="education" className="text-xs">Education</TabsTrigger>
          <TabsTrigger value="finance" className="text-xs">Finance</TabsTrigger>
          <TabsTrigger value="rural" className="text-xs">Rural</TabsTrigger>
          <TabsTrigger value="welfare" className="text-xs">Welfare</TabsTrigger>
          <TabsTrigger value="other" className="text-xs">Other</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Schemes Grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <Card key={scheme.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2 mb-2">
                      {scheme.name}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge className={getCategoryColor(scheme.category)}>
                        {scheme.category}
                      </Badge>
                      <Badge className={getStatusColor(scheme.status)}>
                        {scheme.status}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(scheme.id);
                    }}
                    className="ml-2"
                  >
                    {favorites.includes(scheme.id) ? (
                      <BookmarkCheck className="w-4 h-4 text-primary" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                  {scheme.description}
                </p>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-2" />
                    <span className="truncate">{scheme.ministry}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-2" />
                    <span>{scheme.yearCommenced || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-2" />
                    <span className="truncate">{scheme.area}</span>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-4"
                      onClick={() => setSelectedScheme(scheme)}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center justify-between">
                        <span className="line-clamp-2">{scheme.name}</span>
                        <div className="flex gap-2">
                          <Badge className={getCategoryColor(scheme.category)}>
                            {scheme.category}
                          </Badge>
                          <Badge className={getStatusColor(scheme.status)}>
                            {scheme.status}
                          </Badge>
                        </div>
                      </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[60vh]">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-2">Overview</h4>
                          <p className="text-sm text-muted-foreground">{scheme.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Basic Information</h4>
                            <div className="space-y-2 text-sm">
                              <div><strong>Ministry:</strong> {scheme.ministry}</div>
                              <div><strong>Type:</strong> {scheme.type}</div>
                              <div><strong>Year Commenced:</strong> {scheme.yearCommenced || 'N/A'}</div>
                              <div><strong>Area of Operation:</strong> {scheme.area}</div>
                              {scheme.fundingPattern && (
                                <div><strong>Funding Pattern:</strong> {scheme.fundingPattern}</div>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">Quick Actions</h4>
                            <div className="space-y-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full justify-start"
                                onClick={() => toggleFavorite(scheme.id)}
                              >
                                {favorites.includes(scheme.id) ? (
                                  <BookmarkCheck className="w-4 h-4 mr-2" />
                                ) : (
                                  <Bookmark className="w-4 h-4 mr-2" />
                                )}
                                {favorites.includes(scheme.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                              </Button>
                              {scheme.website && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full justify-start"
                                  onClick={() => window.open(scheme.website, '_blank')}
                                >
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  Visit Official Website
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Objectives</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {scheme.objectives.map((objective, index) => (
                              <li key={index}>{objective}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Eligibility Criteria</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {scheme.eligibility.map((criteria, index) => (
                              <li key={index}>{criteria}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Benefits</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {scheme.benefits.map((benefit, index) => (
                              <li key={index}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSchemes.length === 0 && (
          <Card className="p-8 text-center">
            <Gift className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Schemes Found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or category filter
            </p>
            <Button onClick={() => {setSearchTerm(''); setSelectedCategory('all');}}>
              Clear Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};