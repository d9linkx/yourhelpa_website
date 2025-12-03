export function DecorativeShapes() {
  return {
    // Blob shape - organic fluid shape
    Blob1: () => (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path
          fill="currentColor"
          d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.8C64.8,56.4,53.8,69,40.4,76.8C27,84.6,13.5,87.6,-1.1,89.3C-15.7,91,-31.4,91.4,-45.3,84.4C-59.2,77.4,-71.3,63,-78.8,46.4C-86.3,29.8,-89.2,11,-87.6,-7.3C-86,-25.6,-79.9,-43.4,-69.7,-57.8C-59.5,-72.2,-45.2,-83.2,-29.7,-89.3C-14.2,-95.4,1.5,-96.6,16.5,-92.8C31.5,-89,45.8,-80.2,44.7,-76.4Z"
          transform="translate(100 100)"
        />
      </svg>
    ),

    // Blob shape 2 - different variation
    Blob2: () => (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path
          fill="currentColor"
          d="M39.5,-65.9C51.4,-58.4,61.3,-48.3,68.5,-36.2C75.7,-24.1,80.2,-10,80.3,4.2C80.4,18.4,76.1,32.7,68.2,44.8C60.3,56.9,48.8,66.8,35.8,72.4C22.8,78,8.3,79.3,-5.7,78.2C-19.7,77.1,-33.3,73.6,-45.8,66.8C-58.3,60,-69.7,50,-76.4,37.3C-83.1,24.6,-85.1,9.2,-82.8,-5.3C-80.5,-19.8,-73.9,-33.4,-64.8,-44.7C-55.7,-56,-44.1,-65,-31.5,-71.8C-18.9,-78.6,-5.3,-83.2,6.7,-82.8C18.7,-82.4,27.6,-73.4,39.5,-65.9Z"
          transform="translate(100 100)"
        />
      </svg>
    ),

    // Circle with dots pattern
    DottedCircle: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" opacity="0.3" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" opacity="0.3" />
        <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" opacity="0.3" />
      </svg>
    ),

    // Wave pattern
    Wave: () => (
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          fill="currentColor"
          opacity="0.3"
        />
      </svg>
    ),

    // Food bowl illustration
    FoodBowl: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <ellipse cx="100" cy="140" rx="70" ry="15" fill="currentColor" opacity="0.1" />
        <path
          d="M40 100 Q40 60 100 60 Q160 60 160 100 L160 120 Q160 150 100 150 Q40 150 40 120 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="70" cy="90" r="8" fill="currentColor" opacity="0.6" />
        <circle cx="100" cy="85" r="10" fill="currentColor" opacity="0.6" />
        <circle cx="130" cy="90" r="8" fill="currentColor" opacity="0.6" />
        <circle cx="85" cy="105" r="7" fill="currentColor" opacity="0.6" />
        <circle cx="115" cy="105" r="9" fill="currentColor" opacity="0.6" />
      </svg>
    ),

    // Utensils icon
    Utensils: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <g stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round">
          {/* Fork */}
          <line x1="60" y1="50" x2="60" y2="150" />
          <line x1="50" y1="50" x2="50" y2="90" />
          <line x1="70" y1="50" x2="70" y2="90" />
          <path d="M50 90 Q55 95 60 95 Q65 95 70 90" />
          
          {/* Spoon */}
          <line x1="140" y1="80" x2="140" y2="150" />
          <circle cx="140" cy="65" r="15" />
        </g>
      </svg>
    ),

    // Leaf/organic shape
    Leaf: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path
          d="M100 20 Q150 50 150 100 Q150 150 100 180 Q50 150 50 100 Q50 50 100 20 Z"
          fill="currentColor"
          opacity="0.15"
        />
        <path
          d="M100 40 Q80 60 80 100 Q80 140 100 160"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          opacity="0.3"
        />
      </svg>
    ),

    // Star burst
    StarBurst: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <g stroke="currentColor" strokeWidth="3" opacity="0.3">
          <line x1="100" y1="40" x2="100" y2="70" />
          <line x1="100" y1="130" x2="100" y2="160" />
          <line x1="40" y1="100" x2="70" y2="100" />
          <line x1="130" y1="100" x2="160" y2="100" />
          <line x1="60" y1="60" x2="80" y2="80" />
          <line x1="120" y1="120" x2="140" y2="140" />
          <line x1="140" y1="60" x2="120" y2="80" />
          <line x1="80" y1="120" x2="60" y2="140" />
        </g>
        <circle cx="100" cy="100" r="10" fill="currentColor" opacity="0.5" />
      </svg>
    ),

    // Zigzag pattern
    Zigzag: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full" preserveAspectRatio="none">
        <path
          d="M0 50 L50 100 L100 50 L150 100 L200 50 L200 150 L150 100 L100 150 L50 100 L0 150 Z"
          fill="currentColor"
          opacity="0.1"
        />
      </svg>
    ),

    // Abstract food plate
    Plate: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.2" />
        <circle cx="100" cy="100" r="60" fill="currentColor" opacity="0.05" />
        <path
          d="M70 90 Q100 70 130 90"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.4"
        />
        <circle cx="85" cy="110" r="6" fill="currentColor" opacity="0.4" />
        <circle cx="115" cy="110" r="6" fill="currentColor" opacity="0.4" />
      </svg>
    ),

    // Geometric pattern
    Geometric: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect x="40" y="40" width="40" height="40" fill="currentColor" opacity="0.1" transform="rotate(15 60 60)" />
        <rect x="110" y="40" width="40" height="40" fill="currentColor" opacity="0.15" transform="rotate(-15 130 60)" />
        <rect x="40" y="110" width="40" height="40" fill="currentColor" opacity="0.15" transform="rotate(-15 60 130)" />
        <rect x="110" y="110" width="40" height="40" fill="currentColor" opacity="0.1" transform="rotate(15 130 130)" />
      </svg>
    ),

    // Layered green shapes for dark backgrounds
    GreenLayers1: () => (
      <svg viewBox="0 0 400 400" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <path d="M0 0 Q100 50 200 0 Q300 50 400 0 L400 200 Q300 150 200 200 Q100 150 0 200 Z" fill="#065F46" opacity="0.3" />
        <circle cx="320" cy="80" r="60" fill="#047857" opacity="0.2" />
        <path d="M50 150 Q100 100 150 150 Q200 200 250 150 L250 300 Q200 350 150 300 Q100 250 50 300 Z" fill="#059669" opacity="0.25" />
        <circle cx="100" cy="300" r="40" fill="#10B981" opacity="0.15" />
      </svg>
    ),

    GreenLayers2: () => (
      <svg viewBox="0 0 400 400" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <path d="M0 100 C100 50 200 150 300 100 C350 80 400 120 400 150 L400 400 L0 400 Z" fill="#065F46" opacity="0.25" />
        <ellipse cx="200" cy="200" rx="120" ry="80" fill="#047857" opacity="0.2" transform="rotate(-30 200 200)" />
        <path d="M100 0 Q150 100 200 50 Q250 0 300 80 L300 200 Q250 150 200 200 Q150 250 100 200 Z" fill="#059669" opacity="0.3" />
        <circle cx="350" cy="350" r="50" fill="#10B981" opacity="0.15" />
      </svg>
    ),

    GreenLayers3: () => (
      <svg viewBox="0 0 400 400" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <path d="M0 0 L200 100 L400 0 L400 300 L200 200 L0 300 Z" fill="#065F46" opacity="0.2" />
        <circle cx="80" cy="120" r="70" fill="#047857" opacity="0.25" />
        <path d="M150 200 Q200 150 250 200 Q300 250 350 200 L350 400 L150 400 Z" fill="#059669" opacity="0.3" />
        <ellipse cx="300" cy="100" rx="60" ry="90" fill="#10B981" opacity="0.15" />
        <circle cx="200" cy="350" r="45" fill="#065F46" opacity="0.2" />
      </svg>
    ),

    GreenLayers4: () => (
      <svg viewBox="0 0 400 400" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <path d="M0 200 Q100 100 200 200 Q300 300 400 200 L400 400 L0 400 Z" fill="#065F46" opacity="0.3" />
        <circle cx="150" cy="100" r="80" fill="#047857" opacity="0.2" />
        <path d="M200 0 Q250 50 300 0 L300 150 Q250 200 200 150 Z" fill="#059669" opacity="0.25" />
        <ellipse cx="320" cy="280" rx="70" ry="50" fill="#10B981" opacity="0.2" transform="rotate(45 320 280)" />
        <circle cx="60" cy="320" r="55" fill="#047857" opacity="0.15" />
      </svg>
    ),

    // Food Illustrations
    Banana: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path
          d="M60 120 Q50 80 60 50 Q70 30 90 25 Q110 22 120 30 Q130 40 135 60 Q138 80 140 100 Q142 120 138 140 Q130 155 115 158 Q100 160 85 155 Q70 150 60 120 Z"
          fill="currentColor"
          opacity="0.15"
        />
        <path
          d="M60 120 Q50 80 60 50 Q70 30 90 25"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          opacity="0.3"
          strokeLinecap="round"
        />
      </svg>
    ),

    Pineapple: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <ellipse cx="100" cy="120" rx="45" ry="60" fill="currentColor" opacity="0.15" />
        <path d="M80 60 L90 40 M100 55 L100 35 M120 60 L110 40" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.25" strokeLinecap="round" />
        <line x1="85" y1="90" x2="115" y2="90" stroke="currentColor" strokeWidth="2" opacity="0.2" />
        <line x1="85" y1="110" x2="115" y2="110" stroke="currentColor" strokeWidth="2" opacity="0.2" />
        <line x1="85" y1="130" x2="115" y2="130" stroke="currentColor" strokeWidth="2" opacity="0.2" />
        <line x1="90" y1="150" x2="110" y2="150" stroke="currentColor" strokeWidth="2" opacity="0.2" />
      </svg>
    ),

    Orange: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="100" cy="100" r="50" fill="currentColor" opacity="0.15" />
        <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25" />
        <ellipse cx="100" cy="70" rx="8" ry="5" fill="currentColor" opacity="0.3" />
        <path d="M100 70 Q95 60 90 55 L85 50" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.25" strokeLinecap="round" />
      </svg>
    ),

    Avocado: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path
          d="M100 40 Q120 45 130 60 Q145 85 145 110 Q145 140 130 160 Q115 175 100 180 Q85 175 70 160 Q55 140 55 110 Q55 85 70 60 Q80 45 100 40 Z"
          fill="currentColor"
          opacity="0.15"
        />
        <circle cx="100" cy="115" r="20" fill="currentColor" opacity="0.25" />
      </svg>
    ),

    Watermelon: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path d="M50 140 Q50 80 100 50 Q150 80 150 140 Z" fill="currentColor" opacity="0.15" />
        <path d="M60 135 Q60 90 100 65 Q140 90 140 135" fill="currentColor" opacity="0.1" />
        <circle cx="80" cy="110" r="4" fill="currentColor" opacity="0.3" />
        <circle cx="100" cy="100" r="4" fill="currentColor" opacity="0.3" />
        <circle cx="120" cy="110" r="4" fill="currentColor" opacity="0.3" />
        <circle cx="90" cy="125" r="4" fill="currentColor" opacity="0.3" />
        <circle cx="110" cy="125" r="4" fill="currentColor" opacity="0.3" />
      </svg>
    ),

    Pepper: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path
          d="M90 60 Q85 65 85 75 Q80 95 75 115 Q70 135 75 155 Q80 170 95 175 Q110 178 120 170 Q128 160 130 145 Q132 120 128 95 Q125 75 120 65 Q115 58 105 55"
          fill="currentColor"
          opacity="0.15"
        />
        <path d="M100 55 Q98 45 95 40 L90 35" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.25" strokeLinecap="round" />
      </svg>
    ),

    Tomato: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="100" cy="110" r="45" fill="currentColor" opacity="0.15" />
        <path d="M80 70 L85 60 Q88 55 92 58 L95 65 M100 68 L100 58 Q100 53 105 58 L105 65 M115 70 L118 60 Q121 55 125 60 L122 68" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.25" strokeLinecap="round" />
      </svg>
    ),

    Plantain: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path
          d="M70 130 Q65 100 70 70 Q75 50 90 40 Q105 35 120 40 Q135 48 140 70 Q145 95 142 115 Q138 135 128 148 Q115 158 100 158 Q85 156 70 130 Z"
          fill="currentColor"
          opacity="0.15"
        />
        <path
          d="M70 130 Q65 100 70 70 Q75 50 90 40"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          opacity="0.25"
          strokeLinecap="round"
        />
      </svg>
    ),

    Rice: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <ellipse cx="100" cy="120" rx="50" ry="35" fill="currentColor" opacity="0.1" />
        <ellipse cx="85" cy="105" rx="8" ry="12" fill="currentColor" opacity="0.15" transform="rotate(-15 85 105)" />
        <ellipse cx="100" cy="100" rx="8" ry="12" fill="currentColor" opacity="0.2" transform="rotate(5 100 100)" />
        <ellipse cx="115" cy="105" rx="8" ry="12" fill="currentColor" opacity="0.15" transform="rotate(20 115 105)" />
        <ellipse cx="92" cy="120" rx="8" ry="12" fill="currentColor" opacity="0.18" transform="rotate(-10 92 120)" />
        <ellipse cx="108" cy="120" rx="8" ry="12" fill="currentColor" opacity="0.18" transform="rotate(10 108 120)" />
        <ellipse cx="100" cy="130" rx="8" ry="12" fill="currentColor" opacity="0.15" />
      </svg>
    ),

    ChickenLeg: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <ellipse cx="110" cy="90" rx="35" ry="45" fill="currentColor" opacity="0.15" transform="rotate(-25 110 90)" />
        <path
          d="M90 120 Q85 135 88 145 Q92 152 100 153 Q108 152 112 145 Q115 135 110 120"
          fill="currentColor"
          opacity="0.2"
        />
        <circle cx="100" cy="150" r="8" fill="currentColor" opacity="0.25" />
      </svg>
    ),

    Fish: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <ellipse cx="110" cy="100" rx="50" ry="25" fill="currentColor" opacity="0.15" />
        <path d="M60 100 L40 85 L40 115 Z" fill="currentColor" opacity="0.2" />
        <path d="M160 100 Q175 90 180 100 Q175 110 160 100" fill="currentColor" opacity="0.2" />
        <circle cx="140" cy="95" r="4" fill="currentColor" opacity="0.3" />
        <path d="M110 80 Q115 75 120 80" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.2" strokeLinecap="round" />
      </svg>
    ),

    Apple: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="95" cy="110" r="40" fill="currentColor" opacity="0.15" />
        <circle cx="110" cy="115" r="38" fill="currentColor" opacity="0.12" />
        <path d="M102 70 Q98 55 95 45" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.25" strokeLinecap="round" />
        <path d="M95 45 Q85 42 80 48 Q78 52 82 56" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.2" strokeLinecap="round" />
      </svg>
    ),

    Carrot: () => (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path
          d="M100 60 Q105 80 108 100 Q110 130 108 155 Q105 170 100 175 Q95 170 92 155 Q90 130 92 100 Q95 80 100 60 Z"
          fill="currentColor"
          opacity="0.15"
        />
        <path d="M95 60 L85 45 M100 58 L95 40 M105 60 L110 45" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.25" strokeLinecap="round" />
        <line x1="92" y1="90" x2="108" y2="90" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
        <line x1="92" y1="110" x2="108" y2="110" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
        <line x1="93" y1="130" x2="107" y2="130" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
      </svg>
    ),
  };
}
