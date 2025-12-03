import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  Store,
  Mail,
  Phone,
  Lock,
  Shield,
  Moon,
  Sun,
  Trash2,
  LogOut,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  MessageSquare,
  DollarSign,
  Clock,
  FileText,
  MapPin,
  BadgeCheck,
  Building2,
  User,
  Calendar,
  CreditCard,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Globe,
} from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useBlogSettings } from './hooks/useBlogSettings';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface HelpaSettingsProps {
  onNavigate: (page: string) => void;
  onBack?: () => void;
}

interface ProviderProfile {
  userId: string;
  businessName: string;
  whatsappNumber: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  accountType: 'individual' | 'business';
  bio: string;
  location: string;
  availability: 'available' | 'busy' | 'unavailable';
  responseTime: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  
  // New verification fields
  fullName?: string;
  email?: string;
  bvn?: string;
  nin?: string;
  cacNumber?: string;
  businessAddress?: string;
  businessCategory?: string;
  yearsInBusiness?: number;
  registrationDate?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  verificationDocuments?: {
    idType?: 'nin' | 'drivers_license' | 'passport';
    idNumber?: string;
    idVerified?: boolean;
    businessDocumentType?: 'cac' | 'business_permit';
    businessDocumentNumber?: string;
    businessDocumentVerified?: boolean;
  };
}

export function HelpaSettings({ onNavigate, onBack }: HelpaSettingsProps) {
  const { user, signOut, refreshUser } = useAuth();
  const { isWhiteBackground, setIsWhiteBackground } = useBlogSettings();

  // Provider profile state
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState<ProviderProfile | null>(null);

  // Profile form state
  const [businessName, setBusinessName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState<'available' | 'busy' | 'unavailable'>('available');
  const [responseTime, setResponseTime] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Payment info state
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [savingPayment, setSavingPayment] = useState(false);

  // Business verification state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [bvn, setBvn] = useState('');
  const [nin, setNin] = useState('');
  const [cacNumber, setCacNumber] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [yearsInBusiness, setYearsInBusiness] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [facebookHandle, setFacebookHandle] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [linkedinHandle, setLinkedinHandle] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [idType, setIdType] = useState<'nin' | 'drivers_license' | 'passport'>('nin');
  const [idNumber, setIdNumber] = useState('');
  const [savingVerification, setSavingVerification] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Load provider data
  useEffect(() => {
    if (user) {
      loadProviderProfile();
    }
  }, [user]);

  const loadProviderProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-bb3bbc22/provider/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const providerData = data.provider;
        setProvider(providerData);

        // Populate form fields
        setBusinessName(providerData.businessName || '');
        setWhatsappNumber(providerData.whatsappNumber || '');
        setBio(providerData.bio || '');
        setLocation(providerData.location || '');
        setAvailability(providerData.availability || 'available');
        setResponseTime(providerData.responseTime || '');
        setBankName(providerData.bankName || '');
        setAccountNumber(providerData.accountNumber || '');
        setAccountName(providerData.accountName || '');
        
        // Populate verification fields
        setFullName(providerData.fullName || '');
        setEmail(providerData.email || user?.email || '');
        setBvn(providerData.bvn || '');
        setNin(providerData.nin || '');
        setCacNumber(providerData.cacNumber || '');
        setBusinessAddress(providerData.businessAddress || '');
        setBusinessCategory(providerData.businessCategory || '');
        setYearsInBusiness(providerData.yearsInBusiness?.toString() || '');
        setRegistrationDate(providerData.registrationDate || '');
        setInstagramHandle(providerData.socialMedia?.instagram || '');
        setFacebookHandle(providerData.socialMedia?.facebook || '');
        setTwitterHandle(providerData.socialMedia?.twitter || '');
        setLinkedinHandle(providerData.socialMedia?.linkedin || '');
        setWebsiteUrl(providerData.socialMedia?.website || '');
        setIdType(providerData.verificationDocuments?.idType || 'nin');
        setIdNumber(providerData.verificationDocuments?.idNumber || '');
      }
    } catch (error) {
      console.error('Error loading provider profile:', error);
      toast.error('Failed to load provider profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !provider) return;

    setSavingProfile(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-bb3bbc22/provider/update-profile`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            businessName,
            whatsappNumber,
            bio,
            location,
            availability,
            responseTime,
          }),
        }
      );

      if (response.ok) {
        await loadProviderProfile();
        toast.success('Profile updated successfully');
      } else {
        const error = await response.text();
        toast.error(error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePayment = async () => {
    if (!user || !provider) return;

    if (!accountNumber || accountNumber.length !== 10) {
      toast.error('Please enter a valid 10-digit account number');
      return;
    }

    setSavingPayment(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-bb3bbc22/provider/update-payment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bankName,
            accountNumber,
            accountName,
          }),
        }
      );

      if (response.ok) {
        await loadProviderProfile();
        toast.success('Payment information updated successfully');
      } else {
        const error = await response.text();
        toast.error(error || 'Failed to update payment information');
      }
    } catch (error) {
      console.error('Error updating payment info:', error);
      toast.error('Failed to update payment information');
    } finally {
      setSavingPayment(false);
    }
  };

  const handleSaveVerification = async (silent = false) => {
    if (!user || !provider) return;

    if (!silent) setSavingVerification(true);
    setAutoSaving(true);
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-bb3bbc22/provider/update-verification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName,
            email,
            bvn,
            nin,
            cacNumber,
            businessAddress,
            businessCategory,
            yearsInBusiness: yearsInBusiness ? parseInt(yearsInBusiness) : undefined,
            registrationDate,
            socialMedia: {
              instagram: instagramHandle,
              facebook: facebookHandle,
              twitter: twitterHandle,
              linkedin: linkedinHandle,
              website: websiteUrl,
            },
            verificationDocuments: {
              idType,
              idNumber,
            },
          }),
        }
      );

      if (response.ok) {
        setLastSaved(new Date());
        if (!silent) {
          await loadProviderProfile();
          toast.success('Verification information updated successfully');
        }
      } else {
        const error = await response.text();
        if (!silent) toast.error(error || 'Failed to update verification information');
      }
    } catch (error) {
      console.error('Error updating verification info:', error);
      if (!silent) toast.error('Failed to update verification information');
    } finally {
      setSavingVerification(false);
      setAutoSaving(false);
    }
  };

  // Auto-save debounced function
  const debouncedAutoSave = useCallback(() => {
    const timer = setTimeout(() => {
      handleSaveVerification(true);
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timer);
  }, [fullName, email, bvn, nin, cacNumber, businessAddress, businessCategory, yearsInBusiness, registrationDate, instagramHandle, facebookHandle, twitterHandle, linkedinHandle, websiteUrl, idType, idNumber]);

  // Trigger auto-save when verification fields change
  useEffect(() => {
    if (provider && user) {
      const cleanup = debouncedAutoSave();
      return cleanup;
    }
  }, [fullName, email, bvn, nin, cacNumber, businessAddress, businessCategory, yearsInBusiness, registrationDate, instagramHandle, facebookHandle, twitterHandle, linkedinHandle, websiteUrl, idType, idNumber]);

  const handleChangePassword = async () => {
    if (!user) return;

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setChangingPassword(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-bb3bbc22/change-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            userId: user.id,
            currentPassword,
            newPassword,
          }),
        }
      );

      if (response.ok) {
        toast.success('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const error = await response.text();
        toast.error(error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-bb3bbc22/delete-account`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ userId: user.id }),
        }
      );

      if (response.ok) {
        toast.success('Account deleted successfully');
        await signOut();
        onNavigate('home');
      } else {
        const error = await response.text();
        toast.error(error || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onNavigate('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!user || !provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">You need to be a registered provider to access this page</p>
          <Button onClick={() => onNavigate('provider-dashboard')}>Go to Provider Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-24 pb-16 transition-colors ${
      isWhiteBackground ? 'bg-white' : 'bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={onBack || (() => onNavigate('provider-dashboard'))}
          className={`flex items-center gap-2 mb-8 transition-colors ${
            isWhiteBackground
              ? 'text-foreground hover:text-primary'
              : 'text-white hover:text-secondary'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-4xl mb-2 transition-colors ${
            isWhiteBackground ? 'text-foreground' : 'text-white'
          }`}>
            Helpa Settings
          </h1>
          <p className={`text-lg transition-colors ${
            isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
          }`}>
            Manage your provider account and preferences
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Verification Status */}
          {provider.verificationStatus === 'pending' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl p-8 border-2 border-amber-200 bg-amber-50 shadow-xl"
            >
              <h2 className="text-2xl text-amber-800 mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6" />
                Verification Pending
              </h2>
              <p className="text-amber-700 mb-4">
                Your provider account is pending verification. We'll review your details and notify you once approved.
              </p>
            </motion.div>
          )}

          {provider.verificationStatus === 'verified' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl p-6 border-2 border-emerald-200 bg-emerald-50 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="text-lg text-emerald-800">Verified Provider</h3>
                  <p className="text-sm text-emerald-600">Your account is verified and active</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Business Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-3xl p-8 border shadow-xl transition-colors ${
              isWhiteBackground
                ? 'bg-white border-primary/10'
                : 'bg-white/10 backdrop-blur-xl border-white/20'
            }`}
          >
            <h2 className={`text-2xl mb-6 flex items-center gap-2 transition-colors ${
              isWhiteBackground ? 'text-foreground' : 'text-white'
            }`}>
              <Store className="w-6 h-6 text-primary" />
              Business Profile
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="businessName" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                  Business Name
                </Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="mt-1"
                  placeholder="e.g., John's Plumbing Services"
                />
              </div>

              <div>
                <Label htmlFor="bio" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-1"
                  rows={4}
                  placeholder="Tell customers about your business and experience..."
                />
                <p className={`text-xs mt-1 ${isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'}`}>
                  {bio.length}/500 characters
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="whatsappNumber" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                    WhatsApp Number
                  </Label>
                  <Input
                    id="whatsappNumber"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="mt-1"
                    placeholder="+234..."
                  />
                </div>

                <div>
                  <Label htmlFor="location" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1"
                    placeholder="e.g., Lagos, Nigeria"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="availability" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                    Availability Status
                  </Label>
                  <Select value={availability} onValueChange={(value: any) => setAvailability(value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">✅ Available</SelectItem>
                      <SelectItem value="busy">⚠️ Busy</SelectItem>
                      <SelectItem value="unavailable">❌ Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="responseTime" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                    Typical Response Time
                  </Label>
                  <Input
                    id="responseTime"
                    value={responseTime}
                    onChange={(e) => setResponseTime(e.target.value)}
                    className="mt-1"
                    placeholder="e.g., Within 1 hour"
                  />
                </div>
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90"
              >
                {savingProfile ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Profile
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Business Verification */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className={`rounded-3xl p-8 border shadow-xl transition-colors ${
              isWhiteBackground
                ? 'bg-white border-primary/10'
                : 'bg-white/10 backdrop-blur-xl border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl flex items-center gap-2 transition-colors ${
                isWhiteBackground ? 'text-foreground' : 'text-white'
              }`}>
                <BadgeCheck className="w-6 h-6 text-primary" />
                Business Verification
              </h2>
              {autoSaving && (
                <div className="flex items-center gap-2 text-sm text-primary">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Auto-saving...</span>
                </div>
              )}
              {lastSaved && !autoSaving && (
                <div className="text-sm text-muted-foreground">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </div>
              )}
            </div>

            <p className={`text-sm mb-4 ${isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'}`}>
              Complete your business verification to increase trust and get more clients. All changes are automatically saved.
            </p>

            {/* Verification Progress */}
            <div className={`p-4 rounded-xl mb-6 ${isWhiteBackground ? 'bg-emerald-50 border border-emerald-200' : 'bg-emerald-900/20 border border-emerald-500/20'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${isWhiteBackground ? 'text-emerald-800' : 'text-emerald-200'}`}>
                  Verification Progress
                </span>
                <span className={`text-sm ${isWhiteBackground ? 'text-emerald-800' : 'text-emerald-200'}`}>
                  {(() => {
                    const fields = [fullName, email, idNumber, businessAddress, businessCategory, whatsappNumber];
                    const completed = fields.filter(Boolean).length;
                    const total = fields.length;
                    return `${completed}/${total} required fields`;
                  })()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(() => {
                      const fields = [fullName, email, idNumber, businessAddress, businessCategory, whatsappNumber];
                      const completed = fields.filter(Boolean).length;
                      return (completed / fields.length) * 100;
                    })()}%` 
                  }}
                />
              </div>
            </div>

            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className={`text-lg mb-4 flex items-center gap-2 ${isWhiteBackground ? 'text-foreground' : 'text-white'}`}>
                  <User className="w-5 h-5 text-primary" />
                  Personal Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                      Full Legal Name *
                    </Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-1"
                      placeholder="Your full name as on ID"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* ID Verification */}
              <div>
                <h3 className={`text-lg mb-4 flex items-center gap-2 ${isWhiteBackground ? 'text-foreground' : 'text-white'}`}>
                  <CreditCard className="w-5 h-5 text-primary" />
                  ID Verification
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="idType" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                      ID Type *
                    </Label>
                    <Select value={idType} onValueChange={(value: any) => setIdType(value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nin">National ID (NIN)</SelectItem>
                        <SelectItem value="drivers_license">Driver's License</SelectItem>
                        <SelectItem value="passport">International Passport</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="idNumber" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                      ID Number *
                    </Label>
                    <Input
                      id="idNumber"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      className="mt-1"
                      placeholder="Enter your ID number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="nin" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                      NIN (National Identity Number)
                    </Label>
                    <Input
                      id="nin"
                      value={nin}
                      onChange={(e) => setNin(e.target.value.replace(/\D/g, '').slice(0, 11))}
                      className="mt-1"
                      placeholder="11-digit NIN"
                      maxLength={11}
                    />
                  </div>

                  <div>
                    <Label htmlFor="bvn" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                      BVN (Bank Verification Number)
                    </Label>
                    <Input
                      id="bvn"
                      value={bvn}
                      onChange={(e) => setBvn(e.target.value.replace(/\D/g, '').slice(0, 11))}
                      className="mt-1"
                      placeholder="11-digit BVN"
                      maxLength={11}
                    />
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div>
                <h3 className={`text-lg mb-4 flex items-center gap-2 ${isWhiteBackground ? 'text-foreground' : 'text-white'}`}>
                  <Building2 className="w-5 h-5 text-primary" />
                  Business Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="businessAddress" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                      Business Address *
                    </Label>
                    <Textarea
                      id="businessAddress"
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      className="mt-1"
                      rows={2}
                      placeholder="Full business address including street, city, state"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="businessCategory" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                        Business Category *
                      </Label>
                      <Select value={businessCategory} onValueChange={setBusinessCategory}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fix">YourHelpa Fix (Repairs & Maintenance)</SelectItem>
                          <SelectItem value="food">YourHelpa Food (Food Services)</SelectItem>
                          <SelectItem value="learn">YourHelpa Learn (Education & Training)</SelectItem>
                          <SelectItem value="care">YourHelpa Care (Health & Wellness)</SelectItem>
                          <SelectItem value="guide">YourHelpa Guide (Consulting & Advisory)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="yearsInBusiness" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                        Years in Business
                      </Label>
                      <Input
                        id="yearsInBusiness"
                        type="number"
                        value={yearsInBusiness}
                        onChange={(e) => setYearsInBusiness(e.target.value)}
                        className="mt-1"
                        placeholder="e.g., 5"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="registrationDate" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                        Business Registration Date
                      </Label>
                      <Input
                        id="registrationDate"
                        type="date"
                        value={registrationDate}
                        onChange={(e) => setRegistrationDate(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cacNumber" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                        CAC Registration Number (if registered)
                      </Label>
                      <Input
                        id="cacNumber"
                        value={cacNumber}
                        onChange={(e) => setCacNumber(e.target.value.toUpperCase())}
                        className="mt-1"
                        placeholder="e.g., RC123456"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media & Online Presence */}
              <div>
                <h3 className={`text-lg mb-4 flex items-center gap-2 ${isWhiteBackground ? 'text-foreground' : 'text-white'}`}>
                  <Globe className="w-5 h-5 text-primary" />
                  Social Media & Online Presence
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="instagram" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                      <Instagram className="w-4 h-4 inline mr-1" />
                      Instagram Handle
                    </Label>
                    <div className="flex mt-1">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">@</span>
                      <Input
                        id="instagram"
                        value={instagramHandle}
                        onChange={(e) => setInstagramHandle(e.target.value.replace('@', ''))}
                        className="rounded-l-none"
                        placeholder="yourbusiness"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="facebook" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                      <Facebook className="w-4 h-4 inline mr-1" />
                      Facebook Page
                    </Label>
                    <Input
                      id="facebook"
                      value={facebookHandle}
                      onChange={(e) => setFacebookHandle(e.target.value)}
                      className="mt-1"
                      placeholder="facebook.com/yourpage"
                    />
                  </div>

                  <div>
                    <Label htmlFor="twitter" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                      <Twitter className="w-4 h-4 inline mr-1" />
                      Twitter/X Handle
                    </Label>
                    <div className="flex mt-1">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">@</span>
                      <Input
                        id="twitter"
                        value={twitterHandle}
                        onChange={(e) => setTwitterHandle(e.target.value.replace('@', ''))}
                        className="rounded-l-none"
                        placeholder="yourbusiness"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="linkedin" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                      <Linkedin className="w-4 h-4 inline mr-1" />
                      LinkedIn Profile
                    </Label>
                    <Input
                      id="linkedin"
                      value={linkedinHandle}
                      onChange={(e) => setLinkedinHandle(e.target.value)}
                      className="mt-1"
                      placeholder="linkedin.com/in/yourprofile"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="website" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                      <Globe className="w-4 h-4 inline mr-1" />
                      Website URL
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="mt-1"
                      placeholder="https://yourbusiness.com"
                    />
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl ${isWhiteBackground ? 'bg-blue-50 border border-blue-200' : 'bg-blue-900/20 border border-blue-500/20'}`}>
                <p className={`text-sm ${isWhiteBackground ? 'text-blue-800' : 'text-blue-200'}`}>
                  ✅ All changes are automatically saved as you type. Fields marked with * are required for verification approval.
                </p>
              </div>

              <Button
                onClick={() => handleSaveVerification(false)}
                disabled={savingVerification}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90"
              >
                {savingVerification ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Verification Details
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Payment Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`rounded-3xl p-8 border shadow-xl transition-colors ${
              isWhiteBackground
                ? 'bg-white border-primary/10'
                : 'bg-white/10 backdrop-blur-xl border-white/20'
            }`}
          >
            <h2 className={`text-2xl mb-6 flex items-center gap-2 transition-colors ${
              isWhiteBackground ? 'text-foreground' : 'text-white'
            }`}>
              <DollarSign className="w-6 h-6 text-primary" />
              Payment Information
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="bankName" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                  Bank Name
                </Label>
                <Input
                  id="bankName"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="mt-1"
                  placeholder="e.g., GTBank, Access Bank"
                />
              </div>

              <div>
                <Label htmlFor="accountNumber" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                  Account Number
                </Label>
                <Input
                  id="accountNumber"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="mt-1"
                  placeholder="10-digit account number"
                  maxLength={10}
                />
              </div>

              <div>
                <Label htmlFor="accountName" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                  Account Name
                </Label>
                <Input
                  id="accountName"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="mt-1"
                  placeholder="As it appears on your bank account"
                />
              </div>

              <div className={`p-4 rounded-xl ${isWhiteBackground ? 'bg-blue-50 border border-blue-200' : 'bg-blue-900/20 border border-blue-500/20'}`}>
                <p className={`text-sm ${isWhiteBackground ? 'text-blue-800' : 'text-blue-200'}`}>
                  💡 Your payment information is securely stored and will be used to transfer your earnings.
                </p>
              </div>

              <Button
                onClick={handleSavePayment}
                disabled={savingPayment}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90"
              >
                {savingPayment ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Payment Info
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Password Change */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`rounded-3xl p-8 border shadow-xl transition-colors ${
              isWhiteBackground
                ? 'bg-white border-primary/10'
                : 'bg-white/10 backdrop-blur-xl border-white/20'
            }`}
          >
            <h2 className={`text-2xl mb-6 flex items-center gap-2 transition-colors ${
              isWhiteBackground ? 'text-foreground' : 'text-white'
            }`}>
              <Lock className="w-6 h-6 text-primary" />
              Change Password
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="currentPassword" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                  Current Password
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="newPassword" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1"
                />
              </div>

              <Button
                onClick={handleChangePassword}
                disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90"
              >
                {changingPassword ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Changing...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Change Password
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`rounded-3xl p-8 border shadow-xl transition-colors ${
              isWhiteBackground
                ? 'bg-white border-primary/10'
                : 'bg-white/10 backdrop-blur-xl border-white/20'
            }`}
          >
            <h2 className={`text-2xl mb-6 flex items-center gap-2 transition-colors ${
              isWhiteBackground ? 'text-foreground' : 'text-white'
            }`}>
              {isWhiteBackground ? (
                <Sun className="w-6 h-6 text-primary" />
              ) : (
                <Moon className="w-6 h-6 text-primary" />
              )}
              Appearance
            </h2>

            <div className="flex items-center justify-between">
              <div>
                <p className={`transition-colors ${
                  isWhiteBackground ? 'text-foreground' : 'text-white'
                }`}>
                  Theme Mode
                </p>
                <p className={`text-sm transition-colors ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                }`}>
                  {isWhiteBackground ? 'Light mode' : 'Dark mode'}
                </p>
              </div>
              <Switch
                checked={!isWhiteBackground}
                onCheckedChange={(checked) => setIsWhiteBackground(!checked)}
              />
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-3xl p-8 border-2 border-red-200 bg-red-50 shadow-xl"
          >
            <h2 className="text-2xl text-red-800 mb-6 flex items-center gap-2">
              <Trash2 className="w-6 h-6" />
              Danger Zone
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg text-red-800 mb-2">Delete Provider Account</h3>
                <p className="text-red-700 text-sm mb-4">
                  Once you delete your provider account, there is no going back. This will remove all your services, earnings history, and ratings. Please be certain.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Provider Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your provider account,
                        all your services, and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Yes, delete my account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg text-red-800 mb-2">Sign Out</h3>
                <p className="text-red-700 text-sm mb-4">
                  Sign out of your provider account on this device.
                </p>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="border-red-300 text-red-800 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
