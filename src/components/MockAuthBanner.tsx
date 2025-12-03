import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';
import { USE_MOCK_AUTH } from '../utils/mock-auth';

export function MockAuthBanner() {
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('yourhelpa_mock_banner_dismissed') === 'true';
  });

  if (!USE_MOCK_AUTH || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('yourhelpa_mock_banner_dismissed', 'true');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-lime-400 to-green-500 text-gray-900 shadow-lg border-b-2 border-green-600">
      <div className="container mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="bg-yellow-600/20 p-1.5 rounded-full flex-shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm">
                <strong className="font-semibold">Development Mode:</strong> 
                <span className="ml-1">Using local authentication (browser storage). Deploy Google Apps Script for production.</span>
                <a 
                  href="https://github.com/yourusername/yourhelpa" 
                  className="ml-2 underline hover:no-underline font-medium hidden md:inline"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('📖 See /START_HERE.md for deployment guide');
                    alert('Check your project files:\n\n1. /START_HERE.md - Overview\n2. /QUICK_FIX_GUIDE.md - Deploy in 5 min\n3. /MOCK_AUTH_EXPLAINED.md - How it works');
                  }}
                >
                  Deploy Guide
                </a>
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1.5 hover:bg-yellow-600/20 rounded-full transition-colors flex-shrink-0"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}