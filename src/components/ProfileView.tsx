import React, { useState } from 'react';
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
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface SupportedReport {
  id: string;
  title: string;
  date: Date;
  category: string;
}

const mockReports: SupportedReport[] = [
  {
    id: '1',
    title: 'Environmental Pollution in River Valley',
    date: new Date('2025-03-15'),
    category: 'Environmental Violations'
  },
  {
    id: '3',
    title: 'Worker Exploitation at Manufacturing Plant',
    date: new Date('2025-04-02'),
    category: 'Corporate Misconduct'
  },
  {
    id: '6',
    title: 'Unlawful Surveillance of Activists',
    date: new Date('2025-04-01'),
    category: 'Government Overreach'
  }
];

const ProfileView = () => {
  const [username, setUsername] = useState('WhistleGuardian');
  const [displayName, setDisplayName] = useState('Whistle Guardian');
  const [email, setEmail] = useState('secure-email@protonmail.com');
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSaveProfile = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully", {
      description: "Your pseudonymous identity has been updated.",
    });
  };
  
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Password updated successfully", {
      description: "Your account is now secured with the new password.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="activity">
            <ThumbsUp className="h-4 w-4 mr-2" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
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
                    {displayName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-1.5">
                  <h3 className="text-2xl font-semibold">{displayName}</h3>
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
                      value={username}
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
                      value={displayName}
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
                      value={email}
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
                      <p>{username}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Display Name</Label>
                      <p>{displayName}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Secure Email</Label>
                      <p>{email || 'Not provided'}</p>
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
