import React, { useState, useEffect } from 'react'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { supportReport, checkReportLike } from '@/api/supabaseReports';
import ReportCard, { Report } from './ReportCard';
import { CATEGORIES, STATUSES } from '@/constants';
import {
  ALL,
  INITIAL_CATEGORY_FILTER,
  INITIAL_SORT_BY,
  INITIAL_STATUS_FILTER,
  INITIAL_TIME_PERIOD,
} from './ReportsListConstants';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';

interface ReportsListProps {
  reports: Report[];
  loading?: boolean;
}

const ReportsList: React.FC<ReportsListProps> = ({
  reports: initialReports,
  loading = false,
}) => {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [likedReports, setLikedReports] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(INITIAL_CATEGORY_FILTER);
  const [statusFilter, setStatusFilter] = useState(INITIAL_STATUS_FILTER);
  const [timePeriod, setTimePeriod] = useState(INITIAL_TIME_PERIOD);
  const [sortBy, setSortBy] = useState(INITIAL_SORT_BY);
  const navigate = useNavigate();

  // Update reports when initialReports changes
  useEffect(() => {
    setReports(initialReports);
  }, [initialReports]);

  // Fetch liked reports when component mounts
  useEffect(() => {
    const fetchLikedReports = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: likes } = await supabase
          .from('report_likes')
          .select('report_id')
          .eq('user_id', user.id);

        if (likes) {
          setLikedReports(new Set(likes.map(like => like.report_id)));
        }
      } catch (error) {
        console.error('Error fetching liked reports:', error);
      }
    };

    fetchLikedReports();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredReports = reports.filter((report) => {
    // Apply search filter
    const matchesSearch =
      searchQuery === '' ||
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    // Apply category filter
    const matchesCategory =
      categoryFilter === ALL ||
      report.category.toLowerCase() === categoryFilter.toLowerCase();

    // Apply status filter
    const matchesStatus =
      statusFilter === ALL || report.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleJoinHands = async (reportId: string) => {
    try {
      const result = await supportReport(reportId);
      if (result) {
        setReports(prevReports =>
          prevReports.map(report =>
            report.id === reportId
              ? { ...report, supporters: result.supporters }
              : report
          )
        );
        
        // Update liked status
        if (result.isLiked) {
          setLikedReports(prev => new Set([...prev, reportId]));
        } else {
          setLikedReports(prev => {
            const newSet = new Set(prev);
            newSet.delete(reportId);
            return newSet;
          });
        }
        
        toast.success(result.isLiked ? "Thank you for your support!" : "Support removed");
      }
    } catch (error) {
      console.error('Error updating support:', error);
      toast.error('Failed to update support. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-[200px] animate-pulse rounded-lg bg-muted"
          />
        ))}
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No reports found</p>
      </div>
    );
  }

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
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value={ALL}>All Categories</SelectItem>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
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
                    <SelectItem value={ALL}>All Statuses</SelectItem>
                    {STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time-period">Time Period</Label>
                <Select defaultValue={INITIAL_TIME_PERIOD}>
                  <SelectTrigger id="time-period">
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value={ALL}>All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort-by">Sort By</Label>
                <Select defaultValue={INITIAL_SORT_BY}>
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
            Showing {filteredReports.length} report
            {filteredReports.length !== 1 ? 's' : ''}
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
                  isLiked={likedReports.has(report.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No reports found</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                No reports match your current search and filter criteria. Try
                adjusting your filters or search term.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          {filteredReports.length > 0 ? (
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <Card 
                  key={report.id} 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={(e) => {
                    // Prevent navigation if Join Hands button is clicked
                    if ((e.target as HTMLElement).closest('button')) return;
                    navigate(`/reports/${report.id}`);
                  }}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-grow p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-medium">{report.title}</h3>
                        <Label className="bg-secondary text-xs py-1 px-2 rounded">
                          {report.category}
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {report.excerpt}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {report.location}
                      </div>
                    </div>
                    <div className="bg-secondary/30 flex md:flex-col justify-between items-center p-4 border-t md:border-t-0 md:border-l border-border">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">
                          Supporters
                        </div>
                        <div className="font-mono text-lg">
                          {report.supporters}
                        </div>
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
                No reports match your current search and filter criteria. Try
                adjusting your filters or search term.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsList;
