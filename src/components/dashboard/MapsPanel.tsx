import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ZoomIn, ZoomOut, RotateCcw, FileText, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

// Import map images
import groundwaterMap1 from '@/assets/maps/groundwater-map-1.jpg';
import groundwaterMap2 from '@/assets/maps/groundwater-map-2.jpg';
import groundwaterMap3 from '@/assets/maps/groundwater-map-3.jpg';
import extractionLegend from '@/assets/maps/extraction-legend.jpg';

interface MapData {
  id: string;
  name: string;
  image: string;
  state: string;
  district: string;
  extractionPercent: number;
  qualityTag: 'Safe' | 'Semi-Critical' | 'Critical' | 'Over-Exploited';
  schemes: string[];
  coordinates: { x: number; y: number };
}

const mapData: MapData[] = [
  {
    id: '1',
    name: 'Northern Region',
    image: groundwaterMap1,
    state: 'Telangana',
    district: 'Hyderabad',
    extractionPercent: 45,
    qualityTag: 'Safe',
    schemes: ['Rainwater Harvesting Scheme', 'Groundwater Recharge Program'],
    coordinates: { x: 200, y: 150 }
  },
  {
    id: '2',
    name: 'Central Region',
    image: groundwaterMap2,
    state: 'Telangana',
    district: 'Warangal',
    extractionPercent: 72,
    qualityTag: 'Semi-Critical',
    schemes: ['Water Conservation Initiative', 'Farmer Support Program'],
    coordinates: { x: 300, y: 250 }
  },
  {
    id: '3',
    name: 'Southern Region',
    image: groundwaterMap3,
    state: 'Andhra Pradesh',
    district: 'Kurnool',
    extractionPercent: 89,
    qualityTag: 'Critical',
    schemes: ['Emergency Water Supply', 'Drought Relief Program'],
    coordinates: { x: 150, y: 350 }
  }
];

const states = [...new Set(mapData.map(m => m.state))];
const getDistricts = (state: string) => mapData.filter(m => m.state === state).map(m => m.district);

export const MapsPanel = () => {
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [currentMapIndex, setCurrentMapIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredRegion, setHoveredRegion] = useState<MapData | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [userLocation, setUserLocation] = useState<{ x: number; y: number } | null>(null);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapImageRef = useRef<HTMLImageElement>(null);

  const filteredMaps = mapData.filter(map => {
    if (selectedState !== 'all' && map.state !== selectedState) return false;
    if (selectedDistrict !== 'all' && map.district !== selectedDistrict) return false;
    return true;
  });

  const currentMap = filteredMaps[currentMapIndex] || mapData[0];

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Mock conversion of real coordinates to map coordinates
          setUserLocation({ x: 250, y: 200 });
          toast.success('Location detected');
        },
        () => {
          toast.error('Location access denied');
        }
      );
    }
  }, []);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleRegionClick = (region: MapData) => {
    toast.success(`Selected ${region.name}`, {
      description: `Extraction: ${region.extractionPercent}% | Quality: ${region.qualityTag}`,
    });
  };

  const getQualityColor = (tag: string) => {
    switch (tag) {
      case 'Safe': return 'bg-green-100 text-green-800 border-green-200';
      case 'Semi-Critical': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Critical': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Over-Exploited': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Interactive Maps</h2>
          <p className="text-muted-foreground">Explore groundwater data across regions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <Select value={selectedState} onValueChange={(value) => {
          setSelectedState(value);
          setSelectedDistrict('all');
          setCurrentMapIndex(0);
        }}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {states.map(state => (
              <SelectItem key={state} value={state}>{state}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={selectedDistrict} 
          onValueChange={setSelectedDistrict}
          disabled={selectedState === 'all'}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select District" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Districts</SelectItem>
            {selectedState !== 'all' && getDistricts(selectedState).map(district => (
              <SelectItem key={district} value={district}>{district}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {filteredMaps.length > 1 && (
          <Select value={currentMapIndex.toString()} onValueChange={(value) => setCurrentMapIndex(parseInt(value))}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent>
              {filteredMaps.map((map, index) => (
                <SelectItem key={map.id} value={index.toString()}>{map.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Map Display */}
        <Card className="lg:col-span-3">
          <CardContent className="p-0">
            <div 
              ref={mapContainerRef}
              className="relative h-[600px] overflow-hidden rounded-lg cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div
                className="relative transition-transform duration-200"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                  transformOrigin: 'center center'
                }}
              >
                <img
                  ref={mapImageRef}
                  src={currentMap.image}
                  alt={currentMap.name}
                  className="w-full h-full object-contain select-none"
                  draggable={false}
                />

                {/* Interactive Regions */}
                <div
                  className="absolute top-1/3 left-1/3 w-8 h-8 bg-primary/20 border-2 border-primary rounded-full cursor-pointer hover:bg-primary/40 transition-colors"
                  onClick={() => handleRegionClick(currentMap)}
                  onMouseEnter={() => setHoveredRegion(currentMap)}
                  onMouseLeave={() => setHoveredRegion(null)}
                />

                {/* User Location Marker */}
                {userLocation && (
                  <div
                    className="absolute flex items-center justify-center"
                    style={{
                      left: `${userLocation.x}px`,
                      top: `${userLocation.y}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <MapPin className="w-6 h-6 text-blue-600 drop-shadow-lg" />
                  </div>
                )}
              </div>

              {/* Hover Popup */}
              {hoveredRegion && (
                <div
                  className="absolute z-10 bg-background border rounded-lg shadow-lg p-4 min-w-64 pointer-events-none"
                  style={{
                    left: `${mousePosition.x - (mapContainerRef.current?.getBoundingClientRect().left || 0)}px`,
                    top: `${mousePosition.y - (mapContainerRef.current?.getBoundingClientRect().top || 0) - 100}px`
                  }}
                >
                  <h3 className="font-semibold text-foreground">{hoveredRegion.name}</h3>
                  <p className="text-sm text-muted-foreground">{hoveredRegion.district}, {hoveredRegion.state}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Extraction:</span>
                      <span className="text-sm font-medium">{hoveredRegion.extractionPercent}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Quality:</span>
                      <Badge className={getQualityColor(hoveredRegion.qualityTag)}>
                        {hoveredRegion.qualityTag}
                      </Badge>
                    </div>
                    <div className="text-sm">
                      <span>Schemes: </span>
                      <span className="text-primary">{hoveredRegion.schemes.length} available</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Region Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground">{currentMap.name}</h3>
                <p className="text-sm text-muted-foreground">{currentMap.district}, {currentMap.state}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Water Extraction:</span>
                  <span className="text-sm font-medium">{currentMap.extractionPercent}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${currentMap.extractionPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Quality Status:</span>
                <Badge className={getQualityColor(currentMap.qualityTag)}>
                  {currentMap.qualityTag}
                </Badge>
              </div>

              <div>
                <span className="text-sm font-medium">Available Schemes:</span>
                <div className="mt-2 space-y-1">
                  {currentMap.schemes.map((scheme, index) => (
                    <div key={index} className="text-xs text-muted-foreground p-2 bg-secondary rounded">
                      {scheme}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <FileText className="w-4 h-4 mr-1" />
                  Documents
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <DollarSign className="w-4 h-4 mr-1" />
                  Budget
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Extraction Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={extractionLegend}
                alt="Groundwater Extraction Legend"
                className="w-full rounded"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};