import { MapPin, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MatchaCardProps {
  name: string;
  type: string;
  description: string;
  address: string;
  image: string;
  website?: string;
  distance?: number;
  lat?: number;
  lng?: number;
}

const MatchaCard = ({ 
  name, 
  type, 
  description, 
  address, 
  image, 
  website,
  distance 
}: MatchaCardProps) => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  
  const typeColors = {
    'Café': 'bg-primary/10 text-primary border-primary/20',
    'Dessert Shop': 'bg-accent/10 text-accent border-accent/20',
    'Restaurant': 'bg-secondary/30 text-secondary-foreground border-secondary',
    'Grocery': 'bg-muted text-muted-foreground border-border'
  };

  return (
    <Card className="overflow-hidden card-hover bg-card">
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-xl font-semibold text-card-foreground">{name}</h3>
          <Badge variant="outline" className={typeColors[type as keyof typeof typeColors] || typeColors['Café']}>
            {type}
          </Badge>
        </div>
        
        {distance && (
          <p className="text-sm text-muted-foreground mb-2">
            📍 {distance.toFixed(1)} km away
          </p>
        )}
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="flex flex-col gap-2">
          <a 
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:text-accent transition-colors group"
          >
            <MapPin className="h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
            <span className="line-clamp-1">{address}</span>
          </a>
          
          {website && (
            <a 
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:text-accent transition-colors group"
            >
              <ExternalLink className="h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
              <span>Visit website</span>
            </a>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MatchaCard;
