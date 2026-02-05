import { Plus } from 'lucide-react';
import { Product, useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price);
  };

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} agregado al carrito`);
  };

  return (
    <div className="card-product group">
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
          className="absolute bottom-4 right-4 p-3 bg-primary text-primary-foreground rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-110"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
      <div className="p-4">
        <span className="text-xs uppercase tracking-wider text-primary font-medium">
          {product.category}
        </span>
        <h3 className="font-display text-lg font-semibold mt-1 text-foreground">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-muted-foreground text-sm">{product.weight}</span>
          <span className="text-lg font-semibold text-foreground">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </div>
  );
}
