"use client";

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface Marker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description?: string;
  category?: string;
  status?: string;
  onClick?: () => void;
}

interface YandexMapProps {
  markers?: Marker[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onMapClick?: (coords: [number, number]) => void;
  selectedMarkerId?: string | null;
}

declare global {
  interface Window {
    ymaps: any;
  }
}

export function YandexMap({
  markers = [],
  center = [52.2873, 76.9653], // Павлодар
  zoom = 12,
  height = '600px',
  onMapClick,
  selectedMarkerId
}: YandexMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;

    if (!apiKey) {
      setError('Ключ API Яндекс.Карт не найден. Добавьте NEXT_PUBLIC_YANDEX_MAPS_API_KEY в .env.local');
      setIsLoading(false);
      return;
    }

    // Load Yandex Maps API
    if (!window.ymaps) {
      const script = document.createElement('script');
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
      script.async = true;
      script.onload = () => {
        window.ymaps.ready(initMap);
      };
      script.onerror = () => {
        setError('Не удалось загрузить Яндекс.Карты');
        setIsLoading(false);
      };
      document.body.appendChild(script);
    } else {
      window.ymaps.ready(initMap);
    }

    function initMap() {
      if (!mapRef.current || mapInstanceRef.current) return;

      try {
        const map = new window.ymaps.Map(mapRef.current, {
          center: center,
          zoom: zoom,
          controls: ['zoomControl', 'fullscreenControl', 'geolocationControl']
        });

        mapInstanceRef.current = map;

        // Add click handler
        if (onMapClick) {
          map.events.add('click', (e: any) => {
            const coords = e.get('coords');
            onMapClick([coords[0], coords[1]]);
          });
        }

        setIsLoading(false);
      } catch (err) {
        setError('Ошибка инициализации карты');
        setIsLoading(false);
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, onMapClick]);

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || isLoading) return;

    // Remove old markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.geoObjects.remove(marker);
    });
    markersRef.current = [];

    // Add new markers
    markers.forEach(marker => {
      const placemark = new window.ymaps.Placemark(
        [marker.lat, marker.lng],
        {
          balloonContentHeader: marker.title,
          balloonContentBody: marker.description || '',
          hintContent: marker.title
        },
        {
          preset: getPresetByStatus(marker.status),
          iconColor: getColorByStatus(marker.status)
        }
      );

      if (marker.onClick) {
        placemark.events.add('click', marker.onClick);
      }

      // Highlight selected marker
      if (marker.id === selectedMarkerId) {
        placemark.options.set('iconColor', '#00BCD4');
      }

      mapInstanceRef.current.geoObjects.add(placemark);
      markersRef.current.push(placemark);
    });

    // Auto-fit bounds if markers exist
    if (markers.length > 0) {
      const bounds = mapInstanceRef.current.geoObjects.getBounds();
      if (bounds) {
        mapInstanceRef.current.setBounds(bounds, {
          checkZoomRange: true,
          zoomMargin: 50
        });
      }
    }
  }, [markers, selectedMarkerId, isLoading]);

  function getPresetByStatus(status?: string) {
    switch (status) {
      case 'pending': return 'islands#yellowCircleDotIcon';
      case 'in_progress': return 'islands#blueCircleDotIcon';
      case 'completed': return 'islands#greenCircleDotIcon';
      default: return 'islands#blueDotIcon';
    }
  }

  function getColorByStatus(status?: string) {
    switch (status) {
      case 'pending': return '#FBC02D';
      case 'in_progress': return '#00BCD4';
      case 'completed': return '#4CAF50';
      default: return '#00BCD4';
    }
  }

  if (error) {
    return (
      <div
        className="flex items-center justify-center bg-gradient-to-br from-card to-card-light rounded-lg"
        style={{ height }}
      >
        <div className="text-center max-w-md px-6">
          <MapPin className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 mb-2">{error}</p>
          <p className="text-sm text-gray-500">
            Получите бесплатный API ключ на{' '}
            <a
              href="https://developer.tech.yandex.ru/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              developer.tech.yandex.ru
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-card rounded-lg z-10">
          <div className="text-center">
            <div className="animate-spin text-primary text-4xl mb-4">⏳</div>
            <p className="text-gray-400">Загрузка карты...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full rounded-lg overflow-hidden" />
    </div>
  );
}
