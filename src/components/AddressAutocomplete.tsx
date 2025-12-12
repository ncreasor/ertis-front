"use client";

import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface Suggestion {
  value: string;
  data: {
    geo_lat: string;
    geo_lon: string;
  };
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onCoordinatesChange?: (lat: number, lng: number) => void;
  placeholder?: string;
  className?: string;
}

declare global {
  interface Window {
    ymaps: any;
  }
}

export function AddressAutocomplete({
  value,
  onChange,
  onCoordinatesChange,
  placeholder = "Введите адрес",
  className = ""
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestRef = useRef<any>(null);
  const [ymapsReady, setYmapsReady] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;

    if (!apiKey) {
      setError('Ключ API не найден');
      return;
    }

    // Load Yandex Maps API
    if (!window.ymaps) {
      const script = document.createElement('script');
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU&suggest_apikey=${apiKey}`;
      script.async = true;
      script.onload = () => {
        window.ymaps.ready(() => {
          setYmapsReady(true);
        });
      };
      script.onerror = () => {
        setError('Не удалось загрузить API');
      };
      document.body.appendChild(script);
    } else {
      window.ymaps.ready(() => {
        setYmapsReady(true);
      });
    }
  }, []);

  useEffect(() => {
    if (!ymapsReady || !value || value.length < 2) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const searchQuery = value.toLowerCase().includes('павлодар') ? value : `Павлодар, ${value}`;
        const results = await window.ymaps.suggest(searchQuery, {
          results: 5
        });

        setSuggestions(results || []);
        setShowSuggestions(results && results.length > 0);
      } catch (err) {
        console.error('Suggest error:', err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [value, ymapsReady]);

  const handleSuggestionClick = async (suggestion: any) => {
    onChange(suggestion.displayName);
    setShowSuggestions(false);
    setSuggestions([]);

    // Get coordinates
    if (onCoordinatesChange) {
      try {
        const geocode = await window.ymaps.geocode(suggestion.displayName);
        const firstGeoObject = geocode.geoObjects.get(0);
        if (firstGeoObject) {
          const coords = firstGeoObject.geometry.getCoordinates();
          onCoordinatesChange(coords[0], coords[1]);
        }
      } catch (err) {
        console.error('Geocode error:', err);
      }
    }
  };

  const handleBlur = () => {
    // Delay to allow click on suggestion
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  if (error) {
    return (
      <div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={className}
        />
        <p className="text-xs text-red-400 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => value.length >= 3 && suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={className}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-card border border-white/10 rounded-lg shadow-lg overflow-hidden">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0 flex items-start gap-3"
            >
              <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">{suggestion.displayName}</p>
                {suggestion.value && (
                  <p className="text-gray-500 text-xs truncate">{suggestion.value}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
