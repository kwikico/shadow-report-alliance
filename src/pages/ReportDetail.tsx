
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getReportById, supportReport } from '@/api/supabaseReports';
import { toast } from 'sonner';
import { 
  Clock, 
  MapPin, 
  Tag, 
  UserCheck, 
  AlertCircle, 
  ArrowLeft, 
  HandsClapping,
  FileImage
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) {
        navigate('/reports');
        return;
      }

      try {
        setLoading(true);
        const data = await getReportById(id);
        
        if (data) {
          setReport(data);
        } else {
          navigate('/reports');
          toast.error('Report not found');
        }
      } catch (error) {
        console.error("Error fetching report:", error);
        toast.error('Error loading report details');
        navigate('/reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id, navigate]);

  const handleSupport = async () => {
    if (!report) return;

    try {
      const result = await supportReport(report.id);
      if (result) {
        setReport({ ...report, supporters: result.supporters });
        toast.success("Thank you for your support!");
      }
    } catch (error) {
      toast.error('Failed to register support');
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'investigating':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Report Not Found</h1>
            <p className="text-gray-600 mb-6">
              The report you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/reports')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Reports
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedDate = report.timestamp ? formatDistanceToNow(new Date(report.timestamp), { addSuffix: true }) : 'Unknown date';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button variant="outline" onClick={() => navigate('/reports')} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Reports
            </Button>
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold">{report.title}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" /> {formattedDate}
                  </span>
                  {report.location && (
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" /> {report.location}
                    </span>
                  )}
                  <span className="flex items-center">
                    <Tag className="h-4 w-4 mr-1" /> {report.category}
                  </span>
                  <span className="flex items-center">
                    <UserCheck className="h-4 w-4 mr-1" /> {report.supporters} supporters
                  </span>
                </div>
              </div>
              
              <div className="flex items-center">
                <Badge className={getStatusColor(report.status)}>
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{report.description}</p>
                </CardContent>
              </Card>

              {report.evidence && report.evidence.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileImage className="h-5 w-5 mr-2" />
                      Evidence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {report.evidence.map((url: string, idx: number) => (
                        <div key={idx} className="overflow-hidden rounded-md border">
                          <a href={url} target="_blank" rel="noopener noreferrer">
                            {url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                              <img 
                                src={url} 
                                alt={`Evidence ${idx + 1}`}
                                className="h-40 w-full object-cover"
                              />
                            ) : (
                              <div className="h-40 w-full flex items-center justify-center bg-gray-100">
                                <span className="text-sm text-gray-500">View File</span>
                              </div>
                            )}
                          </a>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Support This Report</CardTitle>
                  <CardDescription>
                    Show your support by joining hands with others who believe this issue should be addressed.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="text-3xl font-bold">{report.supporters}</div>
                    <div className="text-sm text-gray-500">Current Supporters</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={handleSupport}
                  >
                    <HandsClapping className="mr-2 h-4 w-4" />
                    Join Hands
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReportDetail;
