import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  LogOut,
  BarChart3,
  Package,
  Users,
  DollarSign,
  Star,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Home,
  MessageSquare,
  Bell,
  Search,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import { useBlogSettings } from './hooks/useBlogSettings';

interface HelpaDashboardProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  priceUnit: string;
  description: string;
  image?: string;
  active: boolean;
  completions: number;
  rating: number;
}

interface Booking {
  id: string;
  customerName: string;
  serviceName: string;
  date: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
}

export function HelpaDashboard({ onNavigate, onLogout }: HelpaDashboardProps) {
  const { isWhiteBackground } = useBlogSettings();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'services' | 'bookings' | 'earnings' | 'reviews' | 'settings'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Mock data
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'House Cleaning (3BR)',
      category: 'Cleaning Services',
      price: 15000,
      priceUnit: 'per visit',
      description: 'Professional cleaning for 3-bedroom houses',
      active: true,
      completions: 24,
      rating: 4.8
    },
    {
      id: '2',
      name: 'Plumbing Repairs',
      category: 'Plumbing',
      price: 25000,
      priceUnit: 'per job',
      description: 'Emergency plumbing and repairs',
      active: true,
      completions: 18,
      rating: 4.9
    }
  ]);

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      customerName: 'Chioma A.',
      serviceName: 'House Cleaning (3BR)',
      date: '2025-12-04',
      amount: 15000,
      status: 'completed'
    },
    {
      id: '2',
      customerName: 'Emeka O.',
      serviceName: 'Plumbing Repairs',
      date: '2025-12-05',
      amount: 25000,
      status: 'pending'
    }
  ]);

  const stats = [
    { label: 'Total Earnings', value: '₦540,000', trend: '+12% this month', icon: DollarSign, color: 'text-green-500' },
    { label: 'Active Services', value: services.filter(s => s.active).length, trend: `${services.length} total`, icon: Package, color: 'text-blue-500' },
    { label: 'Completed Bookings', value: '42', trend: '+8 this week', icon: CheckCircle, color: 'text-emerald-500' },
    { label: 'Avg. Rating', value: '4.85', trend: 'from 42 reviews', icon: Star, color: 'text-yellow-500' }
  ];

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'profile', label: 'Profile', icon: Users },
    { id: 'services', label: 'Services & Products', icon: Package },
    { id: 'bookings', label: 'Bookings', icon: Clock },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    setShowServiceForm(false);
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  const toggleServiceActive = (id: string) => {
    setServices(services.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  return (
    <div className={`flex h-screen ${isWhiteBackground ? 'bg-gray-50' : 'bg-[#0f1117]'}`}>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -320 }}
        transition={{ duration: 0.3 }}
        className={`fixed lg:relative w-80 h-full ${
          isWhiteBackground ? 'bg-white border-r border-gray-200' : 'bg-[#1a1f2e] border-r border-gray-700'
        } flex flex-col z-50 lg:z-0`}
      >
        {/* Sidebar Header */}
        <div className={`p-6 border-b ${isWhiteBackground ? 'border-gray-200' : 'border-gray-700'}`}>
          <div className="flex items-center justify-between mb-2">
            <h1 className={`text-2xl font-black ${isWhiteBackground ? 'text-gray-900' : 'text-white'}`}>
              <span className="text-green-500">Helpa</span>
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className={`text-sm ${isWhiteBackground ? 'text-gray-600' : 'text-gray-400'}`}>Provider Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as typeof activeTab);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-green-500 text-white'
                    : isWhiteBackground
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className={`p-6 border-t ${isWhiteBackground ? 'border-gray-200' : 'border-gray-700'} space-y-3`}>
          <button
            onClick={onLogout}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isWhiteBackground
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
            }`}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className={`border-b ${isWhiteBackground ? 'bg-white border-gray-200' : 'bg-[#1a1f2e] border-gray-700'} p-4 sm:p-6`}>
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1 max-w-md">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                isWhiteBackground
                  ? 'bg-gray-50 border-gray-300'
                  : 'bg-gray-800 border-gray-700'
              }`}>
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`flex-1 bg-transparent outline-none text-sm ${
                    isWhiteBackground ? 'text-gray-900' : 'text-white placeholder-gray-500'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative`}>
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold`}>
                CA
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className={`text-3xl font-black mb-2 ${isWhiteBackground ? 'text-gray-900' : 'text-white'}`}>
                    Welcome back, Chioma!
                  </h2>
                  <p className={`${isWhiteBackground ? 'text-gray-600' : 'text-gray-400'}`}>
                    Here's your business performance this month
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-6 rounded-xl border-2 ${
                          isWhiteBackground
                            ? 'bg-white border-gray-200 hover:border-green-300'
                            : 'bg-[#1a1f2e] border-gray-700 hover:border-green-500'
                        } transition-all duration-300 hover:shadow-lg`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-lg ${isWhiteBackground ? 'bg-gray-100' : 'bg-gray-800'}`}>
                            <Icon className={`w-6 h-6 ${stat.color}`} />
                          </div>
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        </div>
                        <p className={`text-sm ${isWhiteBackground ? 'text-gray-600' : 'text-gray-400'} mb-1`}>
                          {stat.label}
                        </p>
                        <p className={`text-2xl font-bold mb-2 ${isWhiteBackground ? 'text-gray-900' : 'text-white'}`}>
                          {stat.value}
                        </p>
                        <p className="text-xs text-green-500 font-medium">{stat.trend}</p>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Bookings */}
                  <div className={`rounded-xl border-2 p-6 ${
                    isWhiteBackground
                      ? 'bg-white border-gray-200'
                      : 'bg-[#1a1f2e] border-gray-700'
                  }`}>
                    <h3 className={`text-lg font-bold mb-4 ${isWhiteBackground ? 'text-gray-900' : 'text-white'}`}>
                      Recent Bookings
                    </h3>
                    <div className="space-y-3">
                      {bookings.slice(0, 3).map((booking) => (
                        <div
                          key={booking.id}
                          className={`flex items-center justify-between p-4 rounded-lg ${
                            isWhiteBackground ? 'bg-gray-50' : 'bg-gray-800'
                          }`}
                        >
                          <div>
                            <p className={`font-medium ${isWhiteBackground ? 'text-gray-900' : 'text-white'}`}>
                              {booking.customerName}
                            </p>
                            <p className={`text-sm ${isWhiteBackground ? 'text-gray-600' : 'text-gray-400'}`}>
                              {booking.serviceName}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-500">₦{booking.amount.toLocaleString()}</p>
                            <p className={`text-xs ${
                              booking.status === 'completed'
                                ? 'text-green-600'
                                : booking.status === 'pending'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Services */}
                  <div className={`rounded-xl border-2 p-6 ${
                    isWhiteBackground
                      ? 'bg-white border-gray-200'
                      : 'bg-[#1a1f2e] border-gray-700'
                  }`}>
                    <h3 className={`text-lg font-bold mb-4 ${isWhiteBackground ? 'text-gray-900' : 'text-white'}`}>
                      Top Services
                    </h3>
                    <div className="space-y-3">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          className={`flex items-center justify-between p-4 rounded-lg ${
                            isWhiteBackground ? 'bg-gray-50' : 'bg-gray-800'
                          }`}
                        >
                          <div>
                            <p className={`font-medium ${isWhiteBackground ? 'text-gray-900' : 'text-white'}`}>
                              {service.name}
                            </p>
                            <p className={`text-sm ${isWhiteBackground ? 'text-gray-600' : 'text-gray-400'}`}>
                              {service.completions} completions
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            <p className="font-bold">{service.rating}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Services & Products Tab */}
            {activeTab === 'services' && (
              <motion.div
                key="services"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className={`text-3xl font-black ${isWhiteBackground ? 'text-gray-900' : 'text-white'}`}>
                      Services & Products
                    </h2>
                    <p className={`text-sm ${isWhiteBackground ? 'text-gray-600' : 'text-gray-400'} mt-1`}>
                      Manage everything you offer
                    </p>
                  </div>
                  <button
                    onClick={() => setShowServiceForm(!showServiceForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add New</span>
                  </button>
                </div>

                {/* Add Service Form */}
                {showServiceForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-xl border-2 p-6 mb-6 ${
                      isWhiteBackground
                        ? 'bg-white border-gray-200'
                        : 'bg-[#1a1f2e] border-gray-700'
                    }`}
                  >
                    <h3 className={`text-lg font-bold mb-4 ${isWhiteBackground ? 'text-gray-900' : 'text-white'}`}>
                      Add New Service/Product
                    </h3>
                    <form onSubmit={handleAddService} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          isWhiteBackground ? 'text-gray-700' : 'text-gray-300'
                        }`}>
                          Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., House Cleaning"
                          className={`w-full px-4 py-2 rounded-lg border-2 ${
                            isWhiteBackground
                              ? 'bg-gray-50 border-gray-200 focus:border-green-500'
                              : 'bg-gray-800 border-gray-700 focus:border-green-500 text-white'
                          } outline-none transition-all`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          isWhiteBackground ? 'text-gray-700' : 'text-gray-300'
                        }`}>
                          Category
                        </label>
                        <select
                          className={`w-full px-4 py-2 rounded-lg border-2 ${
                            isWhiteBackground
                              ? 'bg-gray-50 border-gray-200 focus:border-green-500'
                              : 'bg-gray-800 border-gray-700 focus:border-green-500 text-white'
                          } outline-none transition-all`}
                        >
                          <option>Select Category</option>
                          <option>Cleaning Services</option>
                          <option>Plumbing</option>
                          <option>Electrical</option>
                        </select>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          isWhiteBackground ? 'text-gray-700' : 'text-gray-300'
                        }`}>
                          Price
                        </label>
                        <input
                          type="number"
                          placeholder="Enter price"
                          className={`w-full px-4 py-2 rounded-lg border-2 ${
                            isWhiteBackground
                              ? 'bg-gray-50 border-gray-200 focus:border-green-500'
                              : 'bg-gray-800 border-gray-700 focus:border-green-500 text-white'
                          } outline-none transition-all`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          isWhiteBackground ? 'text-gray-700' : 'text-gray-300'
                        }`}>
                          Price Unit
                        </label>
                        <select
                          className={`w-full px-4 py-2 rounded-lg border-2 ${
                            isWhiteBackground
                              ? 'bg-gray-50 border-gray-200 focus:border-green-500'
                              : 'bg-gray-800 border-gray-700 focus:border-green-500 text-white'
                          } outline-none transition-all`}
                        >
                          <option>per hour</option>
                          <option>per visit</option>
                          <option>per job</option>
                          <option>flat rate</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className={`block text-sm font-medium mb-2 ${
                          isWhiteBackground ? 'text-gray-700' : 'text-gray-300'
                        }`}>
                          Description
                        </label>
                        <textarea
                          placeholder="Describe your service/product..."
                          rows={3}
                          className={`w-full px-4 py-2 rounded-lg border-2 ${
                            isWhiteBackground
                              ? 'bg-gray-50 border-gray-200 focus:border-green-500'
                              : 'bg-gray-800 border-gray-700 focus:border-green-500 text-white'
                          } outline-none transition-all`}
                        />
                      </div>
                      <div className="sm:col-span-2 flex gap-3">
                        <button
                          type="submit"
                          className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all"
                        >
                          Save Service
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowServiceForm(false)}
                          className={`flex-1 px-4 py-2 rounded-lg font-medium border-2 transition-all ${
                            isWhiteBackground
                              ? 'border-gray-200 text-gray-700 hover:bg-gray-50'
                              : 'border-gray-700 text-gray-400 hover:bg-gray-800'
                          }`}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Services List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.map((service) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-xl border-2 p-6 ${
                        isWhiteBackground
                          ? 'bg-white border-gray-200'
                          : 'bg-[#1a1f2e] border-gray-700'
                      } hover:shadow-lg transition-all`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className={`text-lg font-bold ${isWhiteBackground ? 'text-gray-900' : 'text-white'}`}>
                            {service.name}
                          </h4>
                          <p className={`text-sm ${isWhiteBackground ? 'text-gray-600' : 'text-gray-400'}`}>
                            {service.category}
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          service.active
                            ? 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400'
                            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                          {service.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <p className={`text-sm mb-4 ${isWhiteBackground ? 'text-gray-600' : 'text-gray-400'}`}>
                        {service.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <div>
                          <p className={`text-xs ${isWhiteBackground ? 'text-gray-600' : 'text-gray-400'} mb-1`}>
                            Price
                          </p>
                          <p className="font-bold text-green-500">₦{service.price.toLocaleString()}</p>
                          <p className={`text-xs ${isWhiteBackground ? 'text-gray-600' : 'text-gray-400'}`}>
                            {service.priceUnit}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs ${isWhiteBackground ? 'text-gray-600' : 'text-gray-400'} mb-1`}>
                            Rating
                          </p>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            <p className="font-bold">{service.rating}</p>
                          </div>
                          <p className={`text-xs ${isWhiteBackground ? 'text-gray-600' : 'text-gray-400'}`}>
                            {service.completions} jobs
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleServiceActive(service.id)}
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            isWhiteBackground
                              ? 'border-2 border-gray-200 text-gray-700 hover:bg-gray-50'
                              : 'border-2 border-gray-700 text-gray-300 hover:bg-gray-800'
                          }`}
                        >
                          <Eye className="w-4 h-4" />
                          {service.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button className={`p-2 rounded-lg transition-all ${
                          isWhiteBackground
                            ? 'hover:bg-gray-100 text-gray-600'
                            : 'hover:bg-gray-800 text-gray-400'
                        }`}>
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className={`p-2 rounded-lg transition-all ${
                            isWhiteBackground
                              ? 'hover:bg-red-50 text-red-600'
                              : 'hover:bg-red-500/10 text-red-400'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <h2 className={`text-3xl font-black mb-6 ${isWhiteBackground ? 'text-gray-900' : 'text-white'}`}>
                  Profile
                </h2>
                <div className={`rounded-xl border-2 p-6 sm:p-8 ${
                  isWhiteBackground
                    ? 'bg-white border-gray-200'
                    : 'bg-[#1a1f2e] border-gray-700'
                }`}>
                  <div className="flex flex-col sm:flex-row gap-8 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                    <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-4xl font-bold flex-shrink-0`}>
                      CA
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-2xl font-bold mb-2 ${isWhiteBackground ? 'text-gray-900' : 'text-white'}`}>
                        Chioma A.
                      </h3>
                      <p className={`mb-4 ${isWhiteBackground ? 'text-gray-600' : 'text-gray-400'}`}>
                        Professional Cleaner & Housekeeper
                      </p>
                      <div className="flex gap-4 flex-wrap">
                        <div>
                          <p className={`text-xs ${isWhiteBackground ? 'text-gray-600' : 'text-gray-400'} mb-1`}>
                            Member Since
                          </p>
                          <p className={`font-bold ${isWhiteBackground ? 'text-gray-900' : 'text-white'}`}>
                            Jan 2024
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs ${isWhiteBackground ? 'text-gray-600' : 'text-gray-400'} mb-1`}>
                            Response Rate
                          </p>
                          <p className="font-bold text-green-500">98%</p>
                        </div>
                        <div>
                          <p className={`text-xs ${isWhiteBackground ? 'text-gray-600' : 'text-gray-400'} mb-1`}>
                            Verified
                          </p>
                          <p className="font-bold text-green-500">✓ Yes</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isWhiteBackground ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Chioma A."
                        className={`w-full px-4 py-2 rounded-lg border-2 ${
                          isWhiteBackground
                            ? 'bg-gray-50 border-gray-200 focus:border-green-500 text-gray-900'
                            : 'bg-gray-800 border-gray-700 focus:border-green-500 text-white'
                        } outline-none transition-all`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isWhiteBackground ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        Phone
                      </label>
                      <input
                        type="tel"
                        defaultValue="+234 901 234 5678"
                        className={`w-full px-4 py-2 rounded-lg border-2 ${
                          isWhiteBackground
                            ? 'bg-gray-50 border-gray-200 focus:border-green-500 text-gray-900'
                            : 'bg-gray-800 border-gray-700 focus:border-green-500 text-white'
                        } outline-none transition-all`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isWhiteBackground ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue="chioma@example.com"
                        className={`w-full px-4 py-2 rounded-lg border-2 ${
                          isWhiteBackground
                            ? 'bg-gray-50 border-gray-200 focus:border-green-500 text-gray-900'
                            : 'bg-gray-800 border-gray-700 focus:border-green-500 text-white'
                        } outline-none transition-all`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isWhiteBackground ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        Location
                      </label>
                      <input
                        type="text"
                        defaultValue="Lagos, Nigeria"
                        className={`w-full px-4 py-2 rounded-lg border-2 ${
                          isWhiteBackground
                            ? 'bg-gray-50 border-gray-200 focus:border-green-500 text-gray-900'
                            : 'bg-gray-800 border-gray-700 focus:border-green-500 text-white'
                        } outline-none transition-all`}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={`block text-sm font-medium mb-2 ${
                        isWhiteBackground ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        Bio
                      </label>
                      <textarea
                        defaultValue="Professional cleaning services with 5+ years of experience. Specialized in residential and office cleaning."
                        rows={4}
                        className={`w-full px-4 py-2 rounded-lg border-2 ${
                          isWhiteBackground
                            ? 'bg-gray-50 border-gray-200 focus:border-green-500 text-gray-900'
                            : 'bg-gray-800 border-gray-700 focus:border-green-500 text-white'
                        } outline-none transition-all`}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button className="flex-1 sm:flex-none px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all">
                      Save Changes
                    </button>
                    <button className={`flex-1 sm:flex-none px-6 py-2 rounded-lg font-medium border-2 transition-all ${
                      isWhiteBackground
                        ? 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        : 'border-gray-700 text-gray-400 hover:bg-gray-800'
                    }`}>
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <motion.div
                key="bookings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <h2 className={`text-3xl font-black mb-6 ${isWhiteBackground ? 'text-gray-900' : 'text-white'}`}>
                  Recent Bookings
                </h2>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className={`rounded-xl border-2 p-4 sm:p-6 ${
                        isWhiteBackground
                          ? 'bg-white border-gray-200'
                          : 'bg-[#1a1f2e] border-gray-700'
                      }`}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div>
                          <p className={`text-xs ${isWhiteBackground ? 'text-gray-600' : 'text-gray-400'} mb-1`}>
                            Customer
                          </p>
                          <p className={`font-bold ${isWhiteBackground ? 'text-gray-900' : 'text-white'}`}>
                            {booking.customerName}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs ${isWhiteBackground ? 'text-gray-600' : 'text-gray-400'} mb-1`}>
                            Service
                          </p>
                          <p className={`font-medium ${isWhiteBackground ? 'text-gray-800' : 'text-gray-200'}`}>
                            {booking.serviceName}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs ${isWhiteBackground ? 'text-gray-600' : 'text-gray-400'} mb-1`}>
                            Amount
                          </p>
                          <p className="font-bold text-green-500">₦{booking.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className={`text-xs ${isWhiteBackground ? 'text-gray-600' : 'text-gray-400'} mb-1`}>
                            Status
                          </p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'completed'
                              ? 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400'
                              : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Earnings Tab */}
            {activeTab === 'earnings' && (
              <motion.div
                key="earnings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <h2 className={`text-3xl font-black mb-6 ${isWhiteBackground ? 'text-gray-900' : 'text-white'}`}>
                  Earnings & Withdrawals
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                  <div className={`rounded-xl border-2 p-6 ${
                    isWhiteBackground ? 'bg-white border-gray-200' : 'bg-[#1a1f2e] border-gray-700'
                  }`}>
                    <p className={`text-sm ${isWhiteBackground ? 'text-gray-600' : 'text-gray-400'} mb-2`}>
                      Total Earnings
                    </p>
                    <p className="text-3xl font-bold text-green-500">₦540,000</p>
                    <p className={`text-xs mt-2 ${isWhiteBackground ? 'text-gray-600' : 'text-gray-400'}`}>
                      All time
                    </p>
                  </div>
                  <div className={`rounded-xl border-2 p-6 ${
                    isWhiteBackground ? 'bg-white border-gray-200' : 'bg-[#1a1f2e] border-gray-700'
                  }`}>
                    <p className={`text-sm ${isWhiteBackground ? 'text-gray-600' : 'text-gray-400'} mb-2`}>
                      Available Balance
                    </p>
                    <p className="text-3xl font-bold text-blue-500">₦85,000</p>
                    <button className="text-sm text-green-500 font-medium mt-2 hover:underline">
                      Withdraw →
                    </button>
                  </div>
                  <div className={`rounded-xl border-2 p-6 ${
                    isWhiteBackground ? 'bg-white border-gray-200' : 'bg-[#1a1f2e] border-gray-700'
                  }`}>
                    <p className={`text-sm ${isWhiteBackground ? 'text-gray-600' : 'text-gray-400'} mb-2`}>
                      This Month
                    </p>
                    <p className="text-3xl font-bold">₦185,000</p>
                    <p className="text-xs text-green-500 font-medium mt-2">↑ 12% from last month</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <h2 className={`text-3xl font-black mb-6 ${isWhiteBackground ? 'text-gray-900' : 'text-white'}`}>
                  Customer Reviews
                </h2>
                <div className="space-y-4">
                  {[
                    { name: 'Emeka O.', rating: 5, text: 'Excellent service! Very professional and punctual.', date: '2 days ago' },
                    { name: 'Sarah M.', rating: 4, text: 'Good work, but could be faster.', date: '1 week ago' },
                    { name: 'John D.', rating: 5, text: 'Best cleaner in Lagos! Highly recommended.', date: '2 weeks ago' }
                  ].map((review, idx) => (
                    <div
                      key={idx}
                      className={`rounded-xl border-2 p-4 sm:p-6 ${
                        isWhiteBackground
                          ? 'bg-white border-gray-200'
                          : 'bg-[#1a1f2e] border-gray-700'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className={`font-bold ${isWhiteBackground ? 'text-gray-900' : 'text-white'}`}>
                            {review.name}
                          </p>
                          <p className={`text-xs ${isWhiteBackground ? 'text-gray-600' : 'text-gray-400'}`}>
                            {review.date}
                          </p>
                        </div>
                        <div className="flex">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          ))}
                        </div>
                      </div>
                      <p className={`${isWhiteBackground ? 'text-gray-700' : 'text-gray-300'}`}>
                        {review.text}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <h2 className={`text-3xl font-black mb-6 ${isWhiteBackground ? 'text-gray-900' : 'text-white'}`}>
                  Settings
                </h2>
                <div className="space-y-6">
                  <div className={`rounded-xl border-2 p-6 ${
                    isWhiteBackground
                      ? 'bg-white border-gray-200'
                      : 'bg-[#1a1f2e] border-gray-700'
                  }`}>
                    <h3 className={`text-lg font-bold mb-4 ${isWhiteBackground ? 'text-gray-900' : 'text-white'}`}>
                      Account Settings
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className={`${isWhiteBackground ? 'text-gray-700' : 'text-gray-300'}`}>
                          Email Notifications
                        </span>
                        <input type="checkbox" defaultChecked className="w-5 h-5" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`${isWhiteBackground ? 'text-gray-700' : 'text-gray-300'}`}>
                          SMS Alerts
                        </span>
                        <input type="checkbox" defaultChecked className="w-5 h-5" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`${isWhiteBackground ? 'text-gray-700' : 'text-gray-300'}`}>
                          Marketing Emails
                        </span>
                        <input type="checkbox" className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <div className={`rounded-xl border-2 p-6 ${
                    isWhiteBackground
                      ? 'bg-white border-gray-200'
                      : 'bg-[#1a1f2e] border-gray-700'
                  }`}>
                    <h3 className={`text-lg font-bold mb-4 ${isWhiteBackground ? 'text-gray-900' : 'text-white'}`}>
                      Danger Zone
                    </h3>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all">
                      <AlertCircle className="w-4 h-4" />
                      Delete Account
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}
    </div>
  );
}
