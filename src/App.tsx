import { useState, useEffect } from "react";
import { BlogSettingsProvider } from "./components/hooks/useBlogSettings";
import { AuthProvider } from "./components/hooks/useAuth";
import { Toaster } from "./components/ui/sonner";
import { USE_MOCK_AUTH } from "./utils/mock-auth";
import { HomePage } from "./components/HomePage";
import { ServicesPage } from "./components/ServicesPage";
import { PricingPage } from "./components/PricingPage";
import { JoinHelpaPage } from "./components/JoinHelpaPage";
import { AboutPage } from "./components/AboutPage";
import { APIPage } from "./components/APIPage";
import { FAQPage } from "./components/FAQPage";
import { ImprovedSignupPage } from "./components/ImprovedSignupPage";
import { ImprovedSigninPage } from "./components/ImprovedSigninPage";
import { UserDashboard } from "./components/UserDashboard";
import { ProviderDashboard } from "./components/ProviderDashboard";
import { SettingsPage } from "./components/SettingsPage";
import { HelpaSettings } from "./components/HelpaSettings";
import { EmailVerificationPage } from "./components/EmailVerificationPage";
import { EmailVerifiedPage } from "./components/EmailVerifiedPage";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ScrollProgress } from "./components/ScrollProgress";
import { DiagnosticPage } from "./components/DiagnosticPage";
import { SignupDebugger } from "./components/SignupDebugger";
import { MockAuthBanner } from "./components/MockAuthBanner";
import { FloatingWhatsAppButton } from "./components/FloatingWhatsAppButton";
import { WaitlistPage } from "./components/WaitlistPage";
import { WaitlistChoicePage } from "./components/WaitlistChoicePage";
import { PageSEO } from "./components/PageSEO";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [navigationHistory, setNavigationHistory] = useState<string[]>(["home"]);

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
    '/dashboard': 'dashboard',
    '/helpa-dashboard': 'provider-dashboard',
    '/account-settings': 'settings',
    '/helpa-settings': 'helpa-settings',
    '/verify-email': 'verify-email',
    '/email-verified': 'email-verified',
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
    'provider-dashboard': '/helpa-dashboard',
    'settings': '/account-settings',
    'helpa-settings': '/helpa-settings',
    'verify-email': '/verify-email',
    'email-verified': '/email-verified',
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
    // Prevent navigating to the same page
    if (page === currentPage && !data) return;

    // Update page state and URL
    if (page === "verify-email" && data) {
      setVerificationEmail(data);
      setCurrentPage(page);
      const url = pageToPath[page] || '/';
      window.history.pushState(null, '', url);
      // Don't add verification pages to history (they're part of a flow)
      window.scrollTo({ top: 0, behavior: "instant" });
    } else if (page !== currentPage) {
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
      home: <HomePage onNavigate={handleNavigate} />,
      services: <ServicesPage onNavigate={handleNavigate} />,
      pricing: <PricingPage onNavigate={handleNavigate} />,
      join: <JoinHelpaPage onNavigate={handleNavigate} />,
      about: <AboutPage onBack={handleBack} onNavigate={handleNavigate} />,
      api: <APIPage onNavigate={handleNavigate} onBack={handleBack} />,
      faqs: <FAQPage onBack={handleBack} />,
      signup: <ImprovedSignupPage onNavigate={handleNavigate} onBack={handleBack} />,
      signin: <ImprovedSigninPage onNavigate={handleNavigate} onBack={handleBack} />,
      dashboard: <UserDashboard onNavigate={handleNavigate} />,
      "provider-dashboard": <ProviderDashboard onNavigate={handleNavigate} />,
      settings: <SettingsPage onNavigate={handleNavigate} onBack={handleBack} />,
      "helpa-settings": <HelpaSettings onNavigate={handleNavigate} onBack={handleBack} />,
      "verify-email": <EmailVerificationPage onNavigate={handleNavigate} email={verificationEmail} onBack={handleBack} />,
      "email-verified": <EmailVerifiedPage onNavigate={handleNavigate} />,
      "diagnostic": <DiagnosticPage onNavigate={handleNavigate} onBack={handleBack} />,
      "signup-debugger": <SignupDebugger onNavigate={handleNavigate} onBack={handleBack} />,
      "waitlist-choice": <WaitlistChoicePage onNavigate={handleNavigate} onBack={handleBack} />,
      "waitlist-customer": <WaitlistPage onNavigate={handleNavigate} onBack={handleBack} defaultUserType="customer" />,
      "waitlist-helpa": <WaitlistPage onNavigate={handleNavigate} onBack={handleBack} defaultUserType="helpa" />,
    };
    return pages[currentPage as keyof typeof pages] || pages.home;
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
            <main className="relative">
              {renderPage()}
            </main>
            <Footer onNavigate={handleNavigate} />
            <FloatingWhatsAppButton onNavigate={handleNavigate} />
            <Toaster position="top-right" />
          </div>
        </div>
      </BlogSettingsProvider>
    </AuthProvider>
  );
}