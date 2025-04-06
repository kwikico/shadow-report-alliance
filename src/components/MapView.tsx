
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { MapPin, AlertTriangle } from 'lucide-react';

// This is a placeholder component as we can't implement an actual map without a map library
// In a real implementation, you would use a library like Leaflet, Google Maps, or Mapbox

const MapView = () => {
  const [filter, setFilter] = useState('all');
  
  // Mock data for the placeholder
  const reportCounts = {
    'Environmental Violations': 14,
    'Corruption': 23,
    'Human Rights Abuse': 11,
    'Corporate Misconduct': 8,
    'Government Overreach': 9,
    'Public Health Risk': 5,
    'Financial Fraud': 7,
    'Other': 3,
  };
  
  const locations = [
    { name: "New York, USA", count: 12, lat: 40.7128, lng: -74.0060 },
    { name: "London, UK", count: 8, lat: 51.5074, lng: -0.1278 },
    { name: "Tokyo, Japan", count: 15, lat: 35.6762, lng: 139.6503 },
    { name: "Sydney, Australia", count: 6, lat: -33.8688, lng: 151.2093 },
    { name: "Berlin, Germany", count: 9, lat: 52.5200, lng: 13.4050 },
    { name: "Lagos, Nigeria", count: 11, lat: 6.5244, lng: 3.3792 },
    { name: "Rio de Janeiro, Brazil", count: 7, lat: -22.9068, lng: -43.1729 },
    { name: "Mumbai, India", count: 14, lat: 19.0760, lng: 72.8777 },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filter Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category-filter">Category</Label>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger id="category-filter">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.keys(reportCounts).map((category) => (
                      <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                        {category} ({reportCounts[category as keyof typeof reportCounts]})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status-filter">Status</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time-filter">Time Period</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="time-filter">
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="day">Past 24 Hours</SelectItem>
                    <SelectItem value="week">Past Week</SelectItem>
                    <SelectItem value="month">Past Month</SelectItem>
                    <SelectItem value="year">Past Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Reporting Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {locations.slice(0, 5).map((location, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">{location.name}</span>
                    </div>
                    <Badge variant="secondary">{location.count}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          <Card className="h-[75vh]">
            <CardContent className="p-0 h-full relative">
              <div className="absolute inset-0 bg-secondary/50 flex flex-col items-center justify-center text-center p-6">
                <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Map Placeholder</h3>
                <p className="text-muted-foreground mb-4 max-w-md">
                  In a real implementation, this would be an interactive map showing report locations. 
                  Coordinates would be displayed as clustered points with details on click.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl">
                  {locations.map((location, index) => (
                    <div key={index} className="bg-secondary p-3 rounded-md text-sm">
                      <div className="font-medium">{location.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {location.lat.toFixed(2)}, {location.lng.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapView;
