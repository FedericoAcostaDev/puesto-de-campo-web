import { Plus } from 'lucide-react';
import { Product, useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
// 1. Importamos Link de react-router-dom
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const formatText = (text: string) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price);
  };

  // 2. Modificamos el handler para evitar que el click en el botón 
  // dispare el Link del padre (bubbling)
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita la navegación si el botón está dentro de un Link
    e.stopPropagation(); // Detiene la propagación del evento
    addToCart(product);
    toast.success(`${formatText(product.name)} agregado al carrito`);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": formatText(product.name),
    "image": product.image,
    "description": formatText(product.description),
    "sku": product.id || `puesto-${product.name.toLowerCase().replace(/\s+/g, '-')}`,
    "brand": { "@type": "Brand", "name": "Puesto de Campo" },
    "offers": {
      "@type": "Offer",
      "url": typeof window !== "undefined" ? window.location.href : "",
      "priceCurrency": "ARS",
      "price": product.price,
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "priceValidUntil": "2026-12-31"
    }
  };

  return (
    // 3. Envolvemos todo el contenido en un Link apuntando a la ruta dinámica
    <Link to={`/producto/${product.id}`} className="card-product group block no-underline">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative aspect-square bg-muted overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <button
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 p-3 bg-primary text-primary-foreground rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 z-10"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
      
      <div className="p-4">
        <span className="text-xs uppercase tracking-wider text-primary font-medium">
          {product.category}
        </span>
        
        <h3 className="font-display text-lg font-semibold mt-1 text-foreground">
          {formatText(product.name)}
        </h3>
        
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {formatText(product.description)}
        </p>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-muted-foreground text-sm">{product.weight}</span>
          <span className="text-lg font-semibold text-foreground">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </Link>
  );
}