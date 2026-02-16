import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/store/ProductCard';
import { getProducts } from '@/data/products';
import { Product } from '@/contexts/CartContext';
// Importamos un icono de flecha (asumiendo que usas lucide-react o similar, si no, puedes usar un texto "^")
import { ArrowUp } from 'lucide-react'; 

const ProductSkeleton = () => (
  <div className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
    <div className="aspect-square bg-muted" />
    <div className="p-3 md:p-5 space-y-3">
      <div className="h-4 bg-muted rounded w-1/2" />
      <div className="h-3 bg-muted rounded w-full" />
      <div className="flex justify-between items-center pt-4">
        <div className="h-6 bg-muted rounded w-1/4" />
        <div className="h-10 bg-muted rounded w-1/3" />
      </div>
    </div>
  </div>
);

export default function Tienda() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [dynamicCategories, setDynamicCategories] = useState<string[]>(['Todos']);
  
  // --- ESTADO PARA EL BOTÓN "VOLVER ARRIBA" ---
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getProducts();
        setAllProducts(data);
        const rawCategories = data.map((p) => p.category);
        const uniqueCategories = Array.from(new Set(rawCategories)).filter(Boolean);
        setDynamicCategories(['Todos', ...uniqueCategories.sort()]);
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchItems();

    // Lógica para mostrar/ocultar botón flotante
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts =
    selectedCategory === 'Todos'
      ? allProducts
      : allProducts.filter((p) => p.category === selectedCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
            Nuestra <span className="text-primary">Tienda</span>
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-background relative">
        <div className="container mx-auto px-4">
          
          {/* Categorías Dinámicas */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
            {dynamicCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-card text-muted-foreground border border-border hover:border-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid de Productos - CAMBIO AQUÍ: grid-cols-2 */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
            ) : (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No encontramos cortes en esta categoría.</p>
            </div>
          )}
        </div>
      </section>

      {/* BOTÓN FLOTANTE */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-6 z-50 p-4 bg-primary text-primary-foreground rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 animate-in fade-in zoom-in"
          aria-label="Volver arriba"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </Layout>
  );
}