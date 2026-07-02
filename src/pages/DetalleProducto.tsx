import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/contexts/CartContext";
import { getProducts } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, ShieldCheck, Truck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { triggerCartFeedback } from "@/lib/cartFeedback";
import { PurchaseSelector } from "@/components/store/PurchaseSelector";
import { PurchaseSelection, getPurchaseSelection, isWholeChickenProduct } from "@/lib/purchase";

const DetalleProducto = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseSelection | null>(null);

  // Scroll to top automatically when the page opens
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const product = products?.find((p) => p.slug === slug || p.id === slug);
  const isWholeChicken = product ? isWholeChickenProduct(product) : false;

  /**
   * Helper to trigger subtle haptic feedback
   * 15ms feels like a high-end mechanical "tick"
   */
  const triggerVibration = (ms = 15) => {
    if (
      typeof window !== "undefined" &&
      window.navigator &&
      window.navigator.vibrate
    ) {
      window.navigator.vibrate(ms);
    }
  };

  const triggerVisualFeedback = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY =
      "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    triggerCartFeedback(clientX, clientY);
  };

  const handleAddToCart = (e: React.MouseEvent | React.TouchEvent) => {
    if (product) {
      triggerVibration(15); // Subtle haptic tick
      triggerVisualFeedback(e);
      const selection = selectedPurchase ?? getPurchaseSelection(product, 1);
      addToCart(product, selection);
      toast.success(`${product.name} agregado`, {
        description: "Se agregó al carrito correctamente",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );

  if (!product)
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
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
      </Layout>
    );

  return (
    <Layout>
      <div className="min-h-screen w-full bg-background animate-in fade-in duration-500">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-20 pb-32 md:pb-20">
          {/* Back Button with haptic feel */}
          <button
            onClick={() => {
              triggerVibration(10);
              navigate(-1);
            }}
            className="flex items-center text-muted-foreground hover:text-primary transition-colors mb-6 group w-fit"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
            {/* Image Section */}
            <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-muted shadow-2xl border border-border group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Info Section */}
            <div className="flex flex-col space-y-6 md:space-y-8">
              <div className="space-y-3 md:space-y-4">
                <span className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">
                  {product.category}
                </span>
                <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground leading-[1.1]">
                  {product.name}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed italic border-l-2 border-primary/20 pl-4">
                  {product.description}
                </p>
              </div>

              {/* Price and Weight */}
              <div className="flex items-center justify-between md:justify-start gap-6 bg-muted/30 p-4 rounded-2xl md:bg-transparent md:p-0">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                    Precio
                  </span>
                  <span className="text-3xl md:text-5xl font-bold text-foreground tracking-tighter">
                    {isWholeChicken ? "A definir" : formatPrice(product.price)}
                  </span>
                </div>
                <div className="h-10 w-px bg-border hidden md:block" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                    Peso
                  </span>
                  <span className="text-xl md:text-2xl font-medium text-foreground/80">
                    {product.weight}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <PurchaseSelector product={product} onSelectionChange={setSelectedPurchase} />
              </div>

              {/* Desktop Add Button */}
              <div className="hidden md:block pt-4">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="w-[320px] h-16 text-xl font-bold gap-3 rounded-2xl shadow-xl hover:shadow-primary/30 transition-all active:scale-95"
                >
                  <Plus className="h-6 w-6" />
                  Añadir al carrito
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-border">
                <div className="flex items-center space-x-3 group">
                  <div className="p-3 bg-primary/5 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Truck className="h-5 w-5" />
                  </div>
                  <span className="text-xs md:text-sm font-semibold leading-tight text-muted-foreground">
                    Envíos a todo
                    <br />
                    <span className="text-foreground">Río Cuarto</span>
                  </span>
                </div>
                <div className="flex items-center space-x-3 group">
                  <div className="p-3 bg-primary/5 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <span className="text-xs md:text-sm font-semibold leading-tight text-muted-foreground">
                    Calidad 100%
                    <br />
                    <span className="text-foreground">Asegurada</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Action Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border z-50 animate-in slide-in-from-bottom duration-500">
          <div className="max-w-md mx-auto flex items-center gap-4">
            <div className="flex-1">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-none mb-1">
                Total
              </p>
              <p className="text-xl font-bold text-foreground leading-none">
                {isWholeChicken ? "A definir" : formatPrice(product.price)}
              </p>
            </div>
            <Button
              onClick={handleAddToCart}
              className="flex-[2] h-14 text-base font-bold gap-2 rounded-xl shadow-lg active:scale-95 touch-none"
            >
              <Plus className="h-5 w-5" />
              Añadir al carrito
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DetalleProducto;
