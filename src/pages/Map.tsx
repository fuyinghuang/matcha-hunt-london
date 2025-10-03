import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Navigation } from "lucide-react";
import MapView from "@/components/MapView";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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

const Map = () => {
  const [spots, setSpots] = useState<MatchaSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [findingLocation, setFindingLocation] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSpots();
  }, []);

  const fetchSpots = async () => {
    try {
      const { data, error } = await supabase
        .from("matcha_spots")
        .select("*")
        .not("lat", "is", null)
        .not("lng", "is", null);

      if (error) throw error;
      setSpots(data || []);
    } catch (error) {
      console.error("Error fetching spots:", error);
      toast({
        title: "Error loading map",
        description: "Could not load matcha spots. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const findNearMe = () => {
    setFindingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setFindingLocation(false);
          toast({
            title: "Location found",
            description: "Map centered on your location",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setFindingLocation(false);
          toast({
            title: "Location access denied",
            description: "Please enable location services",
            variant: "destructive",
          });
        }
      );
    } else {
      setFindingLocation(false);
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center matcha-gradient">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col matcha-gradient">
      <div className="flex-1 relative pb-16">
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 z-[1000] flex items-center justify-between gap-4">
          <div className="glass-effect rounded-lg px-4 py-3 shadow-card">
            <h1 className="text-xl font-bold text-foreground">
              🍵 Matcha Map
            </h1>
          </div>
          <Button
            onClick={findNearMe}
            disabled={findingLocation}
            className="shadow-card"
          >
            {findingLocation ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Navigation className="h-4 w-4" />
            )}
            <span className="ml-2">Find Me</span>
          </Button>
        </div>

        {/* Map */}
        <MapView spots={spots} userLocation={userLocation} />
      </div>

      <BottomNav />
    </div>
  );
};

export default Map;
