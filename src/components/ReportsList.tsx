
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import ReportCard, { Report } from './ReportCard';

// Mock data for reports
const mockReports: Report[] = [
  {
    id: '1',
    title: 'Environmental Pollution in River Valley',
    excerpt: 'Chemical waste being dumped into the river by local factory, affecting water quality and wildlife.',
    location: 'River Valley, WA',
    coordinates: [47.6062, -122.3321],
    category: 'Environmental Violations',
    timestamp: new Date('2025-03-15T10:30:00'),
    supporters: 128,
    status: 'verified'
  },
  {
    id: '2',
    title: 'Government Contract Bid Rigging',
    excerpt: 'Evidence of collusion between officials and contractors to manipulate bids for municipal projects.',
    location: 'Austin, TX',
    coordinates: [30.2672, -97.7431],
    category: 'Corruption',
    timestamp: new Date('2025-03-28T14:15:00'),
    supporters: 86,
    status: 'investigating'
  },
  {
    id: '3',
    title: 'Worker Exploitation at Manufacturing Plant',
    excerpt: 'Unsafe working conditions and unpaid overtime at electronics assembly factory.',
    location: 'Detroit, MI',
    coordinates: [42.3314, -83.0458],
    category: 'Corporate Misconduct',
    timestamp: new Date('2025-04-02T09:45:00'),
    supporters: 213,
    status: 'verified'
  },
  {
    id: '4',
    title: 'Medical Research Data Falsification',
    excerpt: 'Clinical trial results being manipulated to show favorable outcomes for new drug.',
    location: 'Boston, MA',
    coordinates: [42.3601, -71.0589],
    category: 'Public Health Risk',
    timestamp: new Date('2025-04-05T16:20:00'),
    supporters: 42,
    status: 'pending'
  },
  {
    id: '5',
    title: 'Misuse of Charitable Funds',
    excerpt: 'Evidence that donations meant for disaster relief are being diverted to administrative costs.',
    location: 'Miami, FL',
    coordinates: [25.7617, -80.1918],
    category: 'Financial Fraud',
    timestamp: new Date('2025-03-10T11:05:00'),
    supporters: 176,
    status: 'investigating'
  },
  {
    id: '6',
    title: 'Unlawful Surveillance of Activists',
    excerpt: 'Activists and journalists being targeted by unauthorized surveillance operations.',
    location: 'Chicago, IL',
    coordinates: [41.8781, -87.6298],
    category: 'Government Overreach',
    timestamp: new Date('2025-04-01T08:30:00'),
    supporters: 319,
    status: 'verified'
  }
];

const ReportsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reports, setReports] = useState<Report[]>(mockReports);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredReports = reports.filter(report => {
    // Apply search filter
    const matchesSearch = searchTerm === '' || 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Apply category filter
    const matchesCategory = categoryFilter === 'all' || 
      report.category.toLowerCase() === categoryFilter;
      
    // Apply status filter
    const matchesStatus = statusFilter === 'all' || 
      report.status === statusFilter;
      
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  const handleJoinHands = (reportId: string) => {
    // In a real app, this would call an API to update the supporter count
    setReports(reports.map(report => 
      report.id === reportId 
        ? { ...report, supporters: report.supporters + 1 } 
        : report
    ));
    
    toast.success("You've joined hands with this report", {
      description: "Your support has been registered while keeping your identity private.",
    });
  };

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search reports by keyword..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="environmental violations">Environmental Violations</SelectItem>
                    <SelectItem value="corruption">Corruption</SelectItem>
                    <SelectItem value="human rights abuse">Human Rights Abuse</SelectItem>
                    <SelectItem value="corporate misconduct">Corporate Misconduct</SelectItem>
                    <SelectItem value="government overreach">Government Overreach</SelectItem>
                    <SelectItem value="public health risk">Public Health Risk</SelectItem>
                    <SelectItem value="financial fraud">Financial Fraud</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="All Statuses" />
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
                <Label htmlFor="time-period">Time Period</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="time-period">
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sort-by">Sort By</Label>
                <Select defaultValue="recent">
                  <SelectTrigger id="sort-by">
                    <SelectValue placeholder="Most Recent" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="supporters">Most Supported</SelectItem>
                    <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="grid" className="mb-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''}
          </p>
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="grid" className="mt-6">
          {filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => (
                <ReportCard 
                  key={report.id} 
                  report={report} 
                  onJoinHands={handleJoinHands}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No reports found</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                No reports match your current search and filter criteria. Try adjusting your filters or search term.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="list" className="mt-6">
          {filteredReports.length > 0 ? (
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <Card key={report.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-grow p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-medium">{report.title}</h3>
                        <Label className="bg-secondary text-xs py-1 px-2 rounded">
                          {report.category}
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{report.excerpt}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {report.location}
                      </div>
                    </div>
                    <div className="bg-secondary/30 flex md:flex-col justify-between items-center p-4 border-t md:border-t-0 md:border-l border-border">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">Supporters</div>
                        <div className="font-mono text-lg">{report.supporters}</div>
                      </div>
                      <button 
                        className="text-primary hover:text-primary/80 text-sm flex items-center transition-colors"
                        onClick={() => handleJoinHands(report.id)}
                      >
                        Join Hands
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No reports found</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                No reports match your current search and filter criteria. Try adjusting your filters or search term.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsList;
