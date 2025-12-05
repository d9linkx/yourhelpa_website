import { 
  Instagram, 
  Twitter, 
  Facebook, 
  Mail, 
  MapPin, 
  Phone, 
  MessageCircle,
  Send,
  Sparkles,
  ShieldCheck,
  Clock,
  HeartHandshake,
  LayoutDashboard,
  ChevronDown,
  User,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SmileWinkIcon } from "./SmileWinkIcon";
import { useAuth } from "./hooks/useAuth";
import { useState } from "react";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { user } = useAuth();
  const [dashboardsOpen, setDashboardsOpen] = useState(false);

  const handleChatClick = () => {
    onNavigate('waitlist-choice');
  };

  const quickLinks = [
    { label: "Home", id: "home" },
    { label: "Services", id: "services" },
    { label: "Pricing", id: "pricing" },
    { label: "FAQs", id: "faqs" },
    { label: "Become a Helpa", id: "join" },
    { label: "About", id: "about" },
  ];

  const services = [
    { icon: Sparkles, label: "Fast Help via WhatsApp" },
    { icon: HeartHandshake, label: "Trusted Helpas" },
    { icon: ShieldCheck, label: "Secure Payments" },
    { icon: Clock, label: "24/7 Support" },
  ];

  const trustBadges = [
    "500+ Verified Helpas",
    "10,000+ Happy Users",
    "5 Service Categories",
    "WhatsApp Native",
  ];

  return (
    <footer className="bg-card text-foreground particles-bg circuit-bg">
      {/* Trust Badges Bar */}
      <div className="border-b border-border/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:flex md:justify-center md:items-center gap-4 md:gap-6">
            {trustBadges.map((badge, index) => {
              const icons = [ShieldCheck, HeartHandshake, Sparkles, MessageCircle];
              const BadgeIcon = icons[index];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-5 flex flex-col items-center text-center group hover:bg-white/10 hover:border-primary/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/10"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center mb-3 shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                    <BadgeIcon className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm md:text-base text-muted-foreground group-hover:text-foreground/90 transition-colors font-medium">{badge}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Column - Larger on Desktop */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 holographic pulse-glow">
                <SmileWinkIcon className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl text-foreground leading-none tracking-tight holographic">YourHelpa</span>
                <span className="text-xs text-primary/80 leading-none mt-1 data-stream">Help Is Just a Chat Away</span>
              </div>
            </div>
            
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Your everyday solution for trusted home services, food, learning, health, and guidance — all through WhatsApp.
            </p>
            
            {/* WhatsApp CTA */}
            <div className="flex flex-col gap-3">
              {/* Start Chat CTA */}
              <motion.button
                onClick={handleChatClick}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-emerald-600 transition-all group shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="font-medium">Start Chat</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* Login/Become a Helpa CTA - Show for non-logged-in users */}
              {!user && (
                <motion.button
                  onClick={() => onNavigate('join')}
                  className="inline-flex items-center gap-2 bg-background/10 border border-border/20 text-foreground px-6 py-3 rounded-xl hover:bg-background/15 hover:border-primary/40 transition-all group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="font-medium">Become a Helpa</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              )}
            </div>

            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              {[
                { icon: Instagram, href: "https://instagram.com/yourhelpa", label: "Instagram" },
                { icon: Twitter, href: "https://twitter.com/yourhelpa", label: "Twitter" },
                { icon: Facebook, href: "https://facebook.com/yourhelpa", label: "Facebook" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 bg-background/5 hover:bg-background/10 rounded-xl flex items-center justify-center transition-all group border border-border/5 hover:border-primary/30"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h4 className="text-foreground text-sm uppercase tracking-wider mb-6 font-medium">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm inline-flex items-center gap-2 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">{item.label}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
              
              {/* Dashboards Dropdown - Only show if user is logged in */}
              {user && (
                <li>
                  <div className="space-y-2">
                    <button
                      onClick={() => setDashboardsOpen(!dashboardsOpen)}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm inline-flex items-center gap-2 group w-full"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span className="group-hover:translate-x-1 transition-transform">Dashboards</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ml-auto ${dashboardsOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {dashboardsOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden pl-6 space-y-2 pt-1"
                        >
                          <button
                            onClick={() => {
                              setDashboardsOpen(false);
                              onNavigate('dashboard');
                            }}
                            className="text-muted-foreground/40 hover:text-foreground transition-colors text-sm inline-flex items-center gap-2 group"
                          >
                            <User className="w-3.5 h-3.5" />
                            <span className="group-hover:translate-x-1 transition-transform">My requests</span>
                          </button>
                          <button
                            onClick={() => {
                              setDashboardsOpen(false);
                              onNavigate('provider-dashboard');
                            }}
                            className="text-muted-foreground/40 hover:text-foreground transition-colors text-sm inline-flex items-center gap-2 group"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span className="group-hover:translate-x-1 transition-transform">Helpa Dashboard</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h4 className="text-foreground text-sm uppercase tracking-wider mb-6 font-medium">What We Do</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index} className="flex items-start gap-3 text-muted-foreground text-sm group">
                  <service.icon className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" strokeWidth={2} />
                  <span className="group-hover:text-foreground/70 transition-colors">{service.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-foreground text-sm uppercase tracking-wider mb-6 font-medium">Reach Us</h4>
            <ul className="space-y-4">
              {[
                { icon: MapPin, text: "Lagos, Nigeria", type: "location" },
                { icon: Phone, text: "+234 902 723 1243", type: "phone" },
                { icon: Mail, text: "hello@yourhelpa.ng", type: "email" },
              ].map((contact, index) => (
                <li key={index} className="flex items-start gap-3 text-muted-foreground text-sm group">
                  <contact.icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" strokeWidth={2} />
                  <span className="group-hover:text-foreground/70 transition-colors">{contact.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <p className="text-muted-foreground/40 text-sm text-center md:text-left">
              © 2025 YourHelpa. Built in Nigeria, for Nigerians. 🇳🇬
            </p>
            
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-6 text-muted-foreground/40 text-sm">
              {[
                { label: "Privacy Policy", action: () => {} },
                { label: "Terms of Service", action: () => {} },
                { label: "FAQs", action: () => onNavigate('faqs') },
              ].map((link) => (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="hover:text-foreground transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/5 border border-border/10">
              <span className="text-muted-foreground/60 text-xs">Making Life Easier, One Trusted Connection at a Time</span>
              <span className="text-primary">🤝</span>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
