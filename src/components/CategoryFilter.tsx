import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
}

const categories = ['All', 'Café', 'Dessert Shop', 'Restaurant', 'Grocery'];

const CategoryFilter = ({ selected, onChange }: CategoryFilterProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selected === category ? "default" : "outline"}
          onClick={() => onChange(category)}
          className="whitespace-nowrap transition-all"
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
