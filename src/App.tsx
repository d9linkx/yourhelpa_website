import { useState, useEffect, Suspense, lazy } from "react";
import { BlogSettingsProvider } from "./components/hooks/useBlogSettings";
import { AuthProvider } from "./components/hooks/useAuth";
import { Toaster } from "./components/ui/sonner";
import { USE_MOCK_AUTH } from "./utils/mock-auth";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ScrollProgress } from "./components/ScrollProgress";
import { MockAuthBanner } from "./components/MockAuthBanner";
import { FloatingWhatsAppButton } from "./components/FloatingWhatsAppButton";
import { PageSEO } from "./components/PageSEO";

// Lazy load pages for code splitting
const HomePage = lazy(() => import("./components/HomePage").then(module => ({ default: module.HomePage })));
const ServicesPage = lazy(() => import("./components/ServicesPage").then(module => ({ default: module.ServicesPage })));
const PricingPage = lazy(() => import("./components/PricingPage").then(module => ({ default: module.PricingPage })));
const AboutPage = lazy(() => import("./components/AboutPage").then(module => ({ default: module.AboutPage })));
const APIPage = lazy(() => import("./components/APIPage").then(module => ({ default: module.APIPage })));
const FAQPage = lazy(() => import("./components/FAQPage").then(module => ({ default: module.FAQPage })));
const DiagnosticPage = lazy(() => import("./components/DiagnosticPage").then(module => ({ default: module.DiagnosticPage })));
const WaitlistPage = lazy(() => import("./components/WaitlistPage").then(module => ({ default: module.WaitlistPage })));
const WaitlistChoicePage = lazy(() => import("./components/WaitlistChoicePage").then(module => ({ default: module.WaitlistChoicePage })));

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [navigationHistory, setNavigationHistory] = useState<string[]>(["home"]);
  const [showHelpaAuthModal, setShowHelpaAuthModal] = useState(false);

  // URL path to page identifier mapping
  const pathToPage: Record<string, string> = {
    '/': 'home',
    '/services': 'services',
    '/pricing': 'pricing',
    '/become-a-helpa': 'join',
    '/about': 'about',
    '/api': 'api',
    '/frequently-asked-questions': 'faqs',
    '/signup': 'signup',
    '/signin': 'signin',
    '/helpa-dashboard': 'provider-dashboard',
    '/account-settings': 'settings',
    '/diagnostic': 'diagnostic',
    '/signup-debugger': 'signup-debugger',
    '/join-waitlist': 'waitlist-choice',
    '/join-waitlist/customer': 'waitlist-customer',
    '/join-waitlist/provider': 'waitlist-helpa',
  };

  // Page identifier to URL path mapping
  const pageToPath: Record<string, string> = {
    'home': '/',
    'services': '/services',
    'pricing': '/pricing',
    'join': '/become-a-helpa',
    'about': '/about',
    'api': '/api',
    'faqs': '/frequently-asked-questions',
    'signup': '/signup',
    'signin': '/signin',
    'dashboard': '/dashboard',

    'settings': '/account-settings',
    'diagnostic': '/diagnostic',
    'signup-debugger': '/signup-debugger',
    'waitlist-choice': '/join-waitlist',
    'waitlist-customer': '/join-waitlist/customer',
    'waitlist-helpa': '/join-waitlist/provider',
  };

  // Initialize page from current URL on mount
  useEffect(() => {
    const initializeFromUrl = () => {
      const path = window.location.pathname;
      const page = pathToPage[path] || 'home';
      setCurrentPage(page);
    };

    initializeFromUrl();

    // Handle browser back/forward
    const handlePopState = () => {
      const path = window.location.pathname;
      const page = pathToPage[path] || 'home';
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "instant" });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // No Supabase OAuth - All authentication goes through Google Sheets backend
  useEffect(() => {
    const handleAuthCallback = async () => {
      const hash = window.location.hash;
      
      // Handle Google OAuth callback
      if (hash.includes('access_token')) {
        try {
          // Store the access token
          localStorage.setItem('access_token', hash.split('access_token=')[1].split('&')[0]);
          
          // Clear the hash and redirect to dashboard
          window.history.replaceState(null, '', window.location.pathname);
          handleNavigate('dashboard');
        } catch (error) {
          console.error('Error handling OAuth callback:', error);
        }
      }
      // Handle email verification
      else if (hash.includes('type=signup') || hash.includes('type=email')) {
        handleNavigate('email-verified');
        window.history.replaceState(null, '', window.location.pathname);
      }
    };
    
    handleAuthCallback();
  }, []);

  const handleNavigate = (page: string, data?: string) => {
    // Route Become a Helpa navigation to join page
    if (page === "join") {
      setCurrentPage('join');
      window.history.pushState(null, '', '/become-a-helpa');
      return;
    }
    // Prevent navigating to the same page
    if (page === currentPage && !data) return;

    if (page !== currentPage) {
      setCurrentPage(page);
      const url = pageToPath[page] || '/';
      window.history.pushState(null, '', url);
      // Add to history (except for certain flow pages)
      const noHistoryPages = ['verify-email', 'email-verified'];
      if (!noHistoryPages.includes(page)) {
        setNavigationHistory(prev => [...prev, page]);
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  const handleBack = () => {
    // Use browser's back button functionality
    window.history.back();
  };

  const renderPage = () => {
    const pages = {
      "home": <HomePage onNavigate={handleNavigate} />,
      "services": <ServicesPage onNavigate={handleNavigate} />,
      "pricing": <PricingPage onNavigate={handleNavigate} />,
      "join": <JoinHelpaPage onNavigate={handleNavigate} />,
      "about": <AboutPage onBack={handleBack} onNavigate={handleNavigate} />,
      "api": <APIPage onNavigate={handleNavigate} onBack={handleBack} />,
      "faqs": <FAQPage onBack={handleBack} />,
      "signup": <ImprovedSignupPage onNavigate={handleNavigate} onBack={handleBack} />,
      "signin": <ImprovedSigninPage onNavigate={handleNavigate} onBack={handleBack} />,

      "settings": <SettingsPage onNavigate={handleNavigate} onBack={handleBack} />,
      "diagnostic": <DiagnosticPage onNavigate={handleNavigate} onBack={handleBack} />,
      "signup-debugger": <SignupDebugger onNavigate={handleNavigate} onBack={handleBack} />,
      "waitlist-choice": <WaitlistChoicePage onNavigate={handleNavigate} onBack={handleBack} />,
      "waitlist-customer": <WaitlistPage onNavigate={handleNavigate} onBack={handleBack} defaultUserType="customer" />,
      "waitlist-helpa": <WaitlistPage onNavigate={handleNavigate} onBack={handleBack} defaultUserType="helpa" />,
    };
    return pages[currentPage as keyof typeof pages] || pages["home"];
  };

  return (
    <AuthProvider>
      <BlogSettingsProvider>
        <PageSEO page={currentPage} />
        <div className="min-h-screen bg-background overflow-x-hidden">
          <MockAuthBanner />
          <div style={{ paddingTop: USE_MOCK_AUTH ? '48px' : '0' }}>
            <ScrollProgress />
            <Header onNavigate={handleNavigate} currentPage={currentPage} />
            <Suspense fallback={<div className="w-full h-screen flex items-center justify-center">Loading...</div>}>
              <main className="relative">
                {renderPage()}
              </main>
            </Suspense>
            <Footer onNavigate={handleNavigate} />
            <FloatingWhatsAppButton onNavigate={handleNavigate} />
            <Toaster position="top-right" />
          </div>
        </div>
      </BlogSettingsProvider>
    </AuthProvider>
  );
}
