import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Shield,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Truck,
  DollarSign,
  Zap,
  Lock,
  Globe,
  Code2,
  Bell,
  ArrowRight,
  Calendar,
  Users,
  RefreshCw,
  FileJson,
  Link2,
  TrendingUp,
  Award,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

interface APIPageProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function APIPage({ onNavigate, onBack }: APIPageProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const escrowSteps = [
    {
      number: "01",
      icon: ShoppingCart,
      title: "Customer Makes Offer",
      description: "Buyer initiates purchase request through your platform",
      color: "from-primary to-emerald-600",
    },
    {
      number: "02",
      icon: Link2,
      title: "Payment Link Generated",
      description: "YourHelpa API creates secure, unique payment link via bot",
      color: "from-emerald-500 to-teal-600",
    },
    {
      number: "03",
      icon: Lock,
      title: "Funds Held in Escrow",
      description: "Payment is securely held until delivery confirmation",
      color: "from-teal-500 to-cyan-600",
    },
    {
      number: "04",
      icon: Truck,
      title: "Seller Ships Product",
      description: "Vendor fulfills order with tracking information",
      color: "from-teal-500 to-emerald-600",
    },
    {
      number: "05",
      icon: CheckCircle,
      title: "Buyer Confirms Receipt",
      description: "Customer verifies delivery and product satisfaction",
      color: "from-emerald-500 to-green-600",
    },
    {
      number: "06",
      icon: DollarSign,
      title: "Funds Released to Seller",
      description: "Payment automatically transferred to vendor account",
      color: "from-green-600 to-emerald-700",
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Eliminate Chargebacks",
      description: "Hold funds until buyer confirms satisfaction. No more payment disputes or fraudulent chargebacks.",
    },
    {
      icon: Globe,
      title: "Multi-Platform Ready",
      description: "Seamlessly integrate with Instagram, Facebook Shops, Shopify, WooCommerce, and custom platforms.",
    },
    {
      icon: RefreshCw,
      title: "Automated Dispute Resolution",
      description: "Built-in triggers for mediation if buyer fails to confirm delivery within specified timeframe.",
    },
    {
      icon: Bell,
      title: "Webhooks & Notifications",
      description: "Real-time status updates (FUNDS_HELD, COMPLETED) pushed directly to your system.",
    },
    {
      icon: Zap,
      title: "Lightning Fast Integration",
      description: "RESTful API with comprehensive SDKs. Go live in hours, not weeks.",
    },
    {
      icon: Award,
      title: "Nigerian Market Optimized",
      description: "Built specifically for Nigerian payment methods, currencies, and commerce patterns.",
    },
  ];

  const timeline = [
    {
      quarter: "Q1 2026",
      title: "Beta Integrations & API Freeze",
      description: "Selected partners test integration. Final API specifications locked.",
      status: "upcoming",
    },
    {
      quarter: "Q2 2026",
      title: "Public Beta Launch",
      description: "Early access participants gain full API access. Limited slots available.",
      status: "upcoming",
    },
    {
      quarter: "Mid 2026",
      title: "General Availability",
      description: "Full public launch. Complete platform integrations and partnerships live.",
      status: "upcoming",
    },
  ];

  const codeExample = `// Initialize YourHelpa Escrow API
import { YourHelpaEscrow } from '@yourhelpa/escrow-sdk';

const escrow = new YourHelpaEscrow({
  apiKey: process.env.YOURHELPA_API_KEY,
  webhookSecret: process.env.WEBHOOK_SECRET,
  environment: 'production'
});

// Create an escrow transaction
const transaction = await escrow.transactions.create({
  amount: 25000, // NGN 25,000
  currency: 'NGN',
  buyer: {
    name: 'John Doe',
    phone: '+2348012345678',
    email: 'john@example.com'
  },
  seller: {
    id: 'vendor_123',
    name: 'Jane\'s Electronics'
  },
  product: {
    name: 'iPhone 13 Pro',
    description: 'Brand new, sealed',
    quantity: 1
  },
  metadata: {
    order_id: 'ORD-2026-001',
    platform: 'instagram'
  }
});

// Returns payment link and transaction ID
console.log(transaction.payment_link);
// https://wa.me/234XXXXXXXXX?text=PAY-abc123...

// Listen for webhook events
escrow.webhooks.on('transaction.completed', (event) => {
  console.log('Funds released:', event.transaction_id);
  // Update your database, send notifications, etc.
});`;

  const integrationPlatforms = [
    { name: "Instagram", logo: "📷" },
    { name: "Facebook Shops", logo: "👥" },
    { name: "WhatsApp Business", logo: "💬" },
    { name: "Shopify", logo: "🛍️" },
    { name: "WooCommerce", logo: "🛒" },
    { name: "Custom Platforms", logo: "⚡" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-5xl mx-auto"
          >
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              <Calendar className="w-3 h-3 mr-1" />
              Launching 2026
            </Badge>
            
            <h1 className="text-5xl md:text-7xl mb-6 font-black">
              Integrate trust with YourHelpa escrow API
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Eliminate chargebacks and build instant customer trust by integrating automated escrow protection directly into your Instagram shop, Facebook marketplace, or e-commerce checkout—ensuring you only receive payment after your customer confirms delivery satisfaction.
            </p>

            <div className="mb-12 overflow-hidden relative">
              <motion.div
                className="flex gap-6"
                animate={{
                  x: [0, -1000],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 20,
                    ease: "linear",
                  },
                }}
              >
                {/* First set of cards */}
                {[
                  { icon: Shield, text: "Zero Chargebacks" },
                  { icon: Lock, text: "Funds Protected" },
                  { icon: Zap, text: "Easy Integration" },
                  { icon: Shield, text: "Zero Chargebacks" },
                  { icon: Lock, text: "Funds Protected" },
                  { icon: Zap, text: "Easy Integration" },
                  { icon: Shield, text: "Zero Chargebacks" },
                  { icon: Lock, text: "Funds Protected" },
                  { icon: Zap, text: "Easy Integration" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 bg-card border border-border rounded-xl px-6 py-4 flex items-center gap-3 shadow-sm"
                  >
                    <item.icon className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm whitespace-nowrap">{item.text}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={() => onNavigate?.("waitlist-choice")}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Get Early Access to 2026 Beta
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30"
              >
                <FileJson className="mr-2 w-4 h-4" />
                Download API Docs (Pre-release)
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-6">
              Join 500+ developers and businesses securing their spot for the beta launch
            </p>
          </motion.div>

          {/* API Flow Diagram */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-20"
          >
            <Card className="bg-card border-border p-8 shadow-2xl">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Code2 className="w-6 h-6 text-primary" />
                <h3 className="text-2xl">Simple Integration, Powerful Protection</h3>
              </div>
              <p className="text-center text-muted-foreground mb-8">
                One API call to create secure, escrow-backed payment links
              </p>
              
              <div className="bg-[#1e1e1e] rounded-xl p-6 overflow-x-auto">
                <pre className="text-sm">
                  <code className="text-gray-300">
{`POST https://api.yourhelpa.com.ng/v1/escrow/transactions

Authorization: Bearer your_api_key_here
Content-Type: application/json

{
  "amount": 25000,
  "currency": "NGN",
  "buyer": { "phone": "+2348012345678" },
  "product": { "name": "iPhone 13 Pro" }
}

→ Returns WhatsApp payment link with built-in escrow protection`}
                  </code>
                </pre>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-4">
              Your 6 Steps to{" "}
              <span className="text-primary">Trustworthy Transactions</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We hold the funds. You secure the sale. Automatically.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {escrowSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="bg-card border-border p-6 h-full hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-4xl font-black text-muted-foreground/20">
                      {step.number}
                    </span>
                  </div>
                  
                  <h3 className="text-xl mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Card className="bg-primary/5 border-primary/20 p-6 max-w-3xl mx-auto">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="font-semibold text-primary mb-2">
                    Automated Protection at Every Step
                  </p>
                  <p className="text-sm text-muted-foreground">
                    If the buyer doesn't confirm delivery within the agreed timeframe, our automated dispute resolution
                    system activates, ensuring fair outcomes for both parties. No manual intervention required.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Core Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-4">
              Built for{" "}
              <span className="text-primary">Developers & Businesses</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to integrate trust into your platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="bg-card border-border p-8 h-full hover:border-primary/30 transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <benefit.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Integration Platforms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <Card className="bg-gradient-to-br from-card to-muted/50 border-border p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl mb-3">
                  Integrate Anywhere
                </h3>
                <p className="text-muted-foreground">
                  Pre-built integrations for the platforms you already use
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {integrationPlatforms.map((platform, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-background border border-border rounded-xl p-4 text-center hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="text-3xl mb-2">{platform.logo}</div>
                    <p className="text-xs text-muted-foreground">{platform.name}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="py-20 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl mb-4">
                Developer-Friendly{" "}
                <span className="text-primary">Integration</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Clean, intuitive API designed for rapid integration
              </p>
            </div>

            <Card className="bg-card border-border overflow-hidden">
              <div className="bg-[#1e1e1e] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    Node.js / TypeScript
                  </Badge>
                </div>
                
                <div className="overflow-x-auto">
                  <pre className="text-sm font-mono">
                    <code className="text-gray-300">{codeExample}</code>
                  </pre>
                </div>
              </div>
              
              <div className="p-6 bg-card">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3">
                    <Code2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold mb-1">Type-Safe SDKs</p>
                      <p className="text-sm text-muted-foreground">
                        Node.js, Python, PHP, and more
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileJson className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold mb-1">OpenAPI Spec</p>
                      <p className="text-sm text-muted-foreground">
                        Generate clients in any language
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Bell className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold mb-1">Real-time Webhooks</p>
                      <p className="text-sm text-muted-foreground">
                        Instant event notifications
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* 2026 Timeline Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              <TrendingUp className="w-3 h-3 mr-1" />
              Coming Soon
            </Badge>
            <h2 className="text-4xl md:text-5xl mb-4">
              YourHelpa:{" "}
              <span className="text-primary">Ready for 2026 Commerce</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our rollout strategy ensures a smooth, secure launch
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-emerald-500 to-primary/20" />

              <div className="space-y-12">
                {timeline.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="relative flex items-start gap-8"
                  >
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white font-black shadow-lg z-10">
                      {milestone.quarter.split(' ')[0]}
                    </div>

                    <Card className="flex-grow bg-card border-border p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl">{milestone.title}</h3>
                        <Badge className="bg-muted text-muted-foreground">
                          {milestone.quarter}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {milestone.description}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Card className="bg-gradient-to-br from-primary/10 via-emerald-500/10 to-primary/5 border-primary/20 p-8 max-w-3xl mx-auto">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl mb-3">Limited Beta Slots Available</h3>
              <p className="text-muted-foreground mb-6">
                We're accepting a limited number of businesses and developers for our Q2 2026 beta launch.
                Early access participants will receive priority support, exclusive features, and special pricing.
              </p>
              <Button
                onClick={() => onNavigate?.("waitlist-choice")}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Secure Your Beta Access Now
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-emerald-500/5 to-primary/10 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-6xl mb-6">
              Don't Get Left Behind.{" "}
              <span className="text-primary">Secure Your Spot.</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Join the waitlist today and be among the first to integrate Africa's most trusted escrow API
              when we launch in 2026. Transform your platform into a trusted marketplace.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                onClick={() => onNavigate?.("waitlist-choice")}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-6"
              >
                Sign Up for Beta Access Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30 text-lg px-8 py-6"
                onClick={onBack}
              >
                Contact Sales Team
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-black text-primary mb-2">500+</div>
                <p className="text-sm text-muted-foreground">Developers on Waitlist</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-primary mb-2">100+</div>
                <p className="text-sm text-muted-foreground">Businesses Pre-registered</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-primary mb-2">Q2 2026</div>
                <p className="text-sm text-muted-foreground">Beta Launch Date</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}