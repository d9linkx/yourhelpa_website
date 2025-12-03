import { SEO, StructuredData, generateStructuredData } from './SEO';

interface PageSEOProps {
  page: string;
}

export function PageSEO({ page }: PageSEOProps) {
  const baseUrl = 'https://yourhelpa.com.ng';

  const pageConfig: Record<string, {
    title: string;
    description: string;
    keywords: string;
    url: string;
    structuredDataType?: 'Organization' | 'WebSite' | 'Service' | 'Article';
  }> = {
    home: {
      title: 'YourHelpa - Services & Products in One Chat | Trusted WhatsApp Platform Nigeria',
      description: 'YourHelpa connects you to trusted home services, food providers, tutors, health advisors, and product sellers through WhatsApp. Easy ordering, secure payments, quality services across Nigeria.',
      keywords: 'yourhelpa, whatsapp services nigeria, home services lagos, food delivery nigeria, tutoring services, health products nigeria, home repairs, cleaning services, plumbing nigeria, electrician lagos, grocery delivery, trusted services',
      url: baseUrl,
      structuredDataType: 'WebSite',
    },
    services: {
      title: 'Our Services & Products | YourHelpa - Home Services, Food, Tutoring & More',
      description: 'Browse YourHelpa\'s comprehensive range of services and products: home repairs, cleaning, plumbing, electrical work, food & catering, groceries, tutoring, health products, and event planning across Nigeria.',
      keywords: 'home services nigeria, food delivery, tutoring nigeria, health products, home repairs lagos, cleaning services abuja, plumbing services, electrician, grocery delivery nigeria, event planning',
      url: `${baseUrl}/services`,
      structuredDataType: 'Service',
    },
    pricing: {
      title: 'Pricing Plans | YourHelpa - Affordable Services & Products',
      description: 'Transparent pricing for all YourHelpa services and products. Choose from flexible payment options for home services, food delivery, tutoring, and more. Quality service at fair prices.',
      keywords: 'yourhelpa pricing, service costs nigeria, affordable home services, food delivery prices, tutoring rates nigeria, transparent pricing',
      url: `${baseUrl}/pricing`,
    },
    join: {
      title: 'Become a Helpa | Join YourHelpa as a Service Provider or Seller',
      description: 'Join YourHelpa as a service provider or product seller. Grow your customer base, get marketing support, and earn income by offering your services or products through our WhatsApp platform.',
      keywords: 'become service provider nigeria, sell products online, join yourhelpa, helpa registration, earn income nigeria, service provider platform, marketplace nigeria',
      url: `${baseUrl}/become-a-helpa`,
    },
    about: {
      title: 'About YourHelpa | Connecting Nigerians to Trusted Services & Products',
      description: 'Learn about YourHelpa\'s mission to connect Nigerians with trusted service providers and product sellers through WhatsApp. Building a reliable marketplace for daily living needs.',
      keywords: 'about yourhelpa, nigerian startup, whatsapp marketplace, trusted services nigeria, service platform nigeria, yourhelpa story',
      url: `${baseUrl}/about`,
      structuredDataType: 'Organization',
    },
    api: {
      title: 'YourHelpa API Documentation | Integrate Services & Products Platform',
      description: 'Build with YourHelpa API. Access home services, food delivery, tutoring, health products, and marketplace data through our RESTful API. Complete documentation with code examples.',
      keywords: 'yourhelpa api, api documentation, rest api nigeria, services api, marketplace api, developer api, integration api',
      url: `${baseUrl}/api`,
    },
    faqs: {
      title: 'Frequently Asked Questions | YourHelpa Help Center',
      description: 'Get answers to common questions about YourHelpa. Learn how to request services, buy products, make payments, become a Helpa provider, and more.',
      keywords: 'yourhelpa faq, help center, how to use yourhelpa, service questions, payment help, helpa provider questions',
      url: `${baseUrl}/frequently-asked-questions`,
    },
    'waitlist-choice': {
      title: 'Join YourHelpa Waitlist | Get Early Access to Services & Products',
      description: 'Join the YourHelpa waitlist today! Be among the first to access our WhatsApp-based platform for services and products. Choose customer or Helpa provider registration.',
      keywords: 'yourhelpa waitlist, early access, join yourhelpa, waitlist registration, become customer, become helpa',
      url: `${baseUrl}/join-waitlist`,
    },
    'waitlist-customer': {
      title: 'Customer Waitlist | Join YourHelpa as a Customer',
      description: 'Join YourHelpa\'s customer waitlist to get early access to trusted home services, food delivery, tutoring, health products, and more through WhatsApp.',
      keywords: 'customer waitlist, join as customer, yourhelpa customer, early access services, whatsapp services customer',
      url: `${baseUrl}/join-waitlist/customer`,
    },
    'waitlist-helpa': {
      title: 'Become a Helpa | Service Provider & Seller Registration',
      description: 'Become a verified Helpa provider on YourHelpa. Register to earn money by offering your services or selling your products. Set your own prices and work schedule.',
      keywords: 'become a helpa, helpa provider registration, earn money nigeria, service provider registration, seller registration, become vendor yourhelpa',
      url: `${baseUrl}/join-waitlist/provider`,
    },
  };

  const config = pageConfig[page] || pageConfig.home;

  return (
    <>
      <SEO
        title={config.title}
        description={config.description}
        keywords={config.keywords}
        url={config.url}
      />
      {config.structuredDataType && (
        <StructuredData
          data={generateStructuredData(config.structuredDataType)}
        />
      )}
    </>
  );
}