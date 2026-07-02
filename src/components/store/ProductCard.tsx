import { Plus } from "lucide-react";
import { Product, useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { triggerCartFeedback } from "@/lib/cartFeedback";

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
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  const triggerVisualFeedback = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX =
      "touches" in e ? e.touches[0]?.clientX ?? window.innerWidth / 2 : e.clientX;
    const clientY =
      "touches" in e ? e.touches[0]?.clientY ?? window.innerHeight / 2 : e.clientY;

    triggerCartFeedback(clientX, clientY);
  };

  const handleAddToCart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    triggerVisualFeedback(e);

    addToCart(product);
    toast.success(`${formatText(product.name)} agregado al carrito`, {
      description: "Se agregó al carrito correctamente",
    });
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: formatText(product.name),
    image: product.image,
    description: formatText(product.description),
    sku:
      product.id || `puesto-${product.name.toLowerCase().replace(/\s+/g, "-")}`,
    brand: { "@type": "Brand", name: "Puesto de Campo" },
    offers: {
      "@type": "Offer",
      url: typeof window !== "undefined" ? window.location.href : "",
      priceCurrency: "ARS",
      price: product.price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      priceValidUntil: "2026-12-31",
    },
  };

  return (
    <Link
      to={`/producto/${product.slug ?? product.id}`}
      className="card-product group block no-underline"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative aspect-square bg-muted overflow-hidden rounded-t-xl">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />

        {/* Desktop-only Hover Overlay */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Desktop-only Add Button with Fire Effect */}
        <button
          onClick={handleAddToCart}
          onTouchStart={handleAddToCart}
          className="hidden md:flex absolute bottom-4 right-4 p-3 bg-primary text-primary-foreground rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 active:scale-90 z-10 items-center justify-center"
          title="Agregar al carrito"
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
          <span className="text-muted-foreground text-sm">
            {product.weight}
          </span>
          <span className="text-lg font-semibold text-foreground">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </Link>
  );
}
