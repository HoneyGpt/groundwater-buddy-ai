import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Search, 
  BookOpen, 
  FileText, 
  ExternalLink,
  Sparkles,
  Database,
  Globe,
  Download,
  RefreshCw,
  Lightbulb
} from 'lucide-react';

interface ResearchSource {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  url: string;
  source: 'arxiv' | 'wikipedia' | 'crossref' | 'semantic_scholar';
  published_date: string;
  citations?: number;
  doi?: string;
}

interface ResearchProject {
  id: string;
  title: string;
  description: string;
  sources: ResearchSource[];
  analysis: string;
  created_at: string;
  status: 'active' | 'completed' | 'draft';
}

export const AIResearchPanel = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ResearchSource[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [currentProject, setCurrentProject] = useState<ResearchProject | null>(null);
  const [projectDialog, setProjectDialog] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [analysisDialog, setAnalysisDialog] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  // Mock API integrations - replace with actual API calls
  const searchAPIs = async (query: string): Promise<ResearchSource[]> => {
    setSearching(true);
    
    try {
      // Simulate API calls to multiple sources
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResults: ResearchSource[] = [
        {
          id: '1',
          title: 'Groundwater Depletion in India: Challenges and Solutions',
          authors: ['Dr. Rajesh Kumar', 'Dr. Priya Sharma'],
          abstract: 'This study examines the critical state of groundwater depletion across various regions in India...',
          url: 'https://arxiv.org/abs/2024.12345',
          source: 'arxiv',
          published_date: '2024-01-15',
          citations: 45
        },
        {
          id: '2',
          title: 'Water Management Strategies in Semi-Arid Regions',
          authors: ['Prof. Maria Santos', 'Dr. Ahmed Hassan'],
          abstract: 'Comprehensive analysis of water conservation techniques applicable to drought-prone areas...',
          url: 'https://doi.org/10.1000/example',
          source: 'crossref',
          published_date: '2023-11-20',
          citations: 78,
          doi: '10.1000/example'
        },
        {
          id: '3',
          title: 'Groundwater in India - Wikipedia',
          authors: ['Wikipedia Contributors'],
          abstract: 'Groundwater is the water present beneath Earth\'s surface in rock and soil pore spaces...',
          url: 'https://en.wikipedia.org/wiki/Groundwater_in_India',
          source: 'wikipedia',
          published_date: '2024-02-01'
        }
      ];
      
      return mockResults.filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.abstract.toLowerCase().includes(query.toLowerCase())
      );
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    const results = await searchAPIs(searchQuery);
    setSearchResults(results);
    
    toast({
      title: "Search Complete",
      description: `Found ${results.length} relevant sources`,
    });
  };

  const handleGenerateAnalysis = async () => {
    if (selectedSources.length === 0) {
      toast({
        title: "No Sources Selected",
        description: "Please select at least one source to analyze",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    setAnalysisDialog(true);

    try {
      const selectedSourcesData = searchResults.filter(source => 
        selectedSources.includes(source.id)
      );

      const prompt = `Please analyze these research sources and provide insights:
      
      ${selectedSourcesData.map(source => `
      Title: ${source.title}
      Authors: ${source.authors.join(', ')}
      Abstract: ${source.abstract}
      Source: ${source.source}
      `).join('\n---\n')}
      
      Please provide:
      1. Common themes and insights
      2. Key findings and methodologies
      3. Gaps in research
      4. Recommendations for further study
      5. Practical applications`;

      const { data, error } = await supabase.functions.invoke('enhanced-ai-chat', {
        body: {
          question: prompt,
          userProfile: { type: 'official' }
        }
      });

      if (error) throw error;
      setAnalysis(data.answer);
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to generate analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleCreateProject = async () => {
    if (!projectTitle.trim() || selectedSources.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please provide a project title and select sources",
        variant: "destructive",
      });
      return;
    }

    const newProject: ResearchProject = {
      id: Date.now().toString(),
      title: projectTitle,
      description: projectDescription,
      sources: searchResults.filter(source => selectedSources.includes(source.id)),
      analysis: analysis,
      created_at: new Date().toISOString(),
      status: 'active'
    };

    setProjects(prev => [newProject, ...prev]);
    setProjectDialog(false);
    setProjectTitle('');
    setProjectDescription('');
    setSelectedSources([]);
    setAnalysis('');

    toast({
      title: "Project Created",
      description: "Research project created successfully",
    });
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'arxiv': return <FileText className="w-4 h-4" />;
      case 'wikipedia': return <Globe className="w-4 h-4" />;
      case 'crossref': return <BookOpen className="w-4 h-4" />;
      case 'semantic_scholar': return <Database className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'arxiv': return 'bg-blue-100 text-blue-800';
      case 'wikipedia': return 'bg-green-100 text-green-800';
      case 'crossref': return 'bg-purple-100 text-purple-800';
      case 'semantic_scholar': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center">
            <Brain className="w-6 h-6 mr-2 text-primary" />
            AI Research Assistant
          </h1>
          <p className="text-muted-foreground">
            Discover, analyze, and synthesize research from multiple sources
          </p>
        </div>
        <div className="flex gap-2">
          {selectedSources.length > 0 && (
            <Button onClick={handleGenerateAnalysis} disabled={generating}>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Analysis ({selectedSources.length})
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">Search Sources</TabsTrigger>
          <TabsTrigger value="projects">Research Projects</TabsTrigger>
          <TabsTrigger value="settings">API Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="flex-1 flex flex-col">
          {/* Search Interface */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search across arXiv, Wikipedia, CrossRef, and Semantic Scholar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={searching}>
              {searching ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
              Search
            </Button>
          </div>

          {/* Search Results */}
          <div className="flex-1 overflow-auto">
            {searchResults.length === 0 ? (
              <Card className="p-8 text-center">
                <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Start Your Research</h3>
                <p className="text-muted-foreground">
                  Search for academic papers, articles, and resources across multiple databases
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    Found {searchResults.length} sources
                  </h3>
                  {selectedSources.length > 0 && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => setProjectDialog(true)}
                      >
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Create Project
                      </Button>
                    </div>
                  )}
                </div>

                {searchResults.map((source) => (
                  <Card key={source.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedSources.includes(source.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSources(prev => [...prev, source.id]);
                            } else {
                              setSelectedSources(prev => prev.filter(id => id !== source.id));
                            }
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <CardTitle className="text-base line-clamp-2">
                            {source.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={`text-xs ${getSourceColor(source.source)}`}>
                              {getSourceIcon(source.source)}
                              <span className="ml-1">{source.source}</span>
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(source.published_date).toLocaleDateString()}
                            </span>
                            {source.citations && (
                              <span className="text-xs text-muted-foreground">
                                {source.citations} citations
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                        {source.abstract}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          Authors: {source.authors.join(', ')}
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(source.url, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View Source
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="projects" className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto">
            {projects.length === 0 ? (
              <Card className="p-8 text-center">
                <Lightbulb className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Research Projects</h3>
                <p className="text-muted-foreground">
                  Create research projects by selecting sources and generating analysis
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {project.description}
                          </p>
                        </div>
                        <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                          {project.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {project.sources.length} sources • Created {new Date(project.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setCurrentProject(project);
                              setAnalysisDialog(true);
                              setAnalysis(project.analysis);
                            }}
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            View Analysis
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-3 h-3 mr-1" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure API keys for external research databases (optional)
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">arXiv API (Free - No key required)</label>
                <Input disabled value="Built-in" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">CrossRef API (Free - No key required)</label>
                <Input disabled value="Built-in" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Semantic Scholar API (Optional)</label>
                <Input placeholder="Enter your Semantic Scholar API key" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Wikipedia API (Free - No key required)</label>
                <Input disabled value="Built-in" className="mt-1" />
              </div>
              <Button className="w-full">Save API Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Project Dialog */}
      <Dialog open={projectDialog} onOpenChange={setProjectDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Research Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Project Title</label>
              <Input
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="Enter project title"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Describe your research project..."
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Selected Sources ({selectedSources.length})
              </label>
              <ScrollArea className="h-32 border rounded-md p-3">
                {searchResults
                  .filter(source => selectedSources.includes(source.id))
                  .map(source => (
                    <div key={source.id} className="text-sm mb-2">
                      • {source.title}
                    </div>
                  ))}
              </ScrollArea>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setProjectDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject}>
                Create Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Analysis Dialog */}
      <Dialog open={analysisDialog} onOpenChange={setAnalysisDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              AI Research Analysis
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] p-4">
            {generating ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Generating comprehensive analysis...</p>
                </div>
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-sm">{analysis}</div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};