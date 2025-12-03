import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  User,
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
  RefreshCw
} from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useBlogSettings } from './hooks/useBlogSettings';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
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

interface SettingsPageProps {
  onNavigate: (page: string) => void;
  onBack?: () => void;
}

export function SettingsPage({ onNavigate, onBack }: SettingsPageProps) {
  const { user, signOut, refreshUser } = useAuth();
  const { isWhiteBackground, setIsWhiteBackground } = useBlogSettings();

  // Profile form state
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Email verification state
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setEmail(user.email);
      setPhone(user.phone);
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;

    setSavingProfile(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-bb3bbc22/update-profile`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            userId: user.id,
            firstName,
            email,
            phone,
          }),
        }
      );

      if (response.ok) {
        await refreshUser();
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

  const handleResendVerification = async () => {
    if (!user) return;

    setResendingEmail(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-bb3bbc22/resend-verification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email: user.email }),
        }
      );

      if (response.ok) {
        setResendSuccess(true);
        toast.success('Verification email sent! Check your inbox.');
        setTimeout(() => setResendSuccess(false), 5000);
      } else {
        const error = await response.text();
        toast.error(error || 'Failed to send verification email');
      }
    } catch (error) {
      console.error('Error resending verification:', error);
      toast.error('Failed to send verification email');
    } finally {
      setResendingEmail(false);
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Please sign in to access settings</p>
          <Button onClick={() => onNavigate('signin')}>Sign In</Button>
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
          onClick={onBack || (() => onNavigate('dashboard'))}
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
            Settings
          </h1>
          <p className={`text-lg transition-colors ${
            isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
          }`}>
            Manage your account preferences and settings
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`rounded-3xl p-8 border shadow-xl transition-colors ${
              isWhiteBackground
                ? 'bg-white border-primary/10'
                : 'bg-white/10 backdrop-blur-xl border-white/20'
            }`}
          >
            <h2 className={`text-2xl mb-6 flex items-center gap-2 transition-colors ${
              isWhiteBackground ? 'text-foreground' : 'text-white'
            }`}>
              <User className="w-6 h-6 text-primary" />
              Profile Information
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="firstName" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone" className={isWhiteBackground ? 'text-foreground' : 'text-white'}>
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1"
                />
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
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Email Verification */}
          {!user.emailVerified && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl p-8 border-2 border-amber-200 bg-amber-50 shadow-xl"
            >
              <h2 className="text-2xl text-amber-800 mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6" />
                Email Verification
              </h2>
              <p className="text-amber-700 mb-4">
                Your email is not verified. Please check your inbox and verify your email to access all features.
              </p>
              <Button
                onClick={handleResendVerification}
                disabled={resendingEmail || resendSuccess}
                variant="outline"
                className="bg-white hover:bg-amber-50 border-amber-300 text-amber-800"
              >
                {resendingEmail ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : resendSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Email Sent
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Resend Verification Email
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {/* Password Change */}
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
            transition={{ delay: 0.5 }}
            className="rounded-3xl p-8 border-2 border-red-200 bg-red-50 shadow-xl"
          >
            <h2 className="text-2xl text-red-800 mb-6 flex items-center gap-2">
              <Trash2 className="w-6 h-6" />
              Danger Zone
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg text-red-800 mb-2">Delete Account</h3>
                <p className="text-red-700 text-sm mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
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
                  Sign out of your account on this device.
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
