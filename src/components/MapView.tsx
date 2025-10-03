import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ExternalLink } from "lucide-react";

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MatchaSpot {
  id: string;
  name: string;
  type: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  image: string;
  website?: string;
}

interface MapViewProps {
  spots: MatchaSpot[];
  userLocation?: { lat: number; lng: number };
}

const MapView = ({ spots, userLocation }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<MatchaSpot | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    // Initialize map centered on London
    const map = L.map(mapContainer.current).setView([51.5074, -0.1278], 12);
    mapRef.current = map;

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        layer.remove();
      }
    });

    // Add matcha spot markers
    spots.forEach((spot) => {
      if (spot.lat && spot.lng) {
        const marker = L.marker([spot.lat, spot.lng])
          .addTo(mapRef.current!)
          .on("click", () => setSelectedSpot(spot));
        
        marker.bindPopup(`<strong>${spot.name}</strong><br/>${spot.type}`);
      }
    });

    // Add user location marker if available
    if (userLocation) {
      const userIcon = L.divIcon({
        className: "user-location-marker",
        html: '<div style="background: #4ade80; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(74, 222, 128, 0.5);"></div>',
        iconSize: [16, 16],
      });

      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(mapRef.current!)
        .bindPopup("Your location");
      
      mapRef.current?.setView([userLocation.lat, userLocation.lng], 13);
    }
  }, [spots, userLocation]);

  const typeColors = {
    'Café': 'bg-primary/10 text-primary border-primary/20',
    'Dessert Shop': 'bg-accent/10 text-accent border-accent/20',
    'Restaurant': 'bg-secondary/30 text-secondary-foreground border-secondary',
    'Grocery': 'bg-muted text-muted-foreground border-border'
  };

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full rounded-lg" />
      
      {selectedSpot && (
        <Card className="absolute bottom-4 left-4 right-4 p-4 max-w-md mx-auto shadow-lg z-[1000] animate-slide-up">
          <div className="flex gap-3">
            <img 
              src={selectedSpot.image} 
              alt={selectedSpot.name}
              className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-sm truncate">{selectedSpot.name}</h3>
                <Badge variant="outline" className={`text-xs ${typeColors[selectedSpot.type as keyof typeof typeColors]}`}>
                  {selectedSpot.type}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {selectedSpot.description}
              </p>
              <div className="flex flex-col gap-1">
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedSpot.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:text-accent transition-colors"
                >
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{selectedSpot.address}</span>
                </a>
                {selectedSpot.website && (
                  <a 
                    href={selectedSpot.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:text-accent transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>Website</span>
                  </a>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setSelectedSpot(null)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </Card>
      )}
    </div>
  );
};

export default MapView;
