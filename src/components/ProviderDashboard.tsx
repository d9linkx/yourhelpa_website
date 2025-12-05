// File: /components/ProviderDashboard.tsx (CYBERPUNK REDESIGN)

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  Plus,
  DollarSign,
  TrendingUp,
  Bell,
  Settings,
  Package,
  Star,
  ArrowLeft,
  MessageSquare,
  Phone,
  Clock,
  CheckCircle,
  BarChart3,
  Edit,
  Trash2,
  Zap,
  Shield,
  Users,
  Activity,
  Menu,
  X,
  ChevronRight,
  Wifi,
  Target,
  Award,
  Calendar,
  MapPin,
} from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useBlogSettings } from './hooks/useBlogSettings';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

// --- Interface Definitions ---
interface ProviderDashboardProps {
  onNavigate: (page: string) => void;
}
interface Provider {
  id: string;
  userId: string;
  businessName: string;
  whatsappNumber: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  accountType: 'individual' | 'business';
  bio: string;
  totalEarnings: number;
  pendingEarnings: number;
  completedJobs: number;
  rating: number;
  totalReviews: number;
}
interface Service { id: string; category: string; title: string; description: string; price: number; priceType: 'fixed' | 'hourly' | 'negotiable'; availability: 'available' | 'busy' | 'unavailable'; rating: number; completedJobs: number; responseTime: string; location: string; tags: string[]; }
interface Notification { id: string; type: string; title: string; message: string; read: boolean; createdAt: string; }
interface Transaction { id: string; amount: number; status: string; description: string; createdAt: string; }
// -----------------------------


export function ProviderDashboard({ onNavigate }: ProviderDashboardProps) {
  const { user, loading: isAuthLoading } = useAuth();
  const { isWhiteBackground } = useBlogSettings();
  const navigate = useNavigate();

  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    businessName: '',
    whatsappNumber: '',
    bio: '',
    accountType: 'individual' as 'individual' | 'business'
  });


  useEffect(() => {
    // 💡 FIX 2: Only proceed with data loading IF authentication is complete and a user exists.
    if (!isAuthLoading && user) {
      loadProviderData();
    } 
    
    // Safety check: If auth is complete but no user, redirect to onboarding/login
    // This assumes your root component handles this redirect better, but this is a good fallback.
    if (!isAuthLoading && !user) {
        // If they landed here without a session, push them back to login/onboarding
        // If HelpaAuth calls onAuthSuccess(), the useEffect will rerun and find the user.
        onNavigate('helpa-onboarding');
    }
  }, [user, isAuthLoading, onNavigate]);

  // Helper for fetch with timeout
  const fetchWithTimeout = (url: string, options: any = {}, timeout = 8000) => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), timeout))
    ]);
  };

  const loadProviderData = async () => {
    try {
      setError(null);
      setIsDataLoading(true); // Start data loading (only runs after auth is done)
      
      if (!user) {
        // Should not happen, but safe to check
        setIsDataLoading(false);
        return;
      }
      
      // Fetch provider profile from helpas table
      const { data: providerData, error: providerError } = await supabase
        .from('helpas')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (providerError || !providerData) {
        // Auto-create a basic provider profile if none exists
        console.log('No provider profile found, creating one...');
        const { data: newProvider, error: createError } = await supabase
          .from('helpas')
          .insert({
            user_id: user.id,
            business_name: user.firstName || 'New Helpa',
            whatsapp_number: user.phone || '',
            verification_status: 'pending',
            account_type: 'individual',
            bio: '',
            total_earnings: 0,
            pending_earnings: 0,
            completed_jobs: 0,
            rating: 0,
            total_reviews: 0,
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating provider profile:', createError);
          // Create a temporary provider object for immediate dashboard access
          const tempProvider: Provider = {
            id: `temp-${user.id}`,
            userId: user.id,
            businessName: user.firstName || 'New Helpa',
            whatsappNumber: user.phone || '',
            verificationStatus: 'pending',
            accountType: 'individual',
            bio: '',
            totalEarnings: 0,
            pendingEarnings: 0,
            completedJobs: 0,
            rating: 0,
            totalReviews: 0,
          };
          setProvider(tempProvider);
          setError('Profile setup incomplete. Please complete your profile in Settings.');
        } else {
          setProvider(newProvider as Provider);
        }
      } else {
        // Assert type for consistent use
        setProvider(providerData as Provider); 
        
        // Fetch remaining data
        const [servicesResult, notificationsResult, transactionsResult] = await Promise.all([
            supabase.from('services').select('*').eq('helpa_id', (providerData as Provider).id),
            supabase.from('notifications').select('*').eq('recipient_id', (providerData as Provider).id),
            supabase.from('transactions').select('*').eq('helpa_id', (providerData as Provider).id),
        ]);

        setServices(servicesResult.data || []);
        setNotifications(notificationsResult.data || []);
        setTransactions(transactionsResult.data || []);
        setAnalytics(null); 
      }
      setIsDataLoading(false);

    } catch (error) {
      setError('Error loading provider data. Please try again later.');
      setIsDataLoading(false);
      console.error('Error loading provider data:', error);
    }
  };

  const saveProfile = async () => {
    if (!user || !provider) return;

    setIsSaving(true);
    setError(null);

    try {
      const profileData = {
        user_id: user.id,
        business_name: profileForm.businessName || provider.businessName,
        whatsapp_number: profileForm.whatsappNumber || provider.whatsappNumber,
        verification_status: provider.verificationStatus,
        account_type: profileForm.accountType || provider.accountType,
        bio: profileForm.bio || provider.bio,
        total_earnings: provider.totalEarnings,
        pending_earnings: provider.pendingEarnings,
        completed_jobs: provider.completedJobs,
        rating: provider.rating,
        total_reviews: provider.totalReviews,
      };

      if (provider.id.startsWith('temp-')) {
        // Create new profile
        const { data: newProvider, error: createError } = await supabase
          .from('helpas')
          .insert(profileData)
          .select()
          .single();

        if (createError) {
          throw createError;
        }

        setProvider(newProvider as Provider);
        setError(null);
      } else {
        // Update existing profile
        const { data: updatedProvider, error: updateError } = await supabase
          .from('helpas')
          .update(profileData)
          .eq('id', provider.id)
          .select()
          .single();

        if (updateError) {
          throw updateError;
        }

        setProvider(updatedProvider as Provider);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };


  // Cyberpunk Loading States
  if (isAuthLoading || isDataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            {/* Cyberpunk Loading Animation */}
            <div className="relative mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border border-purple-400 border-t-transparent rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
            </div>

            <motion.h2
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-2xl font-mono text-cyan-400 mb-2 tracking-wider"
            >
              INITIALIZING NEURAL LINK
            </motion.h2>

            <p className="text-purple-300 font-mono text-sm">
              {isAuthLoading ? 'AUTHENTICATING USER...' : 'LOADING CYBERSPACE DATA...'}
            </p>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-900/50 border border-red-500 rounded-lg backdrop-blur-sm"
              >
                <p className="text-red-300 text-sm font-mono">{error}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="relative mb-8">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full mx-auto flex items-center justify-center shadow-2xl shadow-purple-500/50"
              >
                <Shield className="w-8 h-8 text-white" />
              </motion.div>
            </div>

            <h2 className="text-2xl font-mono text-purple-400 mb-2 tracking-wider">
              DEPLOYING CYBER PROFILE
            </h2>
            <p className="text-cyan-300 font-mono text-sm">
              Setting up your digital identity...
            </p>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-900/50 border border-red-500 rounded-lg backdrop-blur-sm"
              >
                <p className="text-red-300 text-sm font-mono">{error}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.6, 0.2, 0.6],
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Mobile Menu Toggle */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <Button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-slate-800/80 backdrop-blur-sm border border-cyan-500/30 hover:bg-slate-700/80"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        <div className="flex">
          {/* Sidebar Navigation */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                className="fixed lg:relative lg:translate-x-0 z-40 w-80 h-screen bg-slate-900/95 backdrop-blur-xl border-r border-cyan-500/30"
              >
                <div className="p-6">
                  {/* Profile Header */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                  >
                    <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl shadow-cyan-500/50">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-xl font-mono text-cyan-400 tracking-wider">
                      {provider.businessName}
                    </h2>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <div className={`w-2 h-2 rounded-full ${
                        provider.verificationStatus === 'verified' ? 'bg-green-400' :
                        provider.verificationStatus === 'pending' ? 'bg-yellow-400' : 'bg-red-400'
                      }`} />
                      <span className="text-xs text-purple-300 font-mono capitalize">
                        {provider.verificationStatus}
                      </span>
                    </div>
                  </motion.div>

                  {/* Navigation Menu */}
                  <nav className="space-y-2">
                    {[
                      { id: 'dashboard', label: 'Dashboard', icon: Activity, count: null },
                      { id: 'services', label: 'Services', icon: Package, count: services.length },
                      { id: 'notifications', label: 'Notifications', icon: Bell, count: unreadNotifications },
                      { id: 'transactions', label: 'Transactions', icon: DollarSign, count: null },
                      { id: 'settings', label: 'Settings', icon: Settings, count: null },
                    ].map((item) => (
                      <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setActiveView(item.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          activeView === item.id
                            ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                            : 'text-purple-300 hover:bg-slate-800/50 hover:text-cyan-400'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-mono text-sm">{item.label}</span>
                        {item.count !== null && item.count > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {item.count}
                          </span>
                        )}
                      </motion.button>
                    ))}
                  </nav>

                  {/* Back Button */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 pt-6 border-t border-slate-700"
                  >
                    <Button
                      onClick={() => onNavigate('dashboard')}
                      variant="outline"
                      className="w-full bg-slate-800/50 border-purple-500/30 hover:bg-slate-700/50 text-purple-300"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Requests
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 lg:ml-0">
            <div className="p-6 lg:p-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-4xl lg:text-6xl font-mono text-cyan-400 tracking-wider mb-2">
                      CYBER DASHBOARD
                    </h1>
                    <p className="text-purple-300 font-mono text-sm">
                      Neural Interface Active • System Online
                    </p>
                  </div>
                  <div className="hidden lg:flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-cyan-400 font-mono text-sm">STATUS</div>
                      <div className="text-green-400 font-mono text-xs">OPERATIONAL</div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Cyberpunk Stats Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              >
                {/* Total Earnings */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-slate-800/50 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-6 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/50">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-xs text-green-400 font-mono">ACTIVE</span>
                      </div>
                    </div>
                    <p className="text-purple-300 font-mono text-sm mb-2">TOTAL EARNINGS</p>
                    <p className="text-3xl font-mono text-cyan-400 font-bold">
                      ₦{provider.totalEarnings.toLocaleString()}
                    </p>
                  </div>
                </motion.div>

                {/* Pending Earnings */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-slate-800/50 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/50">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-purple-300 font-mono text-sm mb-2">PENDING (ESCROW)</p>
                    <p className="text-3xl font-mono text-yellow-400 font-bold">
                      ₦{provider.pendingEarnings.toLocaleString()}
                    </p>
                  </div>
                </motion.div>

                {/* Completed Jobs */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-slate-800/50 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-purple-300 font-mono text-sm mb-2">COMPLETED JOBS</p>
                    <p className="text-3xl font-mono text-blue-400 font-bold">
                      {provider.completedJobs}
                    </p>
                  </div>
                </motion.div>

                {/* Rating */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-slate-800/50 backdrop-blur-xl border border-pink-500/30 rounded-xl p-6 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-pink-500/50">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-purple-300 font-mono text-sm mb-2">RATING</p>
                    <p className="text-3xl font-mono text-pink-400 font-bold">
                      {provider.rating.toFixed(1)}
                    </p>
                    <p className="text-xs text-purple-300 font-mono mt-1">
                      {provider.totalReviews} REVIEWS
                    </p>
                  </div>
                </motion.div>
              </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-1 h-auto p-1.5 sm:p-1">
              <TabsTrigger value="overview" className="text-sm sm:text-sm py-2.5 sm:py-2 px-3 sm:px-4 rounded-lg sm:rounded-md">
                Overview
              </TabsTrigger>
              <TabsTrigger value="services" className="text-sm sm:text-sm py-2.5 sm:py-2 px-3 sm:px-4 rounded-lg sm:rounded-md">
                Services ({services.length})
              </TabsTrigger>
              <TabsTrigger value="notifications" className="text-sm sm:text-sm py-2.5 sm:py-2 px-3 sm:px-4 rounded-lg sm:rounded-md relative">
                Notifications
                {unreadNotifications > 0 && (
                  <Badge variant="destructive" className="ml-1 sm:ml-2 px-1.5 py-0.5 text-[10px] absolute -top-1 -right-1 sm:relative sm:top-0 sm:right-0">
                    {unreadNotifications}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="transactions" className="text-sm sm:text-sm py-2.5 sm:py-2 px-3 sm:px-4 rounded-lg sm:rounded-md">
                Transactions
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-sm sm:text-sm py-2.5 sm:py-2 px-3 sm:px-4 rounded-lg sm:rounded-md col-span-2 lg:col-span-1">
                Settings
              </TabsTrigger>
            </TabsList>
            <Button className="w-full sm:w-auto" onClick={() => setActiveTab('services')}>
              <Plus className="w-4 h-4 mr-2" />
              Create New Service
            </Button>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            {/* Verification Status Banner */}
            {provider.verificationStatus === 'pending' && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border shadow-lg transition-colors ${
                  isWhiteBackground
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-yellow-900/20 border-yellow-500/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isWhiteBackground ? 'bg-yellow-100' : 'bg-yellow-800/30'
                    }`}>
                      <Clock className={`w-4 h-4 ${
                        isWhiteBackground ? 'text-yellow-600' : 'text-yellow-400'
                      }`} />
                    </div>
                    <div>
                      <p className={`font-medium transition-colors ${
                        isWhiteBackground ? 'text-yellow-900' : 'text-yellow-200'
                      }`}>
                        Verification Status: Pending Review
                      </p>
                      <p className={`text-sm transition-colors ${
                        isWhiteBackground ? 'text-yellow-700' : 'text-yellow-300'
                      }`}>
                        Complete your profile details to speed up the verification process.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab('settings')}
                    className="w-full sm:w-auto"
                  >
                    Edit Profile
                  </Button>
                </div>
              </motion.div>
            )}

            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
              {/* WhatsApp Connection Status */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`rounded-3xl p-5 sm:p-6 border shadow-xl transition-colors ${
                  isWhiteBackground
                    ? 'bg-white border-primary/10'
                    : 'bg-white/10 backdrop-blur-xl border-white/20'
                }`}
              >
                <h3 className={`text-lg sm:text-xl mb-4 flex items-center gap-2 transition-colors ${
                  isWhiteBackground ? 'text-foreground' : 'text-white'
                }`}>
                  <MessageSquare className="w-5 h-5 text-primary" />
                  WhatsApp Business
                </h3>
                <div className="space-y-4">
                  <div className={`flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${
                    isWhiteBackground 
                      ? 'bg-emerald-50 border-emerald-200' 
                      : 'bg-emerald-900/20 border-emerald-500/20'
                  }`}>
                    <div className="flex items-center gap-3">
                      <Phone className={`w-5 h-5 ${
                        isWhiteBackground ? 'text-emerald-600' : 'text-emerald-400'
                      }`} />
                      <div>
                        <p className={`text-sm transition-colors ${
                          isWhiteBackground ? 'text-emerald-900' : 'text-emerald-200'
                        }`}>Connected</p>
                        <p className={`text-xs transition-colors ${
                          isWhiteBackground ? 'text-emerald-600' : 'text-emerald-300'
                        }`}>{provider.whatsappNumber}</p>
                      </div>
                    </div>
                    <CheckCircle className={`w-5 h-5 ${
                      isWhiteBackground ? 'text-emerald-600' : 'text-emerald-400'
                    }`} />
                  </div>
                  <p className={`text-sm transition-colors ${
                    isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                  }`}>
                    Your WhatsApp Business account is connected. Customers can contact you directly through WhatsApp.
                  </p>
                  <Button variant="outline" className="w-full">
                    Update WhatsApp Number
                  </Button>
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className={`rounded-3xl p-5 sm:p-6 border shadow-xl transition-colors ${
                  isWhiteBackground
                    ? 'bg-white border-primary/10'
                    : 'bg-white/10 backdrop-blur-xl border-white/20'
                }`}
              >
                <h3 className={`text-lg sm:text-xl mb-4 flex items-center gap-2 transition-colors ${
                  isWhiteBackground ? 'text-foreground' : 'text-white'
                }`}>
                  <Bell className="w-5 h-5 text-primary" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border transition-colors ${
                        notification.read 
                          ? (isWhiteBackground ? 'bg-muted/50 border-border' : 'bg-white/5 border-white/10')
                          : (isWhiteBackground ? 'bg-blue-50 border-blue-200' : 'bg-blue-900/20 border-blue-500/20')
                      }`}
                    >
                      <p className={`text-sm mb-1 transition-colors ${
                        isWhiteBackground ? 'text-foreground' : 'text-white'
                      }`}>{notification.title}</p>
                      <p className={`text-xs transition-colors ${
                        isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                      }`}>{notification.message}</p>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <p className={`text-sm text-center py-8 transition-colors ${
                      isWhiteBackground ? 'text-muted-foreground' : 'text-white/60'
                    }`}>
                      No recent activity
                    </p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Service Performance */}
            {services.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className={`rounded-3xl p-5 sm:p-6 border shadow-xl transition-colors ${
                  isWhiteBackground
                    ? 'bg-white border-primary/10'
                    : 'bg-white/10 backdrop-blur-xl border-white/20'
                }`}
              >
                <h3 className={`text-lg sm:text-xl mb-4 flex items-center gap-2 transition-colors ${
                  isWhiteBackground ? 'text-foreground' : 'text-white'
                }`}>
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Top Performing Services
                </h3>
                <div className="space-y-4">
                  {services
                    .sort((a, b) => b.completedJobs - a.completedJobs)
                    .slice(0, 3)
                    .map((service) => (
                    <div
                      key={service.id}
                      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl transition-colors ${
                        isWhiteBackground ? 'bg-muted/50' : 'bg-white/5'
                      }`}
                    >
                      <div className="flex-1">
                        <p className={`mb-2 sm:mb-1 transition-colors ${
                          isWhiteBackground ? 'text-foreground' : 'text-white'
                        }`}>{service.title}</p>
                        <div className={`flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm transition-colors ${
                          isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                        }`}>
                          <span>₦{service.price.toLocaleString()}/{service.priceType}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{service.completedJobs} jobs</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-500" />
                            {service.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {services.length === 0 && (
                    <p className={`text-sm text-center py-8 transition-colors ${
                      isWhiteBackground ? 'text-muted-foreground' : 'text-white/60'
                    }`}>
                      No services yet. Create your first service to see performance metrics.
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Service Performance */}
            {analytics?.servicePerformance && analytics.servicePerformance.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className={`rounded-3xl p-5 sm:p-6 border shadow-xl transition-colors ${
                  isWhiteBackground
                    ? 'bg-white border-primary/10'
                    : 'bg-white/10 backdrop-blur-xl border-white/20'
                }`}
              >
                <h3 className={`text-lg sm:text-xl mb-4 flex items-center gap-2 transition-colors ${
                  isWhiteBackground ? 'text-foreground' : 'text-white'
                }`}>
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Service Performance
                </h3>
                <div className="space-y-4">
                  {analytics.servicePerformance.map((service: any) => (
                    <div 
                      key={service.serviceId} 
                      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl transition-colors ${
                        isWhiteBackground ? 'bg-muted/50' : 'bg-white/5'
                      }`}
                    >
                      <div className="flex-1">
                        <p className={`mb-2 sm:mb-1 transition-colors ${
                          isWhiteBackground ? 'text-foreground' : 'text-white'
                        }`}>{service.title}</p>
                        <div className={`flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm transition-colors ${
                          isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                        }`}>
                          <span>₦{service.earnings.toLocaleString()}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{service.jobsCompleted} jobs</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-500" />
                            {service.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
              <h2 className={`text-xl sm:text-2xl transition-colors ${
                isWhiteBackground ? 'text-foreground' : 'text-white'
              }`}>Your Services</h2>
              <Button className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add New Service
              </Button>
            </div>

            {services.length === 0 ? (
              <div className={`rounded-3xl p-8 sm:p-12 text-center border shadow-xl transition-colors ${
                isWhiteBackground
                  ? 'bg-white border-primary/10'
                  : 'bg-white/10 backdrop-blur-xl border-white/20'
              }`}>
                <Package className={`w-16 h-16 mx-auto mb-4 ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/50'
                }`} />
                <h3 className={`text-lg sm:text-xl mb-2 transition-colors ${
                  isWhiteBackground ? 'text-foreground' : 'text-white'
                }`}>No services yet</h3>
                <p className={`text-sm sm:text-base mb-6 transition-colors ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                }`}>
                  Create your first service to start receiving requests from customers.
                </p>
                <Button className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Service
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {services.map((service) => (
                  <div 
                    key={service.id} 
                    className={`rounded-3xl p-5 sm:p-6 border shadow-xl transition-colors ${
                      isWhiteBackground
                        ? 'bg-white border-primary/10'
                        : 'bg-white/10 backdrop-blur-xl border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className={`text-lg sm:text-xl mb-1 transition-colors ${
                          isWhiteBackground ? 'text-foreground' : 'text-white'
                        }`}>{service.title}</h3>
                        <Badge className="capitalize text-xs">{service.category}</Badge>
                      </div>
                      <div className="flex gap-1 sm:gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className={`mb-4 text-xs sm:text-sm line-clamp-2 transition-colors ${
                      isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                    }`}>
                      {service.description}
                    </p>
                    <div className={`flex items-center justify-between text-xs sm:text-sm mb-4 transition-colors ${
                      isWhiteBackground ? 'text-foreground' : 'text-white'
                    }`}>
                      <span>₦{service.price.toLocaleString()}/{service.priceType}</span>
                      <Badge
                        variant={service.availability === 'available' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {service.availability}
                      </Badge>
                    </div>
                    <div className={`flex items-center gap-2 sm:gap-4 text-xs sm:text-sm transition-colors ${
                      isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                    }`}>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500" />
                        {service.rating.toFixed(1)}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span>{service.completedJobs} jobs</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <h2 className={`text-xl sm:text-2xl mb-4 sm:mb-6 transition-colors ${
              isWhiteBackground ? 'text-foreground' : 'text-white'
            }`}>Notifications</h2>
            {notifications.length === 0 ? (
              <div className={`rounded-3xl p-8 sm:p-12 text-center border shadow-xl transition-colors ${
                isWhiteBackground
                  ? 'bg-white border-primary/10'
                  : 'bg-white/10 backdrop-blur-xl border-white/20'
              }`}>
                <Bell className={`w-16 h-16 mx-auto mb-4 ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/50'
                }`} />
                <h3 className={`text-lg sm:text-xl mb-2 transition-colors ${
                  isWhiteBackground ? 'text-foreground' : 'text-white'
                }`}>No notifications</h3>
                <p className={`text-sm sm:text-base transition-colors ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                }`}>
                  You're all caught up! We'll notify you when something important happens.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`rounded-2xl p-4 border shadow-lg transition-colors ${
                      !notification.read ? 'border-l-4 border-l-primary' : ''
                    } ${
                      isWhiteBackground
                        ? 'bg-white border-primary/10'
                        : 'bg-white/10 backdrop-blur-xl border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                          <p className={`text-sm sm:text-base transition-colors ${
                            !notification.read 
                              ? (isWhiteBackground ? 'text-foreground' : 'text-white')
                              : (isWhiteBackground ? 'text-muted-foreground' : 'text-white/70')
                          }`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <Badge variant="default" className="text-xs w-fit">New</Badge>
                          )}
                        </div>
                        <p className={`text-xs sm:text-sm transition-colors ${
                          isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                        }`}>{notification.message}</p>
                        <p className={`text-xs mt-2 transition-colors ${
                          isWhiteBackground ? 'text-muted-foreground' : 'text-white/60'
                        }`}>
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
              <h2 className={`text-xl sm:text-2xl transition-colors ${
                isWhiteBackground ? 'text-foreground' : 'text-white'
              }`}>Transaction History</h2>
              <Button className="w-full sm:w-auto">
                <DollarSign className="w-4 h-4 mr-2" />
                Request Payout
              </Button>
            </div>
            {transactions.length === 0 ? (
              <div className={`rounded-3xl p-8 sm:p-12 text-center border shadow-xl transition-colors ${
                isWhiteBackground
                  ? 'bg-white border-primary/10'
                  : 'bg-white/10 backdrop-blur-xl border-white/20'
              }`}>
                <DollarSign className={`w-16 h-16 mx-auto mb-4 ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/50'
                }`} />
                <h3 className={`text-lg sm:text-xl mb-2 transition-colors ${
                  isWhiteBackground ? 'text-foreground' : 'text-white'
                }`}>No transactions yet</h3>
                <p className={`text-sm sm:text-base transition-colors ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                }`}>
                  You have not completed any transactions yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className={`rounded-2xl p-4 border shadow-lg transition-colors flex items-center justify-between ${
                      isWhiteBackground
                        ? 'bg-white border-primary/10'
                        : 'bg-white/10 backdrop-blur-xl border-white/20'
                    }`}
                  >
                    <div>
                      <p className={`text-sm sm:text-base mb-1 transition-colors ${
                        isWhiteBackground ? 'text-foreground' : 'text-white'
                      }`}>{transaction.description}</p>
                      <p className={`text-xs transition-colors ${
                        isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                      }`}>
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm sm:text-base font-semibold ${
                        transaction.status === 'completed' 
                          ? (isWhiteBackground ? 'text-emerald-600' : 'text-emerald-400')
                          : (isWhiteBackground ? 'text-yellow-600' : 'text-yellow-400')
                      }`}>
                        ₦{transaction.amount.toLocaleString()}
                      </p>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-3xl p-6 sm:p-8 border shadow-xl transition-colors ${
                isWhiteBackground
                  ? 'bg-white border-primary/10'
                  : 'bg-white/10 backdrop-blur-xl border-white/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <Settings className={`w-6 h-6 ${
                  isWhiteBackground ? 'text-primary' : 'text-white'
                }`} />
                <h3 className={`text-lg sm:text-xl transition-colors ${
                  isWhiteBackground ? 'text-foreground' : 'text-white'
                }`}>Account Settings</h3>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-6">
                {/* Profile Completion Status */}
                <div className={`p-4 rounded-lg border transition-colors ${
                  isWhiteBackground
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-blue-900/20 border-blue-500/20'
                }`}>
                  <h4 className={`text-sm font-medium mb-2 transition-colors ${
                    isWhiteBackground ? 'text-blue-900' : 'text-blue-200'
                  }`}>
                    Profile Completion
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      provider.id.startsWith('temp-') ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <span className={`text-xs transition-colors ${
                      isWhiteBackground ? 'text-blue-700' : 'text-blue-300'
                    }`}>
                      {provider.id.startsWith('temp-')
                        ? 'Incomplete - Please save your profile'
                        : 'Profile saved to database'
                      }
                    </span>
                  </div>
                </div>

                {/* Business Information */}
                <div>
                  <h4 className={`text-base font-medium mb-4 transition-colors ${
                    isWhiteBackground ? 'text-foreground' : 'text-white'
                  }`}>
                    Business Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 transition-colors ${
                        isWhiteBackground ? 'text-foreground' : 'text-white'
                      }`}>
                        Business Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.businessName || provider.businessName}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, businessName: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                          isWhiteBackground
                            ? 'bg-white border-gray-300 text-foreground'
                            : 'bg-white/10 border-white/20 text-white'
                        }`}
                        placeholder="Enter your business name"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 transition-colors ${
                        isWhiteBackground ? 'text-foreground' : 'text-white'
                      }`}>
                        WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        value={profileForm.whatsappNumber || provider.whatsappNumber}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                          isWhiteBackground
                            ? 'bg-white border-gray-300 text-foreground'
                            : 'bg-white/10 border-white/20 text-white'
                        }`}
                        placeholder="+234..."
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className={`block text-sm font-medium mb-2 transition-colors ${
                      isWhiteBackground ? 'text-foreground' : 'text-white'
                    }`}>
                      Bio
                    </label>
                    <textarea
                      value={profileForm.bio || provider.bio}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                        isWhiteBackground
                          ? 'bg-white border-gray-300 text-foreground'
                          : 'bg-white/10 border-white/20 text-white'
                      }`}
                      placeholder="Tell customers about yourself and your services..."
                    />
                  </div>
                </div>

                {/* Account Type */}
                <div>
                  <h4 className={`text-base font-medium mb-4 transition-colors ${
                    isWhiteBackground ? 'text-foreground' : 'text-white'
                  }`}>
                    Account Type
                  </h4>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="accountType"
                        value="individual"
                        checked={(profileForm.accountType || provider.accountType) === 'individual'}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, accountType: e.target.value as 'individual' | 'business' }))}
                        className="mr-2"
                      />
                      <span className={`text-sm transition-colors ${
                        isWhiteBackground ? 'text-foreground' : 'text-white'
                      }`}>
                        Individual
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="accountType"
                        value="business"
                        checked={(profileForm.accountType || provider.accountType) === 'business'}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, accountType: e.target.value as 'individual' | 'business' }))}
                        className="mr-2"
                      />
                      <span className={`text-sm transition-colors ${
                        isWhiteBackground ? 'text-foreground' : 'text-white'
                      }`}>
                        Business
                      </span>
                    </label>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4 border-t border-border">
                  <Button
                    onClick={saveProfile}
                    disabled={isSaving}
                    className="px-6"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Profile'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}