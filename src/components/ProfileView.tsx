import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Shield, 
  Settings, 
  Key, 
  Bell, 
  ThumbsUp, 
  FileText,
  Star,
  Clock,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';
import { getReportsByUser } from '@/api/supabaseReports';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface ProfileViewProps {
  user?: any;
}

interface SupportedReport {
  id: string;
  title: string;
  date: Date;
  category: string;
}

const mockReports: SupportedReport[] = [
  {
    id: '1',
    title: 'Environmental Hazard at Local Factory',
    date: new Date(2024, 0, 15),
    category: 'Environmental',
  },
  {
    id: '2',
    title: 'Unsafe Working Conditions',
    date: new Date(2024, 0, 10),
    category: 'Workplace',
  },
  {
    id: '3',
    title: 'Suspicious Financial Activity',
    date: new Date(2024, 0, 5),
    category: 'Financial',
  },
];

const ProfileView = ({ user }: ProfileViewProps = {}) => {
  const navigate = useNavigate();
  const { user: currentUser } = useSupabaseAuth();
  const [username, setUsername] = useState(user?.username || 'WhistleGuardian');
  const [displayName, setDisplayName] = useState(user?.displayName || 'Whistle Guardian');
  const [email, setEmail] = useState(user?.email || 'secure-email@protonmail.com');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phoneNumber: '',
    address: '',
    bio: '',
  });
  const [notifications, setNotifications] = useState({
    reportUpdates: true,
    supporterNotifications: true,
    newsletter: false,
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [myReports, setMyReports] = useState<any[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);

  useEffect(() => {
    const fetchMyReports = async () => {
      if (currentUser) {
        setReportsLoading(true);
        try {
          const reports = await getReportsByUser(currentUser.id);
          setMyReports(reports);
        } catch (error) {
          console.error('Error fetching reports:', error);
        } finally {
          setReportsLoading(false);
        }
      }
    };

    fetchMyReports();
  }, [currentUser]);

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };
  
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Password updated successfully", {
      description: "Your account is now secured with the new password.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="myreports">My Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Your Pseudonymous Profile</CardTitle>
              <CardDescription>
                Manage your pseudonymous identity. Your real identity is never shared.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {user?.displayName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-1.5">
                  <h3 className="text-2xl font-semibold">{user?.displayName}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Trusted Reporter</Badge>
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      <Star className="h-3 w-3 mr-1 fill-primary" />
                      Level 3
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Member since April 2025 • 3 reports supported
                  </p>
                </div>
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={user?.username || ''}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      This is your unique identifier on the platform.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={user?.displayName || ''}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      This name will be visible to other users.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Secure Email (Optional)</Label>
                    <Input
                      id="email"
                      value={user?.email || ''}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      We recommend using a secure email provider like ProtonMail.
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Username</Label>
                      <p>{user?.username}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Display Name</Label>
                      <p>{user?.displayName}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Secure Email</Label>
                      <p>{user?.email || 'Not provided'}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Account Status</Label>
                      <p>Active & Secure</p>
                    </div>
                  </div>
                  
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to maintain account security.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                    <p className="text-xs text-muted-foreground">
                      Use a strong, unique password with at least 12 characters.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  
                  <Button type="submit">Update Password</Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure additional security measures for your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium mb-1">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account.
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Key className="h-4 w-4 mr-2" />
                    Setup 2FA
                  </Button>
                </div>
                
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium mb-1">Login Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Get alerted about new login attempts to your account.
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Bell className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <h4 className="font-medium mb-3">Security Recommendations</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <Shield className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Use a secure email provider (ProtonMail, Tutanota)</span>
                    </li>
                    <li className="flex items-start">
                      <Shield className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Enable two-factor authentication</span>
                    </li>
                    <li className="flex items-start">
                      <Shield className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                      <span>Use a strong, unique password (16+ characters)</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage your notification preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Report Status Updates</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Get notified when reports you support are updated.</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">New Related Reports</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Get alerted about new reports in categories you follow.</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Security Alerts</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Receive critical security notifications about your account.</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Reports You've Supported</CardTitle>
              <CardDescription>
                Track the reports you've joined hands with.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mockReports.length > 0 ? (
                <div className="space-y-4">
                  {mockReports.map((report) => (
                    <div 
                      key={report.id}
                      className="flex items-center justify-between p-3 rounded-md bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="font-medium">{report.title}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {report.date.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{report.category}</Badge>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ThumbsUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No supported reports yet</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    You haven't joined hands with any reports yet. Browse reports and show support for causes you believe in.
                  </p>
                  <Button className="mt-4">Browse Reports</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="myreports">
          <Card>
            <CardHeader>
              <CardTitle>My Reports</CardTitle>
              <CardDescription>
                View and manage all reports you've submitted
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reportsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : myReports.length > 0 ? (
                <div className="space-y-4">
                  {myReports.map((report) => (
                    <div 
                      key={report.id}
                      className="border rounded-lg p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/reports/${report.id}`)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-lg">{report.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {report.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant="outline">
                              <MapPin className="h-3 w-3 mr-1" />
                              {report.location || 'No location'}
                            </Badge>
                            <Badge variant="outline">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDistanceToNow(new Date(report.timestamp), { addSuffix: true })}
                            </Badge>
                            <Badge variant="outline">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {report.supporters} supporters
                            </Badge>
                            <Badge variant={report.status === 'resolved' ? 'default' : 'secondary'}>
                              {report.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          {report.is_bounty_active && (
                            <div className="mb-2">
                              <Badge variant="default">
                                Bounty: {report.bounty_amount === 0 ? 'Free Help' : 
                                  `${report.bounty_currency || 'USD'} ${report.bounty_amount}`}
                              </Badge>
                            </div>
                          )}
                          {report.bounty_acceptances && report.bounty_acceptances.length > 0 && (
                            <div className="text-sm text-muted-foreground">
                              {report.bounty_acceptances.filter((a: any) => a.status === 'pending').length} pending applications
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No reports yet</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
                    You haven't submitted any reports yet. Start by reporting an issue you've encountered.
                  </p>
                  <Button onClick={() => navigate('/submit-report')}>Submit Your First Report</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your notification and privacy preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Preferences</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Report Status Updates</p>
                      <p className="text-sm text-muted-foreground">Get notified when reports you support are updated.</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Related Reports</p>
                      <p className="text-sm text-muted-foreground">Get alerted about new reports in categories you follow.</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Security Alerts</p>
                      <p className="text-sm text-muted-foreground">Receive critical security notifications about your account.</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border space-y-4">
                <h3 className="text-lg font-medium">Privacy Settings</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Profile Visibility</p>
                      <p className="text-sm text-muted-foreground">Control who can see your pseudonymous profile.</p>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Data Retention</p>
                      <p className="text-sm text-muted-foreground">Manage how long your data is stored on our platform.</p>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <h3 className="text-lg font-medium mb-4">Danger Zone</h3>
                <div className="flex items-center justify-between bg-destructive/10 p-4 rounded-md">
                  <div>
                    <p className="font-medium">Delete Account</p>
                    <p className="text-sm text-muted-foreground">Permanently remove your account and all associated data.</p>
                  </div>
                  <Button variant="destructive" size="sm">Delete Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileView;
