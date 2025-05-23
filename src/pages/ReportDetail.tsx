import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getReportById, supportReport, checkReportLike, acceptBounty, getBountyApplications, updateBountyApplication } from '@/api/supabaseReports';
import { toast } from 'sonner';
import { 
  Clock, 
  MapPin, 
  Tag, 
  UserCheck, 
  AlertCircle, 
  ArrowLeft, 
  FileImage,
  ThumbsUp,
  Users,
  CheckCircle,
  XCircle
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
import { Report } from "@/components/ReportCard";
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showAcceptBountyDialog, setShowAcceptBountyDialog] = useState(false);
  const [bountyAgreement, setBountyAgreement] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchReportAndLikeStatus = async () => {
      if (!id) {
        navigate('/reports');
        return;
      }

      try {
        setLoading(true);
        const data = await getReportById(id);
        
        if (data) {
          // Transform the data to match the Report interface
          const transformedReport: Report = {
            id: data.id,
            title: data.title,
            excerpt: data.description,
            category: data.category,
            status: data.status,
            location: data.location || 'Unknown location',
            timestamp: data.timestamp,
            supporters: data.supporters,
            evidence: data.evidence,
            bounty_amount: data.bounty_amount,
            bounty_currency: data.bounty_currency,
            help_needed: data.help_needed,
            is_bounty_active: data.is_bounty_active
          };
          
          setReport(transformedReport);
          
          // Check if user is the owner
          if (user && data.user_id === user.id) {
            setIsOwner(true);
            // Fetch applications if owner
            const apps = await getBountyApplications(id);
            setApplications(apps);
          }
          
          // Check if user has liked this report
          const liked = await checkReportLike(id);
          setIsLiked(liked);
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

    fetchReportAndLikeStatus();
  }, [id, navigate, user]);

  const handleSupport = async () => {
    if (!report) return;

    try {
      const result = await supportReport(report.id);
      if (result) {
        setReport({ ...report, supporters: result.supporters });
        setIsLiked(result.isLiked);
        toast.success(result.isLiked ? "Thank you for your support!" : "Support removed");
      }
    } catch (error) {
      console.error("Error updating support:", error);
      toast.error('Failed to register support');
    }
  };

  const handleAcceptBounty = async () => {
    if (!bountyAgreement) {
      toast.error("You must agree to the legal terms to accept the bounty");
      return;
    }

    if (!id) return;

    const success = await acceptBounty(id);
    if (success) {
      setShowAcceptBountyDialog(false);
      setBountyAgreement(false);
    }
  };

  const handleApplicationUpdate = async (applicationId: string, status: 'approved' | 'rejected') => {
    const success = await updateBountyApplication(applicationId, status);
    if (success) {
      // Refresh applications
      const apps = await getBountyApplications(id!);
      setApplications(apps);
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
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate('/reports')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl mb-2">{report.title}</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{formattedDate}</span>
                        <MapPin className="h-4 w-4 ml-2" />
                        <span>{report.location}</span>
                      </div>
                    </div>
                    <Badge variant={report.status === "resolved" ? "default" : "secondary"}>
                      {report.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{report.excerpt}</p>
                </CardContent>
              </Card>

              {report.evidence && report.evidence.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Evidence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {report.evidence.map((url, index) => (
                        <div key={index} className="aspect-square relative">
                          <img
                            src={url}
                            alt={`Evidence ${index + 1}`}
                            className="object-cover w-full h-full rounded-lg"
                          />
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
                    variant={isLiked ? "default" : "outline"}
                    onClick={handleSupport}
                  >
                    <ThumbsUp className={`mr-2 h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? 'Joined Hands' : 'Join Hands'}
                  </Button>
                </CardFooter>
              </Card>

              {report.is_bounty_active && !isOwner && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Bounty Available</CardTitle>
                    <CardDescription>
                      The report owner is offering a bounty for help with this issue.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="text-2xl font-bold">
                          {report.bounty_amount === 0 ? 'Free Help Requested' : 
                            `${report.bounty_currency || 'USD'} ${report.bounty_amount}`}
                        </div>
                        <div className="text-sm text-muted-foreground">Bounty Amount</div>
                      </div>
                      {report.help_needed && (
                        <div>
                          <div className="font-medium mb-1">Help Needed:</div>
                          <p className="text-sm text-muted-foreground">{report.help_needed}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => setShowAcceptBountyDialog(true)}
                    >
                      Accept Bounty
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {isOwner && applications.length > 0 && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>
                      <Users className="h-5 w-5 inline mr-2" />
                      Bounty Applications
                    </CardTitle>
                    <CardDescription>
                      People who want to help with your report
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <div key={app.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">
                                {app.helper?.raw_user_meta_data?.full_name || app.helper?.email || 'Anonymous'}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Applied {formatDistanceToNow(new Date(app.accepted_at), { addSuffix: true })}
                              </div>
                            </div>
                            <Badge 
                              variant={
                                app.status === 'approved' ? 'default' : 
                                app.status === 'rejected' ? 'destructive' : 
                                'secondary'
                              }
                            >
                              {app.status}
                            </Badge>
                          </div>
                          {app.status === 'pending' && (
                            <div className="flex gap-2 mt-4">
                              <Button
                                size="sm"
                                onClick={() => handleApplicationUpdate(app.id, 'approved')}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApplicationUpdate(app.id, 'rejected')}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <Dialog open={showAcceptBountyDialog} onOpenChange={setShowAcceptBountyDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Accept Bounty</DialogTitle>
            <DialogDescription>
              By accepting this bounty, you agree to help resolve the reported issue.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                <div className="space-y-2">
                  <h4 className="font-medium">Legal Agreement</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• I will act lawfully and ethically in all my actions</li>
                    <li>• I understand that all actions must comply with local, state, and federal laws</li>
                    <li>• I am solely responsible for my actions and their consequences</li>
                    <li>• The platform is not responsible for any actions I take</li>
                    <li>• Any agreement is between me and the report poster directly</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Checkbox
                id="bountyAgreement"
                checked={bountyAgreement}
                onCheckedChange={(checked) => setBountyAgreement(checked as boolean)}
              />
              <div className="space-y-1 leading-none">
                <label htmlFor="bountyAgreement" className="text-sm font-medium cursor-pointer">
                  I understand and agree to the legal terms
                </label>
                <p className="text-sm text-muted-foreground">
                  I acknowledge that I am responsible for ensuring all actions comply with the law
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAcceptBountyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAcceptBounty} disabled={!bountyAgreement}>
              Accept Bounty
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportDetail;
