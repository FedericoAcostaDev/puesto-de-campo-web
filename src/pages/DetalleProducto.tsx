import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/contexts/CartContext";
import { getProducts } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, ShieldCheck, Truck, Loader2 } from "lucide-react";
import { toast } from "sonner";

const DetalleProducto = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const product = products?.find((p) => p.id === id);

  /**
   * Generates the fire spark effect at the click/tap location
   */
  const triggerFireEffect = (e: React.MouseEvent | React.TouchEvent) => {
    const particleCount = 12;
    const colors = ["#ff4500", "#ff8c00", "#ffd700", "#ffffff"];

    // Get coordinates for both mouse and touch events
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("span");
      const size = Math.random() * 8 + 4 + "px";
      const color = colors[Math.floor(Math.random() * colors.length)];

      particle.style.width = size;
      particle.style.height = size;
      particle.style.backgroundColor = color;
      particle.style.position = "fixed";
      particle.style.borderRadius = "50%";
      particle.style.pointerEvents = "none";
      particle.style.zIndex = "9999";
      particle.style.boxShadow = `0 0 12px ${color}`;

      particle.style.left = `${clientX}px`;
      particle.style.top = `${clientY}px`;

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 90 + 40;
      const destX = Math.cos(angle) * velocity;
      const destY = Math.sin(angle) * velocity;

      particle.animate(
        [
          { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
          {
            transform: `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) scale(0)`,
            opacity: 0,
          },
        ],
        {
          duration: 800,
          easing: "cubic-bezier(0.1, 0.8, 0.3, 1)",
          fill: "forwards",
        },
      );

      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 800);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    if (product) {
      triggerFireEffect(e);
      addToCart(product);
      toast.success(`${product.name} agregado al carrito`);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-semibold italic text-muted-foreground">
          Producto no encontrado
        </h2>
        <Button
          onClick={() => navigate("/tienda")}
          variant="link"
          className="mt-2 text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a la tienda
        </Button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-background animate-in fade-in duration-500 overflow-hidden flex flex-col">
      <div className="max-w-7xl mx-auto px-4 h-full w-full flex flex-col justify-center py-4 md:py-0">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-muted-foreground hover:text-primary transition-colors mb-4 md:mb-6 group w-fit"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="relative aspect-square md:max-h-[70dvh] rounded-3xl overflow-hidden bg-muted shadow-xl border border-border">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col space-y-4 md:space-y-6">
            <div className="space-y-2 md:space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
                {product.name}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed italic line-clamp-3">
                {product.description}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl md:text-4xl font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              <span className="px-3 py-1 rounded-md bg-muted text-muted-foreground text-sm font-medium">
                {product.weight}
              </span>
            </div>

            <div className="pt-2">
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full md:w-[280px] h-14 md:h-16 text-lg md:text-xl font-bold gap-3 rounded-2xl shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
              >
                <Plus className="h-5 w-5 md:h-6 md:w-6" />
                Añadir al carrito
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
              <div className="flex items-center space-x-2 text-[11px] md:text-xs">
                <div className="p-1.5 bg-primary/5 rounded-lg text-primary">
                  <Truck className="h-4 w-4" />
                </div>
                <span className="font-medium leading-tight">
                  Envíos a todo
                  <br />
                  Río Cuarto
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] md:text-xs">
                <div className="p-1.5 bg-primary/5 rounded-lg text-primary">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span className="font-medium leading-tight">
                  Calidad 100%
                  <br />
                  asegurada
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;
