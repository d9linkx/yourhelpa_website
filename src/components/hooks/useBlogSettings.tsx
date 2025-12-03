import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface BlogSettingsContextType {
  isWhiteBackground: boolean;
  setIsWhiteBackground: (value: boolean) => void;
}

const BlogSettingsContext = createContext<BlogSettingsContextType | undefined>(undefined);

export function BlogSettingsProvider({ children }: { children: ReactNode }) {
  const [isWhiteBackground, setIsWhiteBackground] = useState(true);

  // Apply dark class to document element when theme changes
  useEffect(() => {
    if (isWhiteBackground) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [isWhiteBackground]);

  return (
    <BlogSettingsContext.Provider value={{ isWhiteBackground, setIsWhiteBackground }}>
      {children}
    </BlogSettingsContext.Provider>
  );
}

export function useBlogSettings() {
  const context = useContext(BlogSettingsContext);
  if (context === undefined) {
    throw new Error('useBlogSettings must be used within a BlogSettingsProvider');
  }
  return context;
}