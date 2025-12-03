import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface LocationAutocompleteProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function LocationAutocomplete({
  value,
  onChange,
  placeholder = 'Enter location',
  required = false,
  className = ''
}: LocationAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [autocompleteElement, setAutocompleteElement] = useState<any>(null);

  // Set your Google Maps API key here (optional - works as regular input without it)
  const GOOGLE_MAPS_API_KEY = ''; // Leave empty to use as regular input

  useEffect(() => {
    // If no API key, just use regular input
    if (!GOOGLE_MAPS_API_KEY) {
      return;
    }

    // Check if already loaded
    if (typeof window !== 'undefined' && window.google?.maps?.places) {
      setIsLoaded(true);
      return;
    }

    // Load Google Maps API with async and callback
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&loading=async&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;

    // Define callback
    (window as any).initGoogleMaps = () => {
      setIsLoaded(true);
    };

    document.head.appendChild(script);

    return () => {
      delete (window as any).initGoogleMaps;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !containerRef.current || autocompleteElement || !GOOGLE_MAPS_API_KEY) return;

    try {
      // Use the new PlaceAutocompleteElement
      const placeAutocomplete = new (window.google.maps.places as any).PlaceAutocompleteElement({
        componentRestrictions: { country: 'ng' }, // Restrict to Nigeria
        fields: ['formatted_address', 'address_components', 'geometry'],
      });

      // Add event listener for place selection
      placeAutocomplete.addEventListener('gmp-placeselect', async (event: any) => {
        const place = event.place;
        if (place && place.formattedAddress) {
          // Create synthetic event
          const syntheticEvent = {
            target: {
              value: place.formattedAddress,
            },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        }
      });

      // Append to container
      if (containerRef.current && !autocompleteElement) {
        containerRef.current.appendChild(placeAutocomplete);
        setAutocompleteElement(placeAutocomplete);
      }
    } catch (error) {
      console.error('Error initializing Google Maps PlaceAutocomplete:', error);
    }
  }, [isLoaded, autocompleteElement, onChange]);

  // If Google Maps is enabled and loaded, hide the regular input
  const shouldShowGoogleMapsInput = GOOGLE_MAPS_API_KEY && isLoaded;

  return (
    <div className="relative">
      {/* Google Maps Autocomplete Element Container */}
      {GOOGLE_MAPS_API_KEY && (
        <div 
          ref={containerRef} 
          className={shouldShowGoogleMapsInput ? 'block' : 'hidden'}
          style={{
            width: '100%',
          }}
        />
      )}
      
      {/* Regular Input (fallback or when Google Maps is not enabled) */}
      <div className={shouldShowGoogleMapsInput ? 'hidden' : 'block relative'}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={className}
        />
        <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}