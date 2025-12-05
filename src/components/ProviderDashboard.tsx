// File: /components/ProviderDashboard.tsx (FIXED)

import { useState, useEffect } from 'react';
// Changed 'motion/react' to 'framer-motion' for standard use
import { motion } from 'framer-motion'; 
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
} from 'lucide-react';
// The import is correct
import { useAuth } from './hooks/useAuth'; 
import { useBlogSettings } from './hooks/useBlogSettings';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom'; // Assuming you use React Router

// --- Interface Definitions ---
interface ProviderDashboardProps {
  onNavigate: (page: string) => void;
}
interface Provider {
  id: string; // Added ID for clarity
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
  // 💡 FIX 1: Correctly destructure the 'loading' state from useAuth, aliased as isAuthLoading
  const { user, loading: isAuthLoading } = useAuth();
  const { isWhiteBackground } = useBlogSettings();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [provider, setProvider] = useState<Provider | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState(false); // Renamed: Only controls data fetching
  const [error, setError] = useState<string | null>(null);


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
          setError('Failed to create provider profile. Please try again.');
          setProvider(null);
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


  // 💡 FIX 3: Prioritize the AUTH loading state before anything else
  if (isAuthLoading || isDataLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
        isWhiteBackground 
          ? 'bg-gradient-to-br from-emerald-50 via-white to-yellow-50' 
          : 'bg-gradient-to-br from-[#064E3B] via-[#065f46] to-[#064E3B]'
      }`}>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={`transition-colors ${isWhiteBackground ? 'text-gray-600' : 'text-white'}`}>
            {/* Show appropriate message based on what's loading */}
            {isAuthLoading ? 'Verifying identity...' : 'Loading your provider dashboard...'}
          </p>
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </motion.div>
      </div>
    );
  }

  // Show loading/error state while data is being fetched or created
  if (!provider) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
        isWhiteBackground
          ? 'bg-gradient-to-br from-emerald-50 via-white to-yellow-50'
          : 'bg-gradient-to-br from-[#064E3B] via-[#065f46] to-[#064E3B]'
      }`}>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={`transition-colors ${isWhiteBackground ? 'text-gray-600' : 'text-white'}`}>
            Setting up your Helpa dashboard...
          </p>
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </motion.div>
      </div>
    );
  }

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${
      isWhiteBackground 
        ? 'bg-gradient-to-br from-emerald-50 via-white to-yellow-50' 
        : 'bg-gradient-to-br from-[#064E3B] via-[#065f46] to-[#064E3B]'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className={`text-5xl md:text-6xl lg:text-7xl mb-2 transition-colors ${
                isWhiteBackground ? 'text-foreground' : 'text-white'
              }`}>
                Helpa Dashboard
              </h1>
              <p className={`text-base sm:text-lg transition-colors ${
                isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
              }`}>
                {provider.businessName}
              </p>
            </div>
            <Button
              onClick={() => onNavigate('dashboard')}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My requests
            </Button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          <div className={`rounded-2xl p-5 sm:p-6 border shadow-lg transition-all ${
            isWhiteBackground
              ? 'bg-white border-primary/10'
              : 'bg-white/10 backdrop-blur-xl border-white/20'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <Badge variant="outline" className={`text-xs ${
                isWhiteBackground 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-emerald-900/30 text-emerald-300 border-emerald-500/30'
              }`}>
                <TrendingUp className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
            <p className={`text-sm mb-1 transition-colors ${
              isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
            }`}>Total Earnings</p>
            <p className={`text-2xl sm:text-3xl transition-colors ${
              isWhiteBackground ? 'text-foreground' : 'text-white'
            }`}>₦{provider.totalEarnings.toLocaleString()}</p>
          </div>

          <div className={`rounded-2xl p-5 sm:p-6 border shadow-lg transition-all ${
            isWhiteBackground
              ? 'bg-white border-primary/10'
              : 'bg-white/10 backdrop-blur-xl border-white/20'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lime-500 to-green-500 flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className={`text-sm mb-1 transition-colors ${
              isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
            }`}>Pending (Escrow)</p>
            <p className={`text-2xl sm:text-3xl transition-colors ${
              isWhiteBackground ? 'text-foreground' : 'text-white'
            }`}>₦{provider.pendingEarnings.toLocaleString()}</p>
          </div>

          <div className={`rounded-2xl p-5 sm:p-6 border shadow-lg transition-all ${
            isWhiteBackground
              ? 'bg-white border-primary/10'
              : 'bg-white/10 backdrop-blur-xl border-white/20'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className={`text-sm mb-1 transition-colors ${
              isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
            }`}>Completed Jobs</p>
            <p className={`text-2xl sm:text-3xl transition-colors ${
              isWhiteBackground ? 'text-foreground' : 'text-white'
            }`}>{provider.completedJobs}</p>
          </div>

          <div className={`rounded-2xl p-5 sm:p-6 border shadow-lg transition-all ${
            isWhiteBackground
              ? 'bg-white border-primary/10'
              : 'bg-white/10 backdrop-blur-xl border-white/20'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className={`text-sm mb-1 transition-colors ${
              isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
            }`}>Rating</p>
            <p className={`text-2xl sm:text-3xl transition-colors ${
              isWhiteBackground ? 'text-foreground' : 'text-white'
            }`}>{provider.rating.toFixed(1)}</p>
            <p className={`text-xs transition-colors ${
              isWhiteBackground ? 'text-muted-foreground' : 'text-white/60'
            }`}>{provider.totalReviews} reviews</p>
          </div>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-1 h-auto p-1.5 sm:p-1">
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

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
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
            <h2 className={`text-xl sm:text-2xl mb-4 sm:mb-6 transition-colors ${
              isWhiteBackground ? 'text-foreground' : 'text-white'
            }`}>Transaction History</h2>
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
          
          {/* Settings Tab (Placeholder) */}
          <TabsContent value="settings">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-3xl p-8 sm:p-12 text-center border shadow-xl transition-colors ${
                isWhiteBackground
                  ? 'bg-white border-primary/10'
                  : 'bg-white/10 backdrop-blur-xl border-white/20'
              }`}
            >
              <Settings className={`w-16 h-16 mx-auto mb-4 ${
                isWhiteBackground ? 'text-primary' : 'text-white'
              }`} />
              <h3 className={`text-lg sm:text-xl mb-2 transition-colors ${
                isWhiteBackground ? 'text-foreground' : 'text-white'
              }`}>Account Settings</h3>
              <p className={`text-sm sm:text-base mb-6 transition-colors ${
                isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
              }`}>
                Manage your profile, payout settings, and notification preferences.
              </p>
              <Button onClick={() => console.log('Go to settings')} className="w-full sm:w-auto">
                <Settings className="w-4 h-4 mr-2" />
                Configure Profile
              </Button>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}