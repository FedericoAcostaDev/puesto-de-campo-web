import { useState, useEffect } from 'react'; // Añadimos useEffect
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/store/ProductCard';
import { getProducts, categories } from '@/data/products'; // Usamos getProducts
import { Product } from '@/contexts/CartContext'; // Importamos el tipo para el estado

export default function Tienda() {
  // 1. Estados para los productos y el estado de carga
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // 2. Efecto para cargar los productos al montar el componente
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getProducts();
        setAllProducts(data);
      } catch (error) {
        console.error("Error al cargar productos de Google Sheets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // 3. El filtrado ahora usa 'allProducts' que viene del estado
  const filteredProducts =
    selectedCategory === 'Todos'
      ? allProducts
      : allProducts.filter((product) => product.category === selectedCategory);

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
            Nuestra <span className="text-primary">Tienda</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explorá nuestra selección de cortes premium y embutidos artesanales. 
            Cada producto es seleccionado con el mayor cuidado.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium uppercase tracking-wider transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground hover:text-foreground border border-border hover:border-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Product Grid / Loading State */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Cargando cortes del campo...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No hay productos en esta categoría.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Info Banner */}
      <section className="py-12 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Envío Refrigerado
              </h3>
              <p className="text-muted-foreground">
                Mantenemos la cadena de frío en todo el proceso
              </p>
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Pago Seguro
              </h3>
              <p className="text-muted-foreground">
                Múltiples métodos de pago para tu comodidad
              </p>
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Calidad Garantizada
              </h3>
              <p className="text-muted-foreground">
                Si no estás satisfecho, te devolvemos tu dinero
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}