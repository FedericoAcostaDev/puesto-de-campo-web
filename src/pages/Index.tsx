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

  // CHANGE: Ensure the page starts at the top when mounted
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll listener for the "Back to Top" button visibility
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
      {/* Estilos locales para ocultar scrollbar del carrusel */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center texture-overlay">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Carne Argentina Premium"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/60" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl animate-slide-up">
            <img
              src={logo}
              alt="Puesto de Campo"
              className="h-24 md:h-32 mb-8"
            />
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              El Sabor Natural
              <br />
              <span className="text-primary">de la Carne</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Descubrí la calidad premium de nuestros cortes argentinos. Del
              campo a tu mesa, con la frescura y el sabor que mereces.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/tienda"
                className="btn-primary-custom rounded-lg inline-flex items-center justify-center gap-2 px-6 py-3"
              >
                Ver Productos
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contacto"
                className="btn-outline-custom rounded-lg inline-flex items-center justify-center px-6 py-3"
              >
                Contactanos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE OFERTAS */}
      {(loading || ofertas.length > 0) && (
        <section className="py-16 bg-background border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  Ofertas <span className="text-primary">Especiales</span>
                </h2>
                <p className="text-muted-foreground mt-2">
                  Aprovechá estas promociones.
                </p>
              </div>

              <Link
                to="/tienda"
                className="flex items-center gap-2 text-primary hover:underline font-medium text-sm md:text-base"
              >
                Tienda <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <OfertaSkeleton key={i} />
                  ))
                : ofertas.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-20 md:py-32 bg-card">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
            Nuestra <span className="text-primary">Historia</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Puesto de Campo nace de la pasión por la carne argentina de calidad.
            Somos una empresa familiar dedicada a llevar los mejores cortes
            directamente del productor a tu hogar.
          </p>
        </div>
      </section>

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

          <div className="flex justify-center gap-2 mt-4 md:hidden">
            {features.map((_, i) => (
              <div key={i} className="h-1.5 w-1.5 rounded-full bg-primary/30" />
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

      {/* BOTÓN FLOTANTE VOLVER ARRIBA */}
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
