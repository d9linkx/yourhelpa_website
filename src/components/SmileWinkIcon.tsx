export function SmileWinkIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Left eye (normal) */}
      <circle cx="8" cy="9" r="1" fill="currentColor" />
      
      {/* Right eye (wink) */}
      <path d="M14 9 L17 9" />
      
      {/* Wide smile */}
      <path d="M7 14 Q12 17 17 14" />
    </svg>
  );
}
