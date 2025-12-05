import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  LogOut, 
  ShoppingBag, 
  Heart, 
  MessageCircle,
  Settings,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useBlogSettings } from './hooks/useBlogSettings';
import { Button } from './ui/button';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface UserDashboardProps {
  onNavigate: (page: string) => void;
}

export function UserDashboard({ onNavigate }: UserDashboardProps) {
  const { user, signOut, refreshUser } = useAuth();
  const { isWhiteBackground } = useBlogSettings();
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState('');
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    onNavigate('home');
  };

  const handleResendVerification = async () => {
    if (!user?.email) return;
    
    setResendingEmail(true);
    setResendError('');
    setResendSuccess(false);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-bb3bbc22/auth/resend-verification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email: user.email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setResendError(data.error || 'Failed to resend email');
      } else {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 5000);
      }
    } catch (err) {
      console.error('Resend error:', err);
      setResendError('Network error. Please try again.');
    } finally {
      setResendingEmail(false);
    }
  };

  if (!user) {
    return null;
  }

  const stats = [
    {
      label: 'Active Orders',
      value: '0',
      icon: ShoppingBag,
      color: 'from-teal-500 to-emerald-500',
    },
    {
      label: 'Completed',
      value: '0',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-green-500',
    },
    {
      label: 'Favorites',
      value: '0',
      icon: Heart,
      color: 'from-green-500 to-emerald-600',
    },
  ];

  const quickActions = [
    {
      label: 'Browse Services',
      icon: ShoppingBag,
      onClick: () => onNavigate('services'),
      color: 'bg-primary',
    },
    {
      label: 'Become a Helpa',
      icon: Settings,
      onClick: () => onNavigate('provider-dashboard'),
      color: 'bg-purple-600',
    },
    {
      label: 'Contact Support',
      icon: MessageCircle,
      onClick: () => window.open('https://wa.me/2349027231243', '_blank'),
      color: 'bg-emerald-600',
    },
    {
      label: 'View Pricing',
      icon: Clock,
      onClick: () => onNavigate('pricing'),
      color: 'bg-amber-500',
    },
  ];

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 transition-colors duration-500 ${
      isWhiteBackground 
        ? 'bg-gradient-to-br from-emerald-50 via-white to-yellow-50' 
        : 'bg-gradient-to-br from-[#064E3B] via-[#065f46] to-[#064E3B]'
    }`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className={`text-5xl md:text-6xl lg:text-7xl mb-2 transition-colors ${
            isWhiteBackground ? 'text-foreground' : 'text-white'
          }`}>
            My requests
          </h1>
          <p className={`text-lg transition-colors ${
            isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
          }`}>
            Welcome back, {user.firstName}! Manage your service requests
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4"
            >
              {/* How to Request Services */}
              <div className={`hidden md:block rounded-3xl p-6 border shadow-xl transition-colors ${
                isWhiteBackground
                  ? 'bg-white border-primary/10'
                  : 'bg-white/10 backdrop-blur-xl border-white/20'
              }`}>
                <h3 className={`text-lg mb-4 flex items-center gap-2 transition-colors ${
                  isWhiteBackground ? 'text-foreground' : 'text-white'
                }`}>
                  <MessageCircle className="w-5 h-5 text-primary" />
                  Request Services
                </h3>
                <div className="space-y-3">
                  <div className={`p-4 rounded-xl border-2 border-dashed transition-colors ${
                    isWhiteBackground ? 'border-primary/20 bg-primary/5' : 'border-white/20 bg-white/5'
                  }`}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs flex-shrink-0">
                        1
                      </div>
                      <div>
                        <p className={`text-sm mb-1 transition-colors ${
                          isWhiteBackground ? 'text-foreground' : 'text-white'
                        }`}>
                          Chat on WhatsApp
                        </p>
                        <p className={`text-xs transition-colors ${
                          isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                        }`}>
                          Send your request to +234 902 723 1243
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border-2 border-dashed transition-colors ${
                    isWhiteBackground ? 'border-primary/20 bg-primary/5' : 'border-white/20 bg-white/5'
                  }`}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs flex-shrink-0">
                        2
                      </div>
                      <div>
                        <p className={`text-sm mb-1 transition-colors ${
                          isWhiteBackground ? 'text-foreground' : 'text-white'
                        }`}>
                          Get Matched
                        </p>
                        <p className={`text-xs transition-colors ${
                          isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                        }`}>
                          We'll connect you with a verified Helpa
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border-2 border-dashed transition-colors ${
                    isWhiteBackground ? 'border-primary/20 bg-primary/5' : 'border-white/20 bg-white/5'
                  }`}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs flex-shrink-0">
                        3
                      </div>
                      <div>
                        <p className={`text-sm mb-1 transition-colors ${
                          isWhiteBackground ? 'text-foreground' : 'text-white'
                        }`}>
                          Track Progress
                        </p>
                        <p className={`text-xs transition-colors ${
                          isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                        }`}>
                          Get updates via WhatsApp and here
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => window.open('https://wa.me/2349027231243?text=Hi%20YourHelpa!%20I%20need%20help%20with', '_blank')}
                  className="w-full mt-4 bg-primary hover:bg-primary/90"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Chat
                </Button>
              </div>

              {/* Request Status */}
              <div className={`rounded-3xl p-6 border shadow-xl transition-colors ${
                isWhiteBackground
                  ? 'bg-white border-primary/10'
                  : 'bg-white/10 backdrop-blur-xl border-white/20'
              }`}>
                <h3 className={`text-lg mb-4 flex items-center gap-2 transition-colors ${
                  isWhiteBackground ? 'text-foreground' : 'text-white'
                }`}>
                  <Clock className="w-5 h-5 text-primary" />
                  Request Status
                </h3>
                
                <div className="space-y-3">
                  {/* Active Requests */}
                  <div className={`p-4 rounded-xl transition-colors ${
                    isWhiteBackground ? 'bg-amber-50 border border-amber-200' : 'bg-amber-900/20 border border-amber-500/20'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm transition-colors ${
                        isWhiteBackground ? 'text-amber-800' : 'text-amber-200'
                      }`}>
                        Active Requests
                      </span>
                      <span className={`text-xl transition-colors ${
                        isWhiteBackground ? 'text-amber-900' : 'text-amber-100'
                      }`}>
                        0
                      </span>
                    </div>
                    <p className={`text-xs transition-colors ${
                      isWhiteBackground ? 'text-amber-700' : 'text-amber-300'
                    }`}>
                      Currently being processed
                    </p>
                  </div>

                  {/* Completed */}
                  <div className={`p-4 rounded-xl transition-colors ${
                    isWhiteBackground ? 'bg-emerald-50 border border-emerald-200' : 'bg-emerald-900/20 border border-emerald-500/20'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm transition-colors ${
                        isWhiteBackground ? 'text-emerald-800' : 'text-emerald-200'
                      }`}>
                        Completed
                      </span>
                      <span className={`text-xl transition-colors ${
                        isWhiteBackground ? 'text-emerald-900' : 'text-emerald-100'
                      }`}>
                        0
                      </span>
                    </div>
                    <p className={`text-xs transition-colors ${
                      isWhiteBackground ? 'text-emerald-700' : 'text-emerald-300'
                    }`}>
                      Successfully finished
                    </p>
                  </div>
                </div>

                <div className={`mt-4 p-4 rounded-xl text-center transition-colors ${
                  isWhiteBackground ? 'bg-muted/50' : 'bg-white/5'
                }`}>
                  <p className={`text-sm transition-colors ${
                    isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                  }`}>
                    No active requests yet
                  </p>
                  <p className={`text-xs mt-1 transition-colors ${
                    isWhiteBackground ? 'text-muted-foreground' : 'text-white/60'
                  }`}>
                    Start a chat to request a service
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Stats & Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className={`text-2xl mb-4 transition-colors ${
                isWhiteBackground ? 'text-foreground' : 'text-white'
              }`}>
                Your Activity
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -4 }}
                    className={`rounded-2xl p-6 border shadow-lg transition-all holographic neon-glow ${
                      isWhiteBackground
                        ? 'bg-white border-primary/10 glass-futuristic hover:bg-primary/5 hover:shadow-xl hover:shadow-primary/10 hover:scale-105'
                        : 'bg-white/10 backdrop-blur-xl border-white/20 glass-futuristic-dark hover:bg-white/20 hover:shadow-xl hover:shadow-white/10 hover:scale-105'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className={`text-3xl mb-1 transition-colors ${
                      isWhiteBackground ? 'text-foreground' : 'text-white'
                    }`}>
                      {stat.value}
                    </p>
                    <p className={`text-sm transition-colors ${
                      isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                    }`}>
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className={`text-2xl mb-4 transition-colors ${
                isWhiteBackground ? 'text-foreground' : 'text-white'
              }`}>
                Quick Actions
              </h3>

            </motion.div>

            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={`rounded-3xl p-8 border shadow-xl transition-colors ${
                isWhiteBackground
                  ? 'bg-white border-primary/10'
                  : 'bg-white/10 backdrop-blur-xl border-white/20'
              }`}
            >
              <h3 className={`text-2xl mb-4 transition-colors ${
                isWhiteBackground ? 'text-foreground' : 'text-white'
              }`}>
                Recent Orders
              </h3>
              <div className="text-center py-12">
                <ShoppingBag className={`w-16 h-16 mx-auto mb-4 ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/50'
                }`} />
                <p className={`text-lg mb-2 transition-colors ${
                  isWhiteBackground ? 'text-foreground' : 'text-white'
                }`}>
                  No orders yet
                </p>
                <p className={`mb-6 transition-colors ${
                  isWhiteBackground ? 'text-muted-foreground' : 'text-white/70'
                }`}>
                  Start exploring our services to place your first order
                </p>
                <Button
                  onClick={() => onNavigate('services')}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  Browse Services
                </Button>
              </div>
            </motion.div>

            {/* Bottom Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <Button
                onClick={() => onNavigate('join-helpa')}
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-700 text-white shadow-lg"
                size="lg"
              >
                <User className="w-5 h-5 mr-2" />
                Become a Helpa
              </Button>
              
              <button
                onClick={() => onNavigate('settings')}
                className={`flex items-center gap-2 transition-colors hover:underline ${
                  isWhiteBackground ? 'text-primary hover:text-primary/80' : 'text-white hover:text-white/80'
                }`}
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
