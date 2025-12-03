import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
}

export function SEO({
  title = 'YourHelpa - Services & Products in One Chat',
  description = 'YourHelpa connects Nigerians to trusted home services, food providers, tutors, health advisors, and product sellers through WhatsApp. Request services or buy products easily.',
  keywords = 'yourhelpa, home services nigeria, whatsapp services, food delivery lagos, tutoring nigeria, health products, home repairs, cleaning services, plumbing, electrician, grocery delivery, trusted services nigeria',
  image = 'https://yourhelpa.com.ng/og-image.png',
  url = 'https://yourhelpa.com.ng',
  type = 'website',
  author,
  publishedTime,
}: SEOProps) {
  useEffect(() => {
    // Set document title
    document.title = title;

    // Helper function to set meta tag
    const setMetaTag = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Standard meta tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);
    setMetaTag('author', author || 'YourHelpa');
    setMetaTag('robots', 'index, follow');
    setMetaTag('googlebot', 'index, follow');

    // Open Graph meta tags
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', image, true);
    setMetaTag('og:url', url, true);
    setMetaTag('og:type', type, true);
    setMetaTag('og:site_name', 'YourHelpa', true);
    setMetaTag('og:locale', 'en_NG', true);

    // Twitter Card meta tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image);
    setMetaTag('twitter:site', '@yourhelpa');
    setMetaTag('twitter:creator', '@yourhelpa');

    // Article specific meta tags
    if (type === 'article' && publishedTime) {
      setMetaTag('article:published_time', publishedTime, true);
      setMetaTag('article:author', author || 'YourHelpa', true);
    }

    // Mobile meta tags
    setMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    setMetaTag('theme-color', '#1BBF72');
    setMetaTag('apple-mobile-web-app-capable', 'yes');
    setMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', url);

  }, [title, description, keywords, image, url, type, author, publishedTime]);

  return null;
}

// Helper function to generate structured data (JSON-LD)
export function generateStructuredData(type: 'Organization' | 'WebSite' | 'Service' | 'Article', data?: any) {
  const baseUrl = 'https://yourhelpa.com.ng';
  
  const structuredDataMap = {
    Organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "YourHelpa",
      "alternateName": "Your Helpa",
      "url": baseUrl,
      "logo": `${baseUrl}/yourhelpa-logo.png`,
      "description": "YourHelpa connects Nigerians to trusted home services, food providers, tutors, health advisors, and product sellers through WhatsApp.",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "NG",
        "addressLocality": "Lagos"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "availableLanguage": ["English", "Yoruba", "Igbo", "Hausa"]
      },
      "sameAs": [
        "https://twitter.com/yourhelpa",
        "https://facebook.com/yourhelpa",
        "https://instagram.com/yourhelpa"
      ]
    },
    WebSite: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "YourHelpa",
      "url": baseUrl,
      "description": "Services & Products in One Chat - WhatsApp-based platform for home services and products in Nigeria",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${baseUrl}/services?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
    Service: {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": data?.serviceType || "Home Services & Products",
      "provider": {
        "@type": "Organization",
        "name": "YourHelpa"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Nigeria"
      },
      "description": data?.description || "Trusted home services and products delivered through WhatsApp"
    },
    Article: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": data?.title,
      "description": data?.description,
      "image": data?.image || `${baseUrl}/og-image.jpg`,
      "author": {
        "@type": "Organization",
        "name": "YourHelpa"
      },
      "publisher": {
        "@type": "Organization",
        "name": "YourHelpa",
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/yourhelpa-logo.png`
        }
      },
      "datePublished": data?.publishedTime,
      "dateModified": data?.modifiedTime || data?.publishedTime
    }
  };

  return structuredDataMap[type];
}

// Component to inject structured data
interface StructuredDataProps {
  data: any;
}

export function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    // Create or update script tag for structured data
    let script = document.querySelector('script[type="application/ld+json"]');
    
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(data);

    return () => {
      // Cleanup on unmount
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [data]);

  return null;
}