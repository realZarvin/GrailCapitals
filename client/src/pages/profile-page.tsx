import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Shield, Key, User, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { generateWallet } from "@/lib/crypto-utils";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    country: user?.country || "",
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled || false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  
  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      const res = await apiRequest("PATCH", "/api/profile", data);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Password update mutation
  const updatePasswordMutation = useMutation({
    mutationFn: async (data) => {
      const res = await apiRequest("POST", "/api/profile/password", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: (error) => {
      toast({
        title: "Password update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // 2FA activation mutation
  const activateTwoFactorMutation = useMutation({
    mutationFn: async (code) => {
      const res = await apiRequest("POST", "/api/profile/2fa/activate", { code });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "2FA Activated",
        description: "Two-factor authentication has been activated for your account.",
      });
      setTwoFactorEnabled(true);
      setShowQRCode(false);
    },
    onError: (error) => {
      toast({
        title: "Activation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // 2FA deactivation mutation
  const deactivateTwoFactorMutation = useMutation({
    mutationFn: async (code) => {
      const res = await apiRequest("POST", "/api/profile/2fa/deactivate", { code });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "2FA Deactivated",
        description: "Two-factor authentication has been deactivated for your account.",
      });
      setTwoFactorEnabled(false);
    },
    onError: (error) => {
      toast({
        title: "Deactivation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileData);
  };
  
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    updatePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };
  
  const handle2FAToggle = () => {
    if (twoFactorEnabled) {
      // Ask for verification code to disable
      toast({
        title: "Verification required",
        description: "Please enter your 2FA code to disable two-factor authentication.",
      });
    } else {
      // Start the 2FA setup process
      setShowQRCode(true);
    }
  };
  
  const handle2FASubmit = (e) => {
    e.preventDefault();
    if (twoFactorEnabled) {
      deactivateTwoFactorMutation.mutate(verificationCode);
    } else {
      activateTwoFactorMutation.mutate(verificationCode);
    }
    setVerificationCode("");
  };
  
  // Placeholder for QR code URL
  const qrCodeUrl = "https://example.com/qrcode";
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black">
      {/* Mobile Sidebar */}
      <MobileSidebar />
      
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-1">Account Settings</h2>
          <p className="text-muted-foreground">Manage your profile and security preferences</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto">
            <TabsTrigger value="general" className="py-3">
              <User className="h-4 w-4 mr-2" />
              <span>General</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="py-3">
              <Lock className="h-4 w-4 mr-2" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="wallets" className="py-3">
              <Shield className="h-4 w-4 mr-2" />
              <span>Wallet Addresses</span>
            </TabsTrigger>
          </TabsList>
          
          {/* General Tab */}
          <TabsContent value="general">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Manage your personal information</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(!isEditing)}
                    className="border-accent text-accent hover:bg-accent hover:text-primary"
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={profileData.country}
                        onChange={(e) => setProfileData({...profileData, country: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="mt-6 flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={updateProfileMutation.isPending}
                      >
                        {updateProfileMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : "Save Changes"}
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border mt-6">
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
                <CardDescription>View your account status and limits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <div>
                      <p className="font-medium">Account Verification</p>
                      <p className="text-sm text-muted-foreground">Identity verification status</p>
                    </div>
                    <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500">
                      Verified
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <div>
                      <p className="font-medium">Daily Withdrawal Limit</p>
                      <p className="text-sm text-muted-foreground">Maximum daily withdrawal amount</p>
                    </div>
                    <span className="font-medium">$5,000</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Account Level</p>
                      <p className="text-sm text-muted-foreground">Based on your investment activity</p>
                    </div>
                    <Badge variant="outline" className="bg-accent/20 text-accent border-accent">
                      Gold
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Password Management</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      />
                      <p className="text-xs text-muted-foreground">
                        Password must be at least 8 characters with a mix of letters, numbers, and symbols
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={updatePasswordMutation.isPending || 
                        !passwordData.currentPassword || 
                        !passwordData.newPassword || 
                        !passwordData.confirmPassword}
                    >
                      {updatePasswordMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : "Update Password"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border mt-6">
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account by enabling two-factor authentication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Shield className={`h-5 w-5 ${twoFactorEnabled ? 'text-green-500' : 'text-muted-foreground'}`} />
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        {twoFactorEnabled 
                          ? "Your account is protected with 2FA" 
                          : "Protect your account with 2FA"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={handle2FAToggle}
                  />
                </div>
                
                {showQRCode && !twoFactorEnabled && (
                  <div className="mb-6 p-4 border border-border rounded-lg">
                    <div className="text-center mb-4">
                      <p className="font-medium mb-2">Scan QR Code</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                      </p>
                      <div className="bg-white p-4 inline-block rounded">
                        <img src={qrCodeUrl} alt="2FA QR Code" className="w-40 h-40" />
                      </div>
                    </div>
                    
                    <form onSubmit={handle2FASubmit} className="mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="verificationCode">Verification Code</Label>
                        <Input
                          id="verificationCode"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          placeholder="Enter 6-digit code"
                          className="text-center text-lg tracking-widest"
                          maxLength={6}
                        />
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <Button 
                          type="submit" 
                          disabled={activateTwoFactorMutation.isPending || verificationCode.length !== 6}
                        >
                          {activateTwoFactorMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Verifying...
                            </>
                          ) : "Verify and Activate"}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
                
                {twoFactorEnabled && (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-500/10 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-green-500" />
                        <p className="font-medium text-green-500">Two-factor authentication is enabled</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your account is protected with an additional layer of security.
                      </p>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white w-full"
                      onClick={handle2FAToggle}
                    >
                      Disable Two-Factor Authentication
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border mt-6">
              <CardHeader>
                <CardTitle>Login Sessions</CardTitle>
                <CardDescription>Manage your active login sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-muted-foreground">Windows • Chrome • Last active: Now</p>
                      </div>
                      <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500">
                        Active
                      </Badge>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white w-full">
                    Logout from All Other Devices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Wallets Tab */}
          <TabsContent value="wallets">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Your Wallet Addresses</CardTitle>
                <CardDescription>
                  These are your designated wallet addresses for withdrawals. Always double-check before confirming transactions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-lg">Bitcoin (BTC)</Label>
                    <div className="flex items-center">
                      <Input 
                        value="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" 
                        readOnly
                        className="font-mono text-xs"
                      />
                      <Button variant="ghost" className="ml-2" onClick={() => {
                        navigator.clipboard.writeText("bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh");
                        toast({
                          title: "Address copied",
                          description: "BTC address copied to clipboard",
                        });
                      }}>
                        <i className="fas fa-copy"></i>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-lg">Ethereum (ETH)</Label>
                    <div className="flex items-center">
                      <Input 
                        value="0x71C7656EC7ab88b098defB751B7401B5f6d8976F" 
                        readOnly
                        className="font-mono text-xs"
                      />
                      <Button variant="ghost" className="ml-2" onClick={() => {
                        navigator.clipboard.writeText("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
                        toast({
                          title: "Address copied",
                          description: "ETH address copied to clipboard",
                        });
                      }}>
                        <i className="fas fa-copy"></i>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-lg">Solana (SOL)</Label>
                    <div className="flex items-center">
                      <Input 
                        value="5YNmwXi1gXqmGQPVgFVZFJrpVU6LQiJ4mJxW2H2ow5SQ" 
                        readOnly
                        className="font-mono text-xs"
                      />
                      <Button variant="ghost" className="ml-2" onClick={() => {
                        navigator.clipboard.writeText("5YNmwXi1gXqmGQPVgFVZFJrpVU6LQiJ4mJxW2H2ow5SQ");
                        toast({
                          title: "Address copied",
                          description: "SOL address copied to clipboard",
                        });
                      }}>
                        <i className="fas fa-copy"></i>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-amber-500/10 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <i className="fas fa-exclamation-triangle text-amber-500 mt-1"></i>
                      <div>
                        <p className="font-medium text-amber-500">Important Notice</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          For security reasons, changing wallet addresses requires verification. 
                          Please contact support if you need to update your withdrawal wallets.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" 
                  className="border-accent text-accent hover:bg-accent hover:text-primary"
                  onClick={() => {
                    toast({
                      title: "Request submitted",
                      description: "Your request to update wallet addresses has been submitted. Our team will contact you shortly.",
                    });
                  }}
                >
                  Request Address Change
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
