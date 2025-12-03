import { motion } from "motion/react";

interface YourHelpaIconProps {
  className?: string;
}

export function YourHelpaIcon({ className = "w-8 h-8" }: YourHelpaIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Helping Hand Circle */}
      <motion.circle
        cx="50"
        cy="50"
        r="45"
        fill="currentColor"
        opacity="0.15"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.15 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Main Hand Shape */}
      <motion.path
        d="M35 55 Q35 40, 45 38 L45 25 Q45 20, 50 20 Q55 20, 55 25 L55 38 Q65 40, 65 55 L65 70 Q65 78, 58 82 L42 82 Q35 78, 35 70 Z"
        fill="currentColor"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      />
      
      {/* Heart in Palm */}
      <motion.path
        d="M45 58 Q45 55, 47 54 Q48 53, 50 55 Q52 53, 53 54 Q55 55, 55 58 Q55 62, 50 66 Q45 62, 45 58 Z"
        fill="white"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.3, type: "spring" }}
      />
      
      {/* Sparkle Effects */}
      <motion.circle
        cx="25"
        cy="35"
        r="2"
        fill="currentColor"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
      />
      <motion.circle
        cx="75"
        cy="45"
        r="2"
        fill="currentColor"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
      />
      <motion.circle
        cx="70"
        cy="28"
        r="1.5"
        fill="currentColor"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
      />
    </svg>
  );
}
