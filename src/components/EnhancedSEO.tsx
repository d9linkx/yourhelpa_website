import { useEffect } from 'react';

interface EnhancedSEOProps {
  title: string;
  description: string;
  keywords: string;
  image?: string;
  url: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  structuredData?: any;
}

export function EnhancedSEO({
  title,
  description,
  keywords,
  image = 'https://yourhelpa.com.ng/og-image.png',
  url,
  type = 'website',
  author = 'YourHelpa',
  publishedTime,
  structuredData,
}: EnhancedSEOProps) {
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
    setMetaTag('author', author);
    setMetaTag('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
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
    setMetaTag('twitter:site', '@YourHelpa');
    setMetaTag('twitter:creator', '@YourHelpa');

    // Article specific meta tags
    if (type === 'article' && publishedTime) {
      setMetaTag('article:published_time', publishedTime, true);
      setMetaTag('article:author', author, true);
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

    // Structured Data (JSON-LD)
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]');
      
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      
      script.textContent = JSON.stringify(structuredData);
    }

  }, [title, description, keywords, image, url, type, author, publishedTime, structuredData]);

  return null;
}

// Schema.org Structured Data Generators
export const createLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "YourHelpa",
  "image": "https://yourhelpa.com.ng/yourhelpa-logo.png",
  "description": "Nigeria's trusted WhatsApp-based service platform connecting users to verified home services, food providers, tutors, health advisors, and product sellers.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Lagos",
    "addressRegion": "Lagos State",
    "addressCountry": "NG"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "6.5244",
    "longitude": "3.3792"
  },
  "url": "https://yourhelpa.com.ng",
  "telephone": "+2349027231243",
  "email": "support@yourhelpa.com.ng",
  "priceRange": "₦1,000 - ₦50,000",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "opens": "00:00",
    "closes": "23:59"
  },
  "sameAs": [
    "https://wa.me/2349027231243"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "10000"
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Lagos"
    },
    {
      "@type": "City",
      "name": "Abuja"
    },
    {
      "@type": "City",
      "name": "Port Harcourt"
    }
  ]
});

export const createBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const createOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "YourHelpa",
  "alternateName": "Your Helpa",
  "url": "https://yourhelpa.com.ng",
  "logo": "https://yourhelpa.com.ng/yourhelpa-logo.png",
  "description": "YourHelpa connects Nigerians to trusted home services, food providers, tutors, health advisors, and product sellers through WhatsApp.",
  "foundingDate": "2024",
  "founder": {
    "@type": "Person",
    "name": "Prince Dike"
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "NG",
    "addressLocality": "Lagos"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "telephone": "+2349027231243",
    "email": "support@yourhelpa.com.ng",
    "availableLanguage": ["English", "Yoruba", "Igbo", "Hausa"]
  },
  "sameAs": [
    "https://wa.me/2349027231243"
  ]
});

export const createWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "YourHelpa",
  "url": "https://yourhelpa.com.ng",
  "description": "Trusted Services & Products via WhatsApp Nigeria",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://yourhelpa.com.ng/services?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
});

export const createServiceSchema = (serviceType: string, description: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": serviceType,
  "provider": {
    "@type": "Organization",
    "name": "YourHelpa",
    "url": "https://yourhelpa.com.ng"
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Lagos"
    },
    {
      "@type": "City",
      "name": "Abuja"
    },
    {
      "@type": "City",
      "name": "Port Harcourt"
    }
  ],
  "description": description,
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceUrl": "https://wa.me/2349027231243",
    "servicePhone": "+2349027231243"
  }
});

export const createArticleSchema = (title: string, description: string, image: string, publishedTime: string, modifiedTime?: string) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "description": description,
  "image": image,
  "author": {
    "@type": "Organization",
    "name": "YourHelpa"
  },
  "publisher": {
    "@type": "Organization",
    "name": "YourHelpa",
    "logo": {
      "@type": "ImageObject",
      "url": "https://yourhelpa.com.ng/yourhelpa-logo.png"
    }
  },
  "datePublished": publishedTime,
  "dateModified": modifiedTime || publishedTime,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://yourhelpa.com.ng"
  }
});

export const createFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});
