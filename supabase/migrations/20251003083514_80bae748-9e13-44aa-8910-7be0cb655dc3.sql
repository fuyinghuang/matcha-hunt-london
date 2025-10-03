-- Create matcha_spots table
CREATE TABLE public.matcha_spots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Café', 'Dessert Shop', 'Restaurant', 'Grocery')),
  description TEXT,
  image TEXT,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.matcha_spots ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read matcha spots
CREATE POLICY "Anyone can view matcha spots"
  ON public.matcha_spots
  FOR SELECT
  USING (true);

-- Create policy to allow anyone to submit new spots
CREATE POLICY "Anyone can submit matcha spots"
  ON public.matcha_spots
  FOR INSERT
  WITH CHECK (true);

-- Create index for type filtering
CREATE INDEX idx_matcha_spots_type ON public.matcha_spots(type);

-- Create index for geolocation queries
CREATE INDEX idx_matcha_spots_location ON public.matcha_spots(lat, lng);

-- Insert sample matcha spots in London
INSERT INTO public.matcha_spots (name, type, description, address, lat, lng, image, website) VALUES
('Tsujiri London', 'Café', 'Authentic Japanese matcha café serving premium matcha drinks and desserts', '1 Leicester Square, London WC2H 7NA', 51.5101, -0.1301, 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=800&auto=format&fit=crop', 'https://tsujiri.co.uk'),
('Tombo', 'Café', 'Minimalist Japanese café with exceptional matcha lattes and matcha soft serve', '41-42 Shorts Gardens, London WC2H 9AB', 51.5148, -0.1259, 'https://images.unsplash.com/photo-1578374173703-26e0da126c2c?w=800&auto=format&fit=crop', null),
('Koya Bar', 'Restaurant', 'Japanese restaurant with excellent matcha desserts and traditional tea service', '50 Frith Street, London W1D 4SQ', 51.5137, -0.1321, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop', null),
('Japan Centre', 'Grocery', 'Japanese supermarket with wide selection of premium matcha powder and matcha products', '19 Shaftesbury Avenue, London W1D 7ED', 51.5110, -0.1324, 'https://images.unsplash.com/photo-1524350876685-274059332603?w=800&auto=format&fit=crop', 'https://japancentre.com'),
('Cafe Kitsuné', 'Café', 'Parisian-Japanese fusion café known for their signature matcha latte', '2 Rickett Street, London SW6 1RU', 51.4818, -0.1916, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop', null),
('Kanada-Ya', 'Restaurant', 'Ramen restaurant offering rich matcha ice cream and matcha tiramisu', '64 St Giles High Street, London WC2H 8LE', 51.5155, -0.1280, 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800&auto=format&fit=crop', null),
('Cha Cha Matcha', 'Dessert Shop', 'Instagram-worthy matcha dessert shop with creative matcha soft serve and cakes', '123 Kensington High Street, London W8 5SF', 51.4994, -0.1909, 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop', null),
('Whole Foods Market', 'Grocery', 'Organic grocery store stocking various matcha brands and matcha-infused products', '20 Glasshouse Street, London W1B 5AR', 51.5103, -0.1347, 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop', 'https://wholefoodsmarket.co.uk');