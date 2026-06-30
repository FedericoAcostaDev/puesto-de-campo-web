import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/store/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { ArrowUp } from "lucide-react";

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
  const { products, loading, isRefreshing } = useProducts();
  const [searchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // --- NEW: Scroll to top on Mount ---
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- NEW: Leer categoría de los parámetros de query ---
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(decodeURIComponent(categoryParam));
    }
  }, [searchParams]);

  // Lógica de Scroll para el botón flotante
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const categoriesConfig = useMemo(() => {
    if (!products.length) return { featured: [], main: [], other: [] };

    const rawCategories = products
      .map((p) => p.category)
      .filter(Boolean);
    const uniqueCategories = Array.from(new Set(rawCategories));

    const mainOrder = ["Vacuno", "Achura", "Cerdo", "Pollo", "Milanesas", "Embutidos"];
    const offertasIndex = uniqueCategories.findIndex(
      (cat) => cat.toLowerCase() === "ofertas"
    );

    const featured = offertasIndex !== -1 ? [uniqueCategories[offertasIndex]] : [];
    
    const main = mainOrder.filter((cat) =>
      uniqueCategories.some((ucat) => ucat.toLowerCase() === cat.toLowerCase())
    );

    const other = uniqueCategories.filter(
      (cat) =>
        cat.toLowerCase() !== "ofertas" &&
        !main.some((m) => m.toLowerCase() === cat.toLowerCase())
    );

    return { featured, main, other };
  }, [products]);

  const filteredProducts = useMemo(() => {
    return selectedCategory === "Todos"
      ? products
      : products.filter((p) => p.category === selectedCategory);
  }, [selectedCategory, products]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
            Nuestra <span className="text-primary">Tienda</span>
          </h1>
          {isRefreshing && (
            <p className="text-xs text-primary animate-pulse">
              Actualizando stock en tiempo real...
            </p>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-background relative">
        <div className="container mx-auto px-4">
          {/* Ofertas - Destacada */}
          {categoriesConfig.featured.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-wrap justify-center gap-2">
                {categoriesConfig.featured.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground shadow-lg scale-105"
                        : "bg-card text-foreground border-2 border-primary hover:bg-primary/10"
                    }`}
                  >
                    ⭐ {cat.toLowerCase() === "ofertas" ? "Promociones" : cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Categorías Principales */}
          {categoriesConfig.main.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                {categoriesConfig.main.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "bg-card text-muted-foreground border border-border hover:border-primary"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Categorías Adicionales */}
          {categoriesConfig.other.length > 0 && (
            <div className="mb-12 pb-6 border-t border-border pt-6">
              <p className="text-xs text-muted-foreground mb-3 text-center uppercase tracking-wider">
                Otras categorías
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {categoriesConfig.other.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-card border border-border/50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Grid de Productos */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))
              : filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No encontramos cortes en esta categoría.
              </p>
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
