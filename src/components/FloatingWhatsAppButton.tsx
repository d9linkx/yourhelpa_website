import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface FloatingWhatsAppButtonProps {
  onNavigate: (page: string) => void;
}

export function FloatingWhatsAppButton({ onNavigate }: FloatingWhatsAppButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate('waitlist-choice');
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
    >
      <motion.button
        onClick={handleClick}
        className="group relative flex items-center gap-3 bg-primary text-white rounded-full whatsapp-shadow-xl overflow-hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Icon */}
        <div className="relative z-10 p-4">
          <MessageCircle className="w-6 h-6" />
        </div>

        {/* Expandable Text */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: isHovered ? "auto" : 0,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden pr-5 whitespace-nowrap"
        >
          <span className="relative z-10 text-sm font-medium">Chat with YourHelpa</span>
        </motion.div>

        {/* Notification Badge */}
        <motion.div
          className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white rounded-full flex items-center justify-center text-xs"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          1
        </motion.div>

        {/* Pulse Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary"
          animate={{
            scale: [1, 1.3],
            opacity: [0.5, 0],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.button>
    </motion.div>
  );
}