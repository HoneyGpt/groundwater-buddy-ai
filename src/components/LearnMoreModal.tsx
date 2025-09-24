import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, 
  AlertCircle, 
  Cog, 
  Users, 
  TrendingUp, 
  Shield, 
  Rocket, 
  MapPin,
  Brain,
  Database,
  Globe,
  CheckCircle,
  MessageCircle,
  FileText,
  DollarSign
} from "lucide-react";

interface LearnMoreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LearnMoreModal = ({ open, onOpenChange }: LearnMoreModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-3xl font-bold text-primary flex items-center gap-3">
            <Brain className="h-8 w-8" />
            INGRES-AI: Complete Project Overview
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="px-6 pb-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="impact">Impact</TabsTrigger>
              <TabsTrigger value="deployment">Deployment</TabsTrigger>
              <TabsTrigger value="metrics">Success</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-6 w-6 text-primary" />
                    Elevator Pitch
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium text-primary">
                    INGRES-AI — a multilingual AI virtual assistant that turns India's complex INGRES groundwater datasets into simple, local, actionable answers, maps and advisory for farmers, planners and the public.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-6 w-6 text-destructive" />
                    The Problem
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>India's groundwater data is huge, technical, and fragmented. Farmers, local planners and citizens struggle to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Find current and historical groundwater status for their block/district</li>
                    <li>Interpret numeric reports (stage of extraction, quality flags)</li>
                    <li>Discover which government schemes or low-cost actions apply locally</li>
                  </ul>
                  <p className="font-semibold text-destructive">
                    That confusion results in poor decisions, over-extraction, crop loss and missed public support.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-accent" />
                    Who Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-primary">Farmers & Rural Citizens</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Safe drilling decisions</li>
                        <li>• Low-cost conservation tips</li>
                        <li>• Government scheme access</li>
                        <li>• Voice & local language support</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-primary">Local Planners</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Fast data exports (CSV/GeoJSON)</li>
                        <li>• Time-series visualizations</li>
                        <li>• Clear provenance & methodology</li>
                        <li>• Policy decision support</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-primary">Researchers & NGOs</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Curated datasets access</li>
                        <li>• Searchable documents</li>
                        <li>• AI-assisted synthesis</li>
                        <li>• Combined insights</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Conversational AI
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>Natural language chatbot (text & voice) in English + regional languages (Hindi, Telugu, etc.)</p>
                    <Badge variant="secondary">Multilingual Support</Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Data Connector
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>Live INGRES API + PDF/doc ingestion (Supabase) for local reports & schemes</p>
                    <Badge variant="secondary">Real-time Data</Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Interactive Maps
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>Interactive maps & time-series charts per block/taluk/district</p>
                    <Badge variant="secondary">Visual Analytics</Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Dual Modes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>Public mode: simple answers, voice/TTS. Official mode: raw exports, provenance</p>
                    <Badge variant="secondary">Role-based Access</Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Document Saver
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>AI semantic search - find documents by asking questions</p>
                    <Badge variant="secondary">Smart Search</Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Budget Bro
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>Low-cost, actionable suggestions (crop/water tips within ₹X budget)</p>
                    <Badge variant="secondary">Cost-effective Solutions</Badge>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Technical Tab */}
            <TabsContent value="technical" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cog className="h-6 w-6 text-primary" />
                    System Architecture
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-accent">Data Ingestion</h4>
                      <p className="text-sm">PDFs, INGRES API dumps → parsed into text → chunked & stored in Supabase/doc_chunks</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-accent">Indexing</h4>
                      <p className="text-sm">Semantic embeddings (OpenAI or local SentenceTransformers) stored with pgvector. Optional Meilisearch for fast text search</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-accent">Query Flow (enhanced-ai-chat)</h4>
                      <ul className="text-sm list-disc pl-4 space-y-1">
                        <li>Check structured state_stats/district_stats tables for numeric lookups</li>
                        <li>Semantic search over doc_chunks if no structured data</li>
                        <li>External web search (Google Pro/Brave) as fallback</li>
                        <li>LLM rendering (Gemini/OpenAI) with system prompts</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Technology Stack</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Frontend</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge>React</Badge>
                        <Badge>Tailwind</Badge>
                        <Badge>Leaflet Maps</Badge>
                        <Badge>Chart.js/D3</Badge>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Backend</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge>Supabase</Badge>
                        <Badge>Edge Functions</Badge>
                        <Badge>PostgreSQL</Badge>
                        <Badge>pgvector</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Impact Tab */}
            <TabsContent value="impact" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-6 w-6 text-primary" />
                    National Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <h4 className="font-bold text-2xl text-primary">Sustainability</h4>
                      <p className="text-sm">Reduced over-extraction risk → better groundwater sustainability</p>
                    </div>
                    <div className="text-center p-4 bg-accent/5 rounded-lg">
                      <h4 className="font-bold text-2xl text-accent">Food Security</h4>
                      <p className="text-sm">Faster interventions → fewer crop losses and improved food security</p>
                    </div>
                    <div className="text-center p-4 bg-green-500/5 rounded-lg">
                      <h4 className="font-bold text-2xl text-green-600">Transparency</h4>
                      <p className="text-sm">Greater public awareness & transparency of water governance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    Privacy & Governance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      No personal data retention unless user opts to save docs
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Official exports gated behind role verification
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      AI outputs are advisory — technical/policy actions require verified officials
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Admin approval required before sensitive docs enter official knowledge base
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Deployment Tab */}
            <TabsContent value="deployment" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-6 w-6 text-primary" />
                    15-90 Day Roadmap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-bold text-primary">MVP (0–15 days)</h4>
                      <p className="text-sm">Chat + map + ingest 1 state PDF set + public mode</p>
                    </div>
                    <div className="border-l-4 border-accent pl-4">
                      <h4 className="font-bold text-accent">Hackathon Build (15 days)</h4>
                      <p className="text-sm">Full public dashboard, basic official signup, PDF ingestion pipeline, Supabase index</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-bold text-green-600">Post-hack (15–60 days)</h4>
                      <p className="text-sm">Staging & approval workflow, export functions, role-based official dashboard</p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-bold text-blue-600">Scale (60–90 days)</h4>
                      <p className="text-sm">Auto-ingest INGRES API live, add more languages, host Meilisearch, partner with state agencies</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Operational Partners</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Government</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Central Ground Water Board (CGWB)</li>
                        <li>• State Ground Water Departments</li>
                        <li>• IITs / research labs</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Implementation</h4>
                      <ul className="text-sm space-y-1">
                        <li>• NGOs / farmer cooperatives</li>
                        <li>• Cloud infrastructure providers</li>
                        <li>• Technology partners</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Metrics Tab */}
            <TabsContent value="metrics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    Success Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-accent mb-3">Technical Metrics</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <Badge variant="outline" className="w-20">Coverage</Badge>
                          <span className="text-sm">% of districts/mandals mapped with up-to-date data</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="outline" className="w-20">Accuracy</Badge>
                          <span className="text-sm">% of queries answered using Supabase data (not hallucinated)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="outline" className="w-20">Latency</Badge>
                          <span className="text-sm">Median &lt; 3s for cached queries</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-accent mb-3">Impact Metrics</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <Badge variant="outline" className="w-20">Users</Badge>
                          <span className="text-sm">Monthly active users (farmers)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="outline" className="w-20">Policy</Badge>
                          <span className="text-sm"># of downloads/exports used by local governments</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="outline" className="w-20">Behavior</Badge>
                          <span className="text-sm">Surveys showing increased adoption of conservation steps</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Example User Flow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <div className="flex items-start gap-3">
                      <Badge>Farmer</Badge>
                      <span className="italic">"Is my village safe to dig in 2024?"</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary">System</Badge>
                      <span className="text-sm">Looks up district in state_stats → finds stage = 92% (Critical)</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge className="bg-primary">INGRES-AI</Badge>
                      <span className="text-sm font-medium">
                        "My little star — your area (X) is Critical (92%). Avoid new borewells. 
                        Try community recharge and drip irrigation. Nearby scheme: [name + apply link]."
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline">Action</Badge>
                      <span className="text-sm">Farmer clicks "Schemes" → sees eligibility and one-click helpline call</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default LearnMoreModal;