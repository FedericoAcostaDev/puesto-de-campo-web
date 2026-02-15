import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/store/ProductCard';
import { getProducts, categories } from '@/data/products';
import { Product } from '@/contexts/CartContext';

// --- COMPONENTE SKELETON (Efecto de carga) ---
const ProductSkeleton = () => (
  <div className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
    <div className="aspect-square bg-muted" /> {/* Espacio de la imagen */}
    <div className="p-5 space-y-3">
      <div className="h-4 bg-muted rounded w-1/2" /> {/* Título */}
      <div className="h-3 bg-muted rounded w-full" /> {/* Descripción línea 1 */}
      <div className="h-3 bg-muted rounded w-5/6" /> {/* Descripción línea 2 */}
      <div className="flex justify-between items-center pt-4">
        <div className="h-6 bg-muted rounded w-1/4" /> {/* Precio */}
        <div className="h-10 bg-muted rounded w-1/3" /> {/* Botón */}
      </div>
    </div>
  </div>
);

export default function Tienda() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getProducts();
        setAllProducts(data);
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        // Añadimos un pequeño delay artificial para que el skeleton no parpadee demasiado rápido
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
          
          {/* Categorías */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground border border-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid de Productos con Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              // Mostramos 8 esqueletos mientras carga
              Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
            ) : (
              // Mostramos los productos reales
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No encontramos cortes en esta categoría.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}