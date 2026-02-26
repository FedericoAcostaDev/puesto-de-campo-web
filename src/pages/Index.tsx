import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Beef, Award, Truck, Users, ArrowUp } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/store/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import heroImage from "@/assets/hero-meat.jpg";
import logo from "@/assets/logo.jpg";

const features = [
  {
    icon: Beef,
    title: "Cortes Premium",
    description:
      "Seleccionamos los mejores cortes de carne argentina, madurada naturalmente.",
  },
  {
    icon: Award,
    title: "Calidad Garantizada",
    description:
      "Cada pieza pasa por rigurosos controles de calidad para asegurar la excelencia.",
  },
  {
    icon: Truck,
    title: "Entrega a Domicilio",
    description: "Llevamos el sabor del campo directamente a tu puerta.",
  },
  {
    icon: Users,
    title: "Tradición Familiar",
    description:
      "Más de 5 años de experiencia compartiendo el verdadero sabor de la carne.",
  },
];

const OfertaSkeleton = () => (
  <div className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
    <div className="aspect-square bg-muted" />
    <div className="p-3 md:p-4 space-y-2">
      <div className="h-4 bg-muted rounded w-2/3" />
      <div className="h-4 bg-muted rounded w-1/2" />
    </div>
  </div>
);

export default function Index() {
  const { products, loading } = useProducts();
  const ofertas = products.filter(
    (p) => p.category?.toLowerCase() === "ofertas",
  );
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Layout>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />

      {/* Hero Section */}
      <section className="relative min-h-[75vh] md:min-h-[80vh] flex items-center justify-center texture-overlay overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Carne Argentina Premium"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-12 pb-28 md:py-20">
          <div className="max-w-2xl mx-auto md:mx-0 flex flex-col items-center md:items-start text-center md:text-left animate-slide-up">
            <div className="mb-10 md:mb-8">
              <img
                src={logo}
                alt="Puesto de Campo"
                className="h-32 sm:h-40 md:h-32 w-auto rounded-2xl shadow-xl border-2 border-primary/20 object-contain bg-white/10 backdrop-blur-sm p-1"
              />
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              El Sabor Natural
              <br />
              <span className="text-primary">de la Carne</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-md md:max-w-none">
              Descubrí la calidad premium de nuestros cortes argentinos. Del
              campo a tu mesa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                to="/tienda"
                className="btn-primary-custom rounded-lg inline-flex items-center justify-center gap-2 px-8 py-4 md:px-6 md:py-3"
              >
                Ver Productos
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contacto"
                className="btn-outline-custom rounded-lg inline-flex items-center justify-center px-8 py-4 md:px-6 md:py-3"
              >
                Contactanos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE OFERTAS */}
      {(loading || ofertas.length > 0) && (
        <section className="relative z-20 -mt-20 md:-mt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="bg-background border border-border rounded-3xl md:rounded-[3rem] p-6 md:p-12 shadow-2xl">
              <div className="flex justify-between items-end mb-10">
                <div className="space-y-2">
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                    Ofertas <span className="text-primary">Especiales</span>
                  </h2>
                  <p className="text-muted-foreground text-sm md:text-base">
                    Aprovechá estas promociones por tiempo limitado.
                  </p>
                </div>

                <Link
                  to="/tienda"
                  className="hidden md:flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
                >
                  Ver Todo <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* UPDATED GRID LOGIC: 
                  1 col on mobile (will fill width if alone)
                  2 cols on small tablets (sm:)
                  4 cols on large screens (lg:) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <OfertaSkeleton key={i} />
                    ))
                  : ofertas.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
              </div>

              {/* Footer Button for mobile */}
              <div className="mt-8 md:hidden">
                <Link
                  to="/tienda"
                  className="group flex items-center justify-center gap-2 text-primary border border-primary/20 rounded-xl py-4 font-bold text-sm bg-primary/5 active:bg-primary/10 transition-colors"
                >
                  Ver Todo el Catálogo
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-center text-foreground mb-16">
            ¿Por qué <span className="text-primary">elegirnos</span>?
          </h2>

          <div className="flex overflow-x-auto pb-8 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 snap-x snap-mandatory hide-scrollbar">
            {features.map((feature, index) => (
              <div
                key={index}
                className="min-w-[85%] sm:min-w-[45%] md:min-w-0 snap-center p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors group"
              >
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 gradient-teal relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
            ¿Listo para probar?
          </h2>
          <Link
            to="/tienda"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-background text-foreground font-semibold uppercase tracking-wider rounded-lg hover:bg-foreground hover:text-background transition-colors duration-300"
          >
            Ver Tienda
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-6 z-50 p-4 bg-primary text-primary-foreground rounded-full shadow-2xl hover:scale-110 transition-all duration-300"
          aria-label="Volver arriba"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </Layout>
  );
}
