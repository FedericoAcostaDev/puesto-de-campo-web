import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/store/ProductCard';
import { getProducts } from '@/data/products'; // Quitamos 'categories' estático
import { Product } from '@/contexts/CartContext';

// --- COMPONENTE SKELETON (Efecto de carga) ---
const ProductSkeleton = () => (
  <div className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
    <div className="aspect-square bg-muted" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-muted rounded w-1/2" />
      <div className="h-3 bg-muted rounded w-full" />
      <div className="h-3 bg-muted rounded w-5/6" />
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
  // Nuevo estado para las categorías dinámicas
  const [dynamicCategories, setDynamicCategories] = useState<string[]>(['Todos']);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getProducts();
        setAllProducts(data);

        // --- LÓGICA DE CATEGORÍAS DINÁMICAS ---
        // 1. Extraemos todas las categorías de los productos
        const rawCategories = data.map((p) => p.category);
        // 2. Quitamos duplicados con Set y filtramos valores vacíos
        const uniqueCategories = Array.from(new Set(rawCategories)).filter(Boolean);
        // 3. Ordenamos alfabéticamente y agregamos 'Todos' al principio
        setDynamicCategories(['Todos', ...uniqueCategories.sort()]);
        
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchItems();
  }, []);

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
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          
          {/* Categorías Dinámicas */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {dynamicCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-card text-muted-foreground border border-border hover:border-primary hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid de Productos con Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    </Layout>
  );
}