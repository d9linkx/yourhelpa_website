import { Menu, X, MessageCircle, SunMedium, MoonStar, User, LogOut, ChevronDown, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SmileWinkIcon } from "./SmileWinkIcon";
import { useBlogSettings } from "./hooks/useBlogSettings";
import { useAuth } from "./hooks/useAuth";

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [dashboardsOpen, setDashboardsOpen] = useState(false);
  const [mobileDashboardsOpen, setMobileDashboardsOpen] = useState(false);
  const { isWhiteBackground, setIsWhiteBackground } = useBlogSettings();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    onNavigate('home');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (userMenuOpen && !target.closest('[data-user-menu]')) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [userMenuOpen]);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "services", label: "Products/Services" },
    { id: "pricing", label: "Pricing" },
    { id: "api", label: "API" },
    { id: "faqs", label: "FAQs" },
    { id: "join", label: "Become a Helpa" },
    { id: "about", label: "About" },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/98 backdrop-blur-md shadow-lg"
          : "bg-white border-b border-border"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 mx-0 lg:mx-[-20px] my-[0px]">
          {/* Logo - Left on Mobile */}
          <motion.button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-3 group relative z-10"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary via-primary to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 ring-2 ring-primary/10 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300">
              <SmileWinkIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xl text-[rgb(41,43,44)] leading-none tracking-tight">
                YourHelpa
              </span>
            </div>
          </motion.button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2 bg-muted/50 dark:bg-emerald-900 rounded-full px-2 py-2 backdrop-blur-sm dark:backdrop-blur-none border border-border/50 dark:border-emerald-700">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-5 py-2 rounded-full transition-all duration-300 relative ${
                  currentPage === item.id
                    ? "bg-white dark:bg-primary text-primary dark:text-white shadow-sm"
                    : "text-muted-foreground dark:text-emerald-100 hover:text-foreground dark:hover:text-white hover:bg-white/50 dark:hover:bg-emerald-800/50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">{item.label}</span>
                {currentPage === item.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white dark:bg-primary rounded-full shadow-sm"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
              </motion.button>
            ))}
          </nav>

          {/* Theme Toggle & CTA - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Theme Toggle Container */}
            <div className="p-2 rounded-full bg-gradient-to-br from-muted/40 to-muted/20 border border-border/40 backdrop-blur-sm">
              <motion.button
                onClick={() => setIsWhiteBackground(!isWhiteBackground)}
                className="relative w-[52px] h-[52px] rounded-full flex items-center justify-center overflow-hidden group"
                style={{
                  background: isWhiteBackground 
                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(236, 253, 245, 0.98) 100%)'
                    : 'linear-gradient(135deg, #064E3B 0%, #047857 100%)',
                  boxShadow: isWhiteBackground
                    ? '0 4px 16px rgba(6, 78, 59, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                    : '0 4px 16px rgba(16, 185, 129, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
                whileHover={{ scale: 1.08, rotate: 5 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: isWhiteBackground
                      ? 'radial-gradient(circle at 50% 0%, rgba(6, 78, 59, 0.15) 0%, transparent 70%)'
                      : 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.4) 0%, transparent 70%)'
                  }}
                />
                
                {/* Icon */}
                <AnimatePresence mode="wait">
                  {isWhiteBackground ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -180, scale: 0, opacity: 0 }}
                      animate={{ rotate: 0, scale: 1, opacity: 1 }}
                      exit={{ rotate: 180, scale: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                      className="relative"
                    >
                      <SunMedium className="w-6 h-6 text-amber-500 drop-shadow-lg" />
                      <motion.div
                        className="absolute inset-0"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <SunMedium className="w-6 h-6 text-amber-400" />
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 180, scale: 0, opacity: 0 }}
                      animate={{ rotate: 0, scale: 1, opacity: 1 }}
                      exit={{ rotate: -180, scale: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                      className="relative"
                    >
                      <MoonStar className="w-6 h-6 text-emerald-300 drop-shadow-lg" />
                      <motion.div
                        className="absolute inset-0"
                        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <MoonStar className="w-6 h-6 text-emerald-200" />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Auth Section */}
            {user ? (
              <div className="relative" data-user-menu>
                <motion.button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 bg-white hover:bg-gray-50 border border-border px-4 py-2.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
                    <span className="text-sm text-white">
                      {user.firstName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[rgb(41,43,44)]">{user.firstName}</span>
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-border overflow-hidden z-50"
                    >
                      {/* Dashboards Dropdown */}
                      <div>
                        <button
                          onClick={() => setDashboardsOpen(!dashboardsOpen)}
                          className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <LayoutDashboard className="w-4 h-4 text-primary" />
                            <span className="text-foreground">Dashboards</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${dashboardsOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <AnimatePresence>
                          {dashboardsOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden bg-muted/30"
                            >
                              <button
                                onClick={() => {
                                  setUserMenuOpen(false);
                                  setDashboardsOpen(false);
                                  onNavigate('dashboard');
                                }}
                                className="w-full flex items-center gap-3 px-4 pl-12 py-2.5 hover:bg-muted transition-colors text-left"
                              >
                                <User className="w-3.5 h-3.5 text-primary" />
                                <span className="text-sm text-foreground">My requests</span>
                              </button>
                              <button
                                onClick={() => {
                                  setUserMenuOpen(false);
                                  setDashboardsOpen(false);
                                  onNavigate('provider-dashboard');
                                }}
                                className="w-full flex items-center gap-3 px-4 pl-12 py-2.5 hover:bg-muted transition-colors text-left"
                              >
                                <MessageCircle className="w-3.5 h-3.5 text-primary" />
                                <span className="text-sm text-foreground">Helpa Dashboard</span>
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Settings */}
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onNavigate('settings');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left border-t border-border"
                      >
                        <User className="w-4 h-4 text-primary" />
                        <span className="text-foreground">Settings</span>
                      </button>

                      {/* Sign Out - Just Text */}
                      <div className="border-t border-border">
                        <button
                          onClick={handleSignOut}
                          className="w-full px-4 py-3 hover:bg-muted transition-colors text-left"
                        >
                          <span className="text-sm text-red-500 hover:text-red-600 transition-colors">Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Primary CTA - Join Waitlist */}
                <motion.button
                  onClick={() => onNavigate('waitlist-choice')}
                  className="flex items-center gap-2.5 bg-primary text-white px-6 py-2.5 rounded-full hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 group border border-primary/20"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="tracking-wide">Join Waitlist</span>
                </motion.button>

                {/* Secondary CTA - Become a Helpa (Helpa Dashboard Login) */}
                <motion.button
                  onClick={() => onNavigate('join')}
                  className="flex items-center gap-2.5 bg-white/10 border border-white/20 text-foreground px-5 py-2.5 rounded-full hover:bg-white/15 hover:border-white/40 transition-all duration-300 shadow-md hover:shadow-lg group"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-sm font-medium">Helpa Login</span>
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile: Theme Toggle + Hamburger - Right Side */}
          <div className="flex items-center gap-3 lg:hidden">
            {/* Mobile Theme Toggle Container */}
            <div className="p-1.5 rounded-full bg-gradient-to-br from-muted/40 to-muted/20 border border-border/40 backdrop-blur-sm">
              <motion.button
                onClick={() => setIsWhiteBackground(!isWhiteBackground)}
                className="relative w-[44px] h-[44px] rounded-full flex items-center justify-center overflow-hidden active:scale-95"
                style={{
                  background: isWhiteBackground 
                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(236, 253, 245, 0.98) 100%)'
                    : 'linear-gradient(135deg, #064E3B 0%, #047857 100%)',
                  boxShadow: isWhiteBackground
                    ? '0 3px 12px rgba(6, 78, 59, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                    : '0 3px 12px rgba(16, 185, 129, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
                whileTap={{ scale: 0.88, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {/* Icon */}
                <AnimatePresence mode="wait">
                  {isWhiteBackground ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -180, scale: 0, opacity: 0 }}
                      animate={{ rotate: 0, scale: 1, opacity: 1 }}
                      exit={{ rotate: 180, scale: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                      className="relative"
                    >
                      <SunMedium className="w-5 h-5 text-amber-500 drop-shadow-lg" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 180, scale: 0, opacity: 0 }}
                      animate={{ rotate: 0, scale: 1, opacity: 1 }}
                      exit={{ rotate: -180, scale: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                      className="relative"
                    >
                      <MoonStar className="w-5 h-5 text-emerald-300 drop-shadow-lg" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 hover:bg-muted rounded-xl transition-all duration-300 border border-transparent hover:border-border"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" style={{ color: '#292B2C' }} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" style={{ color: '#292B2C' }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-border/50 bg-white shadow-xl"
          >
            <nav className="px-4 py-4 space-y-1 max-h-[calc(100vh-5rem)] overflow-y-auto">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`block w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                    currentPage === item.id
                      ? "bg-white text-primary border-2 border-primary"
                      : "text-[#202124] hover:bg-muted"
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                </motion.button>
              ))}
              
              {/* Mobile Auth Section */}
              {user ? (
                <>
                  {/* Dashboards Dropdown */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.03 }}
                    className="pt-2"
                  >
                    <button
                      onClick={() => setMobileDashboardsOpen(!mobileDashboardsOpen)}
                      className="flex items-center justify-between w-full bg-muted text-[#202124] px-4 py-3 rounded-xl hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <LayoutDashboard className="w-4 h-4 text-primary" />
                        <span>Dashboards</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${mobileDashboardsOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {mobileDashboardsOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden mt-1 space-y-1"
                        >
                          <button
                            onClick={() => {
                              onNavigate('dashboard');
                              setMobileMenuOpen(false);
                              setMobileDashboardsOpen(false);
                            }}
                            className="flex items-center gap-2.5 text-[#202124] px-4 pl-10 py-2.5 rounded-xl w-full hover:bg-muted transition-colors"
                          >
                            <User className="w-4 h-4 text-primary" />
                            <span>My requests</span>
                          </button>
                          <button
                            onClick={() => {
                              onNavigate('provider-dashboard');
                              setMobileMenuOpen(false);
                              setMobileDashboardsOpen(false);
                            }}
                            className="flex items-center gap-2.5 text-[#202124] px-4 pl-10 py-2.5 rounded-xl w-full hover:bg-muted transition-colors"
                          >
                            <MessageCircle className="w-4 h-4 text-primary" />
                            <span>Helpa Dashboard</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Settings */}
                  <motion.button
                    onClick={() => {
                      onNavigate('settings');
                      setMobileMenuOpen(false);
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navItems.length + 1) * 0.03 }}
                    className="flex items-center gap-2.5 text-[#202124] px-4 py-3 rounded-xl w-full hover:bg-muted transition-colors"
                  >
                    <User className="w-4 h-4 text-primary" />
                    <span>Settings</span>
                  </motion.button>

                  {/* Sign Out */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navItems.length + 2) * 0.03 }}
                    className="pt-2"
                  >
                    <button
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                </>
              ) : (
                <motion.button
                  onClick={() => {
                    onNavigate('waitlist-choice');
                    setMobileMenuOpen(false);
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.03 }}
                  className="flex items-center justify-center gap-2 w-full bg-primary text-white px-4 py-3.5 rounded-xl hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25 mt-3"
                >
                  <span>Join Waitlist</span>
                </motion.button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}