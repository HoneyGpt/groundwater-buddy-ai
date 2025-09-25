import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, Download, Filter, ZoomIn, ZoomOut, Home, Layers, Info } from 'lucide-react';
import ingresLogo from '@/assets/ingres-ai-logo-new.png';
import indiaMap from '@/assets/india-groundwater-map.jpg';

export const MapsPanel = () => {
  const [selectedYear, setSelectedYear] = useState('2024-2025');
  const [selectedComponent, setSelectedComponent] = useState('recharge');
  const [selectedCategory, setSelectedCategory] = useState('safe');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for state-wise statistics
  const stateData = [
    { state: 'ANDAMAN AND NICOBAR ISLANDS', rainfall: 2952.91, resources: 34504.51, extraction: 782.68 },
    { state: 'ANDHRA PRADESH', rainfall: 891.99, resources: 25802586.50, extraction: 7786396.79 },
    { state: 'ARUNACHAL PRADESH', rainfall: 3318.76, resources: 3288330.35, extraction: 1343.76 },
    { state: 'ASSAM', rainfall: 2382.11, resources: 2059912.17, extraction: 2093141.20 },
    { state: 'BIHAR', rainfall: 1202.46, resources: 3132096.73, extraction: 1446052.87 },
    { state: 'CHANDIGARH', rainfall: 1009.80, resources: 4786.58, extraction: 3205.59 },
    { state: 'CHHATTISGARH', rainfall: 1338.43, resources: 1306865.95, extraction: 629687.36 },
    { state: 'DADRA AND NAGAR HAVELI', rainfall: 2265.70, resources: 9095.76, extraction: 3178.63 },
    { state: 'DAMAN AND DIU', rainfall: 1709.10, resources: 2587.31, extraction: 1545.50 },
  ];

  const categoryStats = {
    total: 6769,
    safe: 4346,
    semiCritical: 763,
    critical: 201,
    overExploited: 731,
    saline: 128
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      safe: 'bg-green-500',
      semiCritical: 'bg-yellow-500', 
      critical: 'bg-orange-500',
      overExploited: 'bg-red-500',
      saline: 'bg-purple-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="h-full flex bg-background">
      {/* Left Sidebar - Controls */}
      <div className="w-80 bg-muted/30 border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border bg-primary text-primary-foreground">
          <div className="flex items-center gap-2 mb-2">
            <img src={ingresLogo} alt="INGRES" className="w-6 h-6" />
            <h3 className="font-semibold text-sm">Central Ground Water Board</h3>
          </div>
          <p className="text-xs opacity-90">Department of WR, RD & GR</p>
          <p className="text-xs opacity-90">Ministry of Jal Shakti, Government of India</p>
        </div>

        {/* Assessment Year */}
        <div className="p-4 border-b border-border">
          <div className="bg-muted rounded px-3 py-2">
            <span className="text-sm font-medium">Assessment year: {selectedYear}</span>
          </div>
        </div>

        {/* Navigation Icons */}
        <div className="p-4 border-b border-border">
          <div className="grid grid-cols-4 gap-2">
            <Button variant="ghost" size="sm" className="p-2 h-auto">
              <Filter className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 h-auto">
              <Layers className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 h-auto">
              <Home className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 h-auto">
              <Info className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <div>
            <label className="text-sm font-medium mb-2 block">Year</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-2025">2024-2025</SelectItem>
                <SelectItem value="2023-2024">2023-2024</SelectItem>
                <SelectItem value="2022-2023">2022-2023</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Component</label>
            <Select value={selectedComponent} onValueChange={setSelectedComponent}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recharge">Recharge</SelectItem>
                <SelectItem value="extraction">Extraction</SelectItem>
                <SelectItem value="stage">Stage of Extraction</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="safe">Safe</SelectItem>
                <SelectItem value="semiCritical">Semi-Critical</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="overExploited">Over-Exploited</SelectItem>
                <SelectItem value="saline">Saline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Center - Map Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Stats Bar */}
        <div className="bg-primary text-primary-foreground p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <span className="font-semibold">Total:</span> {categoryStats.total}
              </span>
              <span className="flex items-center gap-1">
                <span className="font-semibold">Safe:</span> {categoryStats.safe}
              </span>
              <span className="flex items-center gap-1">
                <span className="font-semibold">Semi-Critical:</span> {categoryStats.semiCritical}
              </span>
              <span className="flex items-center gap-1">
                <span className="font-semibold">Critical:</span> {categoryStats.critical}
              </span>
              <span className="flex items-center gap-1">
                <span className="font-semibold">Over-Exploited:</span> {categoryStats.overExploited}
              </span>
              <span className="flex items-center gap-1">
                <span className="font-semibold">Saline:</span> {categoryStats.saline}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm">
                <Download className="w-3 h-3 mr-1" />
                PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Map Controls */}
        <div className="bg-background border-b border-border p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <ZoomIn className="w-3 h-3" />
              </Button>
              <Button variant="outline" size="sm">
                <ZoomOut className="w-3 h-3" />
              </Button>
              <Button variant="outline" size="sm">
                <Home className="w-3 h-3" />
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Area of Focus: INDIA (COUNTRY)
            </div>
          </div>
        </div>

        {/* Map Display */}
        <div className="flex-1 bg-slate-100 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="w-full h-full relative bg-white flex items-center justify-center">
              {/* India Map from PDF */}
              <img 
                src={indiaMap} 
                alt="India Groundwater Map - Annual Ground Water Extraction Assessment 2024-2025"
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Data overlay */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-700">Annual Ground Water Extraction</div>
                  <div className="text-xs text-gray-500">Assessment year: {selectedYear}</div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div>
                      <div className="font-medium">Annual Extractable:</div>
                      <div className="text-blue-600 font-semibold">407.84 BCM</div>  
                    </div>
                    <div>
                      <div className="font-medium">Ground Water Extraction:</div>
                      <div className="text-blue-600 font-semibold">247.18 BCM</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Scale bar */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded px-3 py-2 text-xs shadow-md border">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 bg-gray-400"></div>
                  <span>50 100km</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Data */}
      <div className="w-96 bg-muted/30 border-l border-border flex flex-col">
        {/* Header */}
        <div className="p-3 border-b border-border bg-primary text-primary-foreground">
          <div className="text-sm font-medium">YEAR: {selectedYear}</div>
          <div className="text-xs opacity-90 mt-1">INDIA</div>
        </div>

        {/* Statistics Cards */}
        <div className="p-3 space-y-3 border-b border-border">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-background rounded p-2 text-center">
              <div className="text-xs text-muted-foreground">Annual Extractable Ground Water Resources (BCM)</div>
              <div className="text-lg font-bold text-blue-600">407.84</div>
            </div>
            <div className="bg-background rounded p-2 text-center">
              <div className="text-xs text-muted-foreground">Ground Water Extraction for all uses (BCM)</div>
              <div className="text-lg font-bold text-blue-600">247.18</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Rainfall (mm): 1055.23</div>
            <div className="text-xs text-muted-foreground">Ground Water Recharge (BCM): 449.61 ▼</div>
            <div className="text-xs text-muted-foreground">Natural Discharges (BCM): 39.99 ▼</div>
            <div className="text-xs text-muted-foreground">Annual Extractable Ground Water Resources (BCM): 407.84 ▼</div>
            <div className="text-xs text-muted-foreground">Ground Water Extraction (BCM): 247.18 ▼</div>
          </div>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 h-8 text-xs"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-y-auto">
          <div className="bg-muted text-xs font-medium sticky top-0 z-10">
            <div className="grid grid-cols-4 gap-1 p-2 border-b">
              <div>STATE</div>
              <div className="text-center">Rainfall (mm)</div>
              <div className="text-center">Annual Extractable Ground Water Resources (ham)</div>
              <div className="text-center">Ground Water Extraction (ham)</div>
            </div>
          </div>
          
          <div className="text-xs">
            {stateData
              .filter(item => 
                !searchQuery || 
                item.state.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((item, index) => (
                <div 
                  key={index}
                  className="grid grid-cols-4 gap-1 p-2 border-b border-border/50 hover:bg-background/50 cursor-pointer"
                >
                  <div className="font-medium text-primary">{item.state}</div>
                  <div className="text-center">{item.rainfall}</div>
                  <div className="text-center">{item.resources.toLocaleString()}</div>
                  <div className="text-center">{item.extraction.toLocaleString()}</div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};