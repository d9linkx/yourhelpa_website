// File: /components/ProviderDashboard.tsx (Clean Modern Professional Design)

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
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
  Users,
  Activity,
  Calendar,
  MapPin,
} from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useBlogSettings } from './hooks/useBlogSettings';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

import { supabase } from '../supabaseClient';

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

  const [activeTab, setActiveTab] = useState('overview');
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    category: '',
    price: 0,
    priceType: 'fixed' as 'fixed' | 'hourly' | 'negotiable',
    availability: 'available' as 'available' | 'busy' | 'unavailable',
    location: '',
    tags: [] as string[]
  });
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState(0);


  useEffect(() => {
    console.log('ProviderDashboard useEffect:', { isAuthLoading, user: user ? 'exists' : 'null' });
    // 💡 FIX 2: Only proceed with data loading IF authentication is complete and a user exists.
    if (!isAuthLoading && user) {
      loadProviderData();
    }

    // Safety check: If auth is complete but no user, redirect to onboarding/login
    // This assumes your root component handles this redirect better, but this is a good fallback.
    if (!isAuthLoading && !user) {
        // If they landed here without a session, push them back to login/onboarding
        // If HelpaAuth calls onAuthSuccess(), the useEffect will rerun and find the user.
        console.log('No user, navigating to onboarding');
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
      console.log('Loading provider data for user:', user?.id);
      setError(null);
      setIsDataLoading(true); // Start data loading (only runs after auth is done)

      if (!user) {
        // Should not happen, but safe to check
        console.log('No user in loadProviderData');
        setIsDataLoading(false);
        return;
      }

      // Fetch provider profile from helpas table
      const { data: providerData, error: providerError } = await supabase
        .from('helpas')
        .select('*')
        .eq('user_id', user.id)
        .single();

      console.log('Provider data fetch result:', { providerData, providerError });

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
          console.log('Setting temp provider:', tempProvider);
          setProvider(tempProvider);
          setError('Profile setup incomplete. Please complete your profile in Settings.');
        } else {
          console.log('Setting new provider:', newProvider);
          setProvider(newProvider as Provider);
        }
      } else {
        // Assert type for consistent use
        console.log('Setting existing provider:', providerData);
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
      console.log('Data loading complete');

    } catch (error) {
      console.error('Error loading provider data:', error);
      setError('Error loading provider data. Please try again later.');
      setIsDataLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user || !provider) return;

    setIsSaving(true);
    setError(null);

    try {
      const profileData = {
        user_id: user.id,
        business_name: profileForm.businessName || provider!.businessName,
        whatsapp_number: profileForm.whatsappNumber || provider!.whatsappNumber,
        verification_status: provider!.verificationStatus,
        account_type: profileForm.accountType || provider!.accountType,
        bio: profileForm.bio || provider!.bio,
        total_earnings: provider!.totalEarnings,
        pending_earnings: provider!.pendingEarnings,
        completed_jobs: provider!.completedJobs,
        rating: provider!.rating,
        total_reviews: provider!.totalReviews,
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
          .eq('id', provider!.id)
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

  const handleCreateService = () => {
    setEditingService(null);
    setServiceForm({
      title: '',
      description: '',
      category: '',
      price: 0,
      priceType: 'fixed',
      availability: 'available',
      location: '',
      tags: []
    });
    setShowServiceModal(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      title: service.title,
      description: service.description,
      category: service.category,
      price: service.price,
      priceType: service.priceType,
      availability: service.availability,
      location: service.location,
      tags: service.tags
    });
    setShowServiceModal(true);
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      setServices(services.filter(s => s.id !== serviceId));
    } catch (error) {
      console.error('Error deleting service:', error);
      setError('Failed to delete service. Please try again.');
    }
  };

  const handleSaveService = async () => {
    if (!provider) return;

    try {
      const serviceData = {
        helpa_id: provider.id,
        title: serviceForm.title,
        description: serviceForm.description,
        category: serviceForm.category,
        price: serviceForm.price,
        price_type: serviceForm.priceType,
        availability: serviceForm.availability,
        location: serviceForm.location,
        tags: serviceForm.tags,
        rating: editingService?.rating || 0,
        completed_jobs: editingService?.completedJobs || 0,
        response_time: editingService?.responseTime || '1 hour'
      };

      if (editingService) {
        // Update existing service
        const { data, error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id)
          .select()
          .single();

        if (error) throw error;

        setServices(services.map(s => s.id === editingService.id ? data as Service : s));
      } else {
        // Create new service
        const { data, error } = await supabase
          .from('services')
          .insert(serviceData)
          .select()
          .single();

        if (error) throw error;

        setServices([...services, data as Service]);
      }

      setShowServiceModal(false);
      setEditingService(null);
    } catch (error) {
      console.error('Error saving service:', error);
      setError('Failed to save service. Please try again.');
    }
  };

  const handleRequestPayout = async () => {
    if (!provider || payoutAmount <= 0) return;

    try {
      // Create payout request transaction
      const { error } = await supabase
        .from('transactions')
        .insert({
          helpa_id: provider.id,
          amount: -payoutAmount, // Negative for payout
          status: 'pending',
          description: `Payout request - ₦${payoutAmount.toLocaleString()}`
        });

      if (error) throw error;

      // Update provider's pending earnings
      const { error: updateError } = await supabase
        .from('helpas')
        .update({
          pending_earnings: Math.max(0, provider.pendingEarnings - payoutAmount)
        })
        .eq('id', provider.id);

      if (updateError) throw updateError;

      // Refresh data
      loadProviderData();
      setShowPayoutModal(false);
      setPayoutAmount(0);
    } catch (error) {
      console.error('Error requesting payout:', error);
      setError('Failed to request payout. Please try again.');
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };


  // Clean Loading States
  console.log('Rendering check:', { isAuthLoading, isDataLoading, provider: provider ? 'exists' : 'null' });

  if (isAuthLoading || isDataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"
            />
          </div>

          <motion.h2
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-xl font-semibold text-gray-900 mb-2"
          >
            Loading Dashboard
          </motion.h2>

          <p className="text-gray-600">
            {isAuthLoading ? 'Authenticating...' : 'Loading your data...'}
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-red-800 text-sm">{error}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  // If no provider after loading is complete, create a temporary one to show the dashboard
  if (!provider && !isAuthLoading && !isDataLoading) {
    console.log('No provider found, creating temporary provider');
    const tempProvider: Provider = {
      id: `temp-${user?.id || 'unknown'}`,
      userId: user?.id || '',
      businessName: user?.firstName || 'New Helpa',
      whatsappNumber: user?.phone || '',
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative mb-8">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 bg-blue-600 rounded-full mx-auto flex items-center justify-center"
            >
              <Users className="w-8 h-8 text-white" />
            </motion.div>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Setting up your profile
          </h2>
          <p className="text-gray-600">
            Creating your professional dashboard...
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-red-800 text-sm">{error}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  // If still no provider, show a fallback dashboard
  if (!provider) {
    console.log('Still no provider, showing fallback');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
          <p className="text-gray-600">Loading your dashboard...</p>
          <Button onClick={() => onNavigate('helpa-onboarding')} className="mt-4">
            Go to Onboarding
          </Button>
        </div>
      </div>
    );
  }

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => onNavigate('dashboard')}
                variant="outline"
                size="sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
          <h2 className="text-2xl font-bold text-gray-900">
                  Welcome back, {provider!.businessName}
                </h2>
                <p className="text-gray-600 mt-1">
                  Here's what's happening with your services today.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  provider!.verificationStatus === 'verified' ? 'bg-green-500' :
                  provider!.verificationStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="text-sm text-gray-600 capitalize">
                  {provider!.verificationStatus}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Total Earnings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₦{provider!.totalEarnings.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+12% from last month</span>
            </div>
          </div>

          {/* Pending Earnings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Earnings</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₦{provider!.pendingEarnings.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">In escrow</p>
          </div>

          {/* Completed Jobs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Jobs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {provider!.completedJobs}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">This month</p>
          </div>

          {/* Rating */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {provider!.rating.toFixed(1)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">{provider!.totalReviews} reviews</p>
          </div>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="services">Services ({services.length})</TabsTrigger>
              <TabsTrigger value="notifications" className="relative">
                Notifications
                {unreadNotifications > 0 && (
                  <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
                    {unreadNotifications}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <Button onClick={handleCreateService}>
              <Plus className="w-4 h-4 mr-2" />
              Create New Service
            </Button>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            {/* Verification Status Banner */}
            {provider!.verificationStatus === 'pending' && (
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
                        }`}>{provider!.whatsappNumber}</p>
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
          <TabsContent value="services" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Your Services</h2>
              <Button onClick={handleCreateService}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Service
              </Button>
            </div>

            {services.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No services yet</h3>
                <p className="text-gray-600 mb-6">
                  Create your first service to start receiving requests from customers.
                </p>
                <Button onClick={handleCreateService}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Service
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">{service.title}</h3>
                        <Badge className="capitalize text-xs">{service.category}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between text-sm mb-4">
                      <span className="font-medium text-gray-900">₦{service.price.toLocaleString()}/{service.priceType}</span>
                      <Badge
                        variant={service.availability === 'available' ? 'default' : 'secondary'}
                      >
                        {service.availability}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500" />
                        {service.rating.toFixed(1)}
                      </span>
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
          <TabsContent value="transactions" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
              <Button>
                <DollarSign className="w-4 h-4 mr-2" />
                Request Payout
              </Button>
            </div>
            {transactions.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                <p className="text-gray-600">
                  You have not completed any transactions yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-base font-medium text-gray-900 mb-1">{transaction.description}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-semibold mb-1 ${
                        transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        ₦{transaction.amount.toLocaleString()}
                      </p>
                      <Badge variant="secondary" className="capitalize">
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
                      provider!.id.startsWith('temp-') ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <span className={`text-xs transition-colors ${
                      isWhiteBackground ? 'text-blue-700' : 'text-blue-300'
                    }`}>
                      {provider!.id.startsWith('temp-')
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
                        value={profileForm.businessName || provider!.businessName}
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
                        value={profileForm.whatsappNumber || provider!.whatsappNumber}
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
                      value={profileForm.bio || provider!.bio}
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
                        checked={(profileForm.accountType || provider!.accountType) === 'individual'}
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