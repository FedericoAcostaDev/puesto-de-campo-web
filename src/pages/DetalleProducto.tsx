import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/contexts/CartContext";
import { getProducts } from "@/data/products"; // Importamos tu función de fetch
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, ShieldCheck, Truck, Loader2 } from "lucide-react";
import { toast } from "sonner";

const DetalleProducto = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // 1. Usamos useQuery para obtener los productos. 
  // Gracias a la caché que configuraste en App.tsx, esto no hará una 
  // nueva petición si ya viniste desde la Tienda.
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  // 2. Buscamos el producto específico dentro del array que devuelve la caché
  const product = products?.find((p) => p.id === id);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast.success(`${product.name} agregado al carrito`);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price);
  };

  // Estado de carga
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Si no se encuentra el producto
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-semibold italic text-muted-foreground">Producto no encontrado</h2>
        <Button onClick={() => navigate("/tienda")} variant="link" className="mt-2 text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a la tienda
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background animate-in fade-in duration-500 pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        {/* Navegación */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Imagen */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted shadow-xl border border-border">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                {product.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground leading-tight">
                {product.name}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed italic">
                {product.description}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              <span className="px-3 py-1 rounded-md bg-muted text-muted-foreground font-medium">
                {product.weight}
              </span>
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleAddToCart} 
                size="lg" 
                className="w-full md:w-[300px] h-16 text-xl font-bold gap-3 rounded-2xl shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
              >
                <Plus className="h-6 w-6" />
                Añadir al carrito
              </Button>
            </div>

            {/* Garantías */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-border">
              <div className="flex items-center space-x-3 text-sm">
                <div className="p-2 bg-primary/5 rounded-lg text-primary">
                  <Truck className="h-5 w-5" />
                </div>
                <span className="font-medium">Envíos directos de campo</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="p-2 bg-primary/5 rounded-lg text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span className="font-medium">Calidad 100% Artesanal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;