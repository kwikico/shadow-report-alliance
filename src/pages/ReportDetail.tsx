
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Calendar, 
  FileText, 
  Image, 
  ThumbsUp, 
  MessageSquare, 
  ArrowLeft,
  Shield,
  AlertTriangle,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import { getReport, postSupport } from '@/api';

interface EvidenceItem {
  type: 'image' | 'document';
  url: string;
}

interface Report {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  timestamp: string;
  supporters: number;
  status: 'verified' | 'investigating' | 'pending';
  evidence: string[];
  updates: { date: string; content: string }[];
}

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchReport(id);
    }
  }, [id]);

  const fetchReport = async (reportId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getReport(reportId);
      setReport(data);
    } catch (err) {
      setError('Failed to fetch report');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinHands = async () => {
    if (id) {
      try {
        const response = await postSupport(id);
        if (response) {
          setReport((prevReport) =>
            prevReport
              ? { ...prevReport, supporters: response.supporters }
              : prevReport
          );
          toast.success('You\'ve joined hands with this report', {
            description:
              'Your support has been registered while protecting your identity.',
          });
        } else {
          throw new Error('Failed to update support count');
        }
      } catch (err) {
        const description = err instanceof Error ? err.message : 'Failed to add support';
        toast.error('Failed to add support', { description });
      }
    }

  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <p>Loading report details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <p className="text-red-500">{error || 'Report not found'}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link
              to="/reports"
              className="flex items-center text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Reports
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge
                      className={
                        report.status === 'verified'
                          ? 'bg-green-500'
                          : report.status === 'investigating'
                            ? 'bg-yellow-500'
                            : 'bg-blue-500'
                      }
                    >
                      {report.status}
                    </Badge>
                    <Badge variant="outline">{report.category}</Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold">{report.title}</CardTitle>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {report.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(report.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="prose prose-invert max-w-none">
                    <p className="whitespace-pre-line text-foreground">
                      {report.description}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium flex items-center mb-3">
                      <FileText className="h-5 w-5 mr-2" />
                      Supporting Evidence
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {report.evidence.map((evidenceUrl, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 bg-secondary/50 rounded-md"
                        >
                          {evidenceUrl.endsWith('.pdf') ? (
                            <FileText className="h-5 w-5 mr-2 text-primary" />
                          ) : (
                            <Image className="h-5 w-5 mr-2 text-primary" />
                          )}
                          <div className="flex-grow">
                            <p className="text-sm font-medium truncate">
                              {evidenceUrl.split('/').pop()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {/* TODO: Add file size if available */}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {report.updates.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="font-medium flex items-center mb-3">
                          <Calendar className="h-5 w-5 mr-2" />
                          Report Updates
                        </h3>
                        <div className="space-y-3">
                          {report.updates.map((update, index) => (
                            <div
                              key={index}
                              className="p-3 bg-secondary/50 rounded-md"
                            >
                              <div className="text-xs text-muted-foreground mb-1">
                                {new Date(update.date).toLocaleDateString()} at{' '}
                                {new Date(update.date).toLocaleTimeString()}
                              </div>
                              <p className="text-sm">{update.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4 text-center">
                    <h3 className="text-lg font-medium">Show Your Support</h3>
                    <div className="text-4xl font-bold">{report.supporters}</div>
                    <p className="text-sm text-muted-foreground">
                      people have joined hands
                    </p>
                    <Button className="w-full" onClick={handleJoinHands}>
                      <ThumbsUp className="h-5 w-5 mr-2" />
                      Join Hands
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Your support increases visibility and priority of this
                      report while maintaining your anonymity.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Secure Discussion</h3>
                    <div className="p-4 bg-secondary/50 rounded-md text-center">
                      <MessageSquare className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-sm mb-2">
                        Join the encrypted discussion about this report
                      </p>
                      <Button variant="outline" className="w-full">
                        Open Secure Chat
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        End-to-end encrypted • Your identity remains protected
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Report Verification</h3>
                    <div
                      className={`p-3 rounded-md ${
                        report.status === 'verified'
                          ? 'bg-green-500/10'
                          : report.status === 'investigating'
                            ? 'bg-yellow-500/10'
                            : 'bg-blue-500/10'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <Shield
                          className={`h-5 w-5 mr-2 ${
                            report.status === 'verified'
                              ? 'text-green-500'
                              : report.status === 'investigating'
                                ? 'text-yellow-500'
                                : 'text-blue-500'
                          }`}
                        />
                        <span className="font-medium">
                          {report.status === 'verified'
                            ? 'Verified Report'
                            : report.status === 'investigating'
                              ? 'Under Investigation'
                              : 'Pending Verification'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {report.status === 'verified'
                          ? 'This report has been verified by our team and found to be credible based on evidence.'
                          : report.status === 'investigating'
                            ? 'Our team is actively investigating this report to verify its contents.'
                            : 'This report is pending verification by our team.'}
                      </p>
                    </div>

                    <div className="p-3 bg-secondary/50 rounded-md">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                        <span className="font-medium">Report Responsibly</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        If you have additional information about this report,
                        please submit it securely through our platform.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Report Submitter</h3>
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 text-primary rounded-full p-2">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Anonymous Whistleblower</p>
                        <p className="text-xs text-muted-foreground">
                          Identity protected for security
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This platform protects the identity of all report
                      submitters to ensure their safety.
                    </p>
                  </div>
                </CardContent>
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
