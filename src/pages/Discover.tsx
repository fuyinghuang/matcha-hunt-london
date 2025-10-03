import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Navigation } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import MatchaCard from "@/components/MatchaCard";
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
  distance?: number;
}

const Discover = () => {
  const [spots, setSpots] = useState<MatchaSpot[]>([]);
  const [filteredSpots, setFilteredSpots] = useState<MatchaSpot[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [findingLocation, setFindingLocation] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSpots();
  }, []);

  useEffect(() => {
    filterSpots();
  }, [spots, searchQuery, selectedCategory, userLocation]);

  const fetchSpots = async () => {
    try {
      const { data, error } = await supabase
        .from("matcha_spots")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSpots(data || []);
    } catch (error) {
      console.error("Error fetching spots:", error);
      toast({
        title: "Error loading spots",
        description: "Could not load matcha spots. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const filterSpots = () => {
    let filtered = spots;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((spot) => spot.type === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (spot) =>
          spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          spot.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          spot.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by distance if user location is available
    if (userLocation) {
      filtered = filtered
        .map((spot) => ({
          ...spot,
          distance: calculateDistance(
            userLocation.lat,
            userLocation.lng,
            spot.lat,
            spot.lng
          ),
        }))
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    setFilteredSpots(filtered);
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
            description: "Showing nearest matcha spots",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setFindingLocation(false);
          toast({
            title: "Location access denied",
            description: "Please enable location services to find nearby spots",
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
    <div className="min-h-screen matcha-gradient pb-20">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="mb-6 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            🍵 Matcha Hunting London
          </h1>
          <p className="text-muted-foreground">
            Discover the best matcha spots in the city
          </p>
        </header>

        {/* Search and Filters */}
        <div className="space-y-4 mb-6 animate-slide-up">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search matcha spots..."
          />
          
          <div className="flex gap-2">
            <CategoryFilter
              selected={selectedCategory}
              onChange={setSelectedCategory}
            />
            <Button
              variant="outline"
              onClick={findNearMe}
              disabled={findingLocation}
              className="whitespace-nowrap"
            >
              {findingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4" />
              )}
              <span className="ml-2">Near Me</span>
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-4">
          {filteredSpots.length} {filteredSpots.length === 1 ? 'spot' : 'spots'} found
        </p>

        {/* Matcha Spots Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredSpots.map((spot) => (
            <MatchaCard
              key={spot.id}
              name={spot.name}
              type={spot.type}
              description={spot.description || ""}
              address={spot.address}
              image={spot.image || ""}
              website={spot.website}
              distance={userLocation ? spot.distance : undefined}
              lat={spot.lat}
              lng={spot.lng}
            />
          ))}
        </div>

        {filteredSpots.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No matcha spots found. Try adjusting your filters!
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Discover;
