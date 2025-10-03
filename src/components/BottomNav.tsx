import { Home, Map, PlusCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Discover' },
    { path: '/map', icon: Map, label: 'Map' },
    { path: '/submit', icon: PlusCircle, label: 'Submit' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-lg transition-all ${
                  isActive 
                    ? 'text-primary scale-105' 
                    : 'text-muted-foreground hover:text-foreground hover:scale-105'
                }`}
              >
                <Icon className={`h-6 w-6 ${isActive ? 'fill-primary/20' : ''}`} />
                <span className="text-xs font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
