import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Category {
  name: string;
  image?: string;
  description?: string;
}

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const formatText = (text: string) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  return (
    <Link
      to={`/tienda?category=${encodeURIComponent(category.name)}`}
      className="group card-product cursor-pointer"
    >
      <div className="relative w-full aspect-square bg-muted overflow-hidden">
        <img
          src={category.image || "/products/no-image.jpeg"}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4 md:p-6 space-y-2">
        <h3 className="font-display text-lg md:text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
          {formatText(category.name)}
        </h3>
        {category.description && (
          <p className="text-sm md:text-base text-muted-foreground line-clamp-2">
            {category.description}
          </p>
        )}
        <div className="pt-2 flex items-center gap-2 text-primary font-semibold text-sm">
          Ver categoría
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
