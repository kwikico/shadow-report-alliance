
import React from 'react';
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
  HandsClapping, 
  MessageSquare, 
  ArrowLeft,
  Shield,
  AlertTriangle,
  User
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data for the detailed report
const mockReport = {
  id: '1',
  title: 'Environmental Pollution in River Valley',
  description: `
    Our investigation has uncovered significant chemical waste discharge from the industrial facility located at the north end of River Valley. Water samples collected over the past three months show dangerous levels of heavy metals and industrial solvents.
    
    Local wildlife has been severely impacted, with fish die-offs reported by residents and documented in our evidence. Multiple residents have also reported unusual health symptoms after using water from local wells.
    
    The facility appears to be dumping waste during evening hours to avoid detection, but we've documented a pattern of activity through nighttime monitoring.
    
    Relevant environmental regulations being violated include the Clean Water Act Section 303 and state regulations on industrial waste disposal.
  `,
  location: 'River Valley, WA',
  coordinates: [47.6062, -122.3321],
  category: 'Environmental Violations',
  timestamp: new Date('2025-03-15T10:30:00'),
  supporters: 128,
  status: 'verified',
  evidence: [
    { type: 'image', name: 'water-sample-analysis.jpg', size: '2.4 MB' },
    { type: 'document', name: 'chemical-test-results.pdf', size: '1.8 MB' },
    { type: 'image', name: 'site-photo-1.jpg', size: '3.2 MB' },
    { type: 'document', name: 'witness-testimonies.pdf', size: '4.1 MB' }
  ],
  updates: [
    {
      date: new Date('2025-03-20T09:15:00'),
      content: 'Environmental protection agency has acknowledged receipt of the report and assigned an investigation team.'
    },
    {
      date: new Date('2025-03-28T14:30:00'),
      content: 'Initial water testing by authorities confirms the presence of contaminants above legal limits.'
    }
  ]
};

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [supportCount, setSupportCount] = React.useState(mockReport.supporters);
  
  const handleJoinHands = () => {
    setSupportCount(prev => prev + 1);
    toast.success("You've joined hands with this report", {
      description: "Your support has been registered while protecting your identity.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link to="/reports" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
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
                        mockReport.status === 'verified' ? 'bg-green-500' :
                        mockReport.status === 'investigating' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }
                    >
                      {mockReport.status}
                    </Badge>
                    <Badge variant="outline">{mockReport.category}</Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold">{mockReport.title}</CardTitle>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {mockReport.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {mockReport.timestamp.toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="prose prose-invert max-w-none">
                    <p className="whitespace-pre-line text-foreground">{mockReport.description}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium flex items-center mb-3">
                      <FileText className="h-5 w-5 mr-2" />
                      Supporting Evidence
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {mockReport.evidence.map((item, index) => (
                        <div key={index} className="flex items-center p-3 bg-secondary/50 rounded-md">
                          {item.type === 'image' ? (
                            <Image className="h-5 w-5 mr-2 text-primary" />
                          ) : (
                            <FileText className="h-5 w-5 mr-2 text-primary" />
                          )}
                          <div className="flex-grow">
                            <p className="text-sm font-medium truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.size}</p>
                          </div>
                          <Button variant="ghost" size="sm">View</Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {mockReport.updates.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="font-medium flex items-center mb-3">
                          <Calendar className="h-5 w-5 mr-2" />
                          Report Updates
                        </h3>
                        <div className="space-y-3">
                          {mockReport.updates.map((update, index) => (
                            <div key={index} className="p-3 bg-secondary/50 rounded-md">
                              <div className="text-xs text-muted-foreground mb-1">
                                {update.date.toLocaleDateString()} at {update.date.toLocaleTimeString()}
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
                    <div className="text-4xl font-bold">{supportCount}</div>
                    <p className="text-sm text-muted-foreground">people have joined hands</p>
                    <Button 
                      className="w-full"
                      onClick={handleJoinHands}
                    >
                      <HandsClapping className="h-5 w-5 mr-2" />
                      Join Hands
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Your support increases visibility and priority of this report while maintaining your anonymity.
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
                      <p className="text-sm mb-2">Join the encrypted discussion about this report</p>
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
                    <div className={`p-3 rounded-md ${
                      mockReport.status === 'verified' ? 'bg-green-500/10' :
                      mockReport.status === 'investigating' ? 'bg-yellow-500/10' :
                      'bg-blue-500/10'
                    }`}>
                      <div className="flex items-center mb-2">
                        <Shield className={`h-5 w-5 mr-2 ${
                          mockReport.status === 'verified' ? 'text-green-500' :
                          mockReport.status === 'investigating' ? 'text-yellow-500' :
                          'text-blue-500'
                        }`} />
                        <span className="font-medium">
                          {mockReport.status === 'verified' ? 'Verified Report' :
                          mockReport.status === 'investigating' ? 'Under Investigation' :
                          'Pending Verification'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {mockReport.status === 'verified' ? 
                          'This report has been verified by our team and found to be credible based on evidence.' :
                          mockReport.status === 'investigating' ? 
                          'Our team is actively investigating this report to verify its contents.' :
                          'This report is pending verification by our team.'}
                      </p>
                    </div>
                    
                    <div className="p-3 bg-secondary/50 rounded-md">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                        <span className="font-medium">Report Responsibly</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        If you have additional information about this report, please submit it securely through our platform.
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
                      This platform protects the identity of all report submitters to ensure their safety.
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
