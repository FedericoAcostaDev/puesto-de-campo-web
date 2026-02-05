import { Link } from 'react-router-dom';
import { ArrowRight, Beef, Award, Truck, Users } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import heroImage from '@/assets/hero-meat.jpg';
import logo from '@/assets/logo.jpg';

const features = [
  {
    icon: Beef,
    title: 'Cortes Premium',
    description: 'Seleccionamos los mejores cortes de carne vacuna argentina, madurada naturalmente.',
  },
  {
    icon: Award,
    title: 'Calidad Garantizada',
    description: 'Cada pieza pasa por rigurosos controles de calidad para asegurar la excelencia.',
  },
  {
    icon: Truck,
    title: 'Entrega a Domicilio',
    description: 'Llevamos el sabor del campo directamente a tu puerta, en cadena de frío.',
  },
  {
    icon: Users,
    title: 'Tradición Familiar',
    description: 'Más de 20 años de experiencia compartiendo el verdadero sabor de la carne.',
  },
];

export default function Index() {
  return (
    <Layout>
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
            <img src={logo} alt="Puesto de Campo" className="h-24 md:h-32 mb-8" />
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              El Sabor Natural
              <br />
              <span className="text-primary">de la Carne</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Descubrí la calidad premium de nuestros cortes argentinos. 
              Del campo a tu mesa, con la frescura y el sabor que mereces.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/tienda" className="btn-primary-custom rounded-lg inline-flex items-center justify-center gap-2">
                Ver Productos
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/contacto" className="btn-outline-custom rounded-lg inline-flex items-center justify-center">
                Contactanos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 md:py-32 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
              Nuestra <span className="text-primary">Historia</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Puesto de Campo nace de la pasión por la carne argentina de calidad. 
              Somos una empresa familiar dedicada a llevar los mejores cortes 
              directamente del productor a tu hogar. Cada pieza que ofrecemos 
              es seleccionada cuidadosamente, respetando la tradición del asado 
              argentino y garantizando frescura en cada entrega.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Trabajamos directamente con productores locales que comparten 
              nuestros valores de calidad y respeto por el animal. 
              El resultado: carne con el sabor auténtico del campo argentino.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-center text-foreground mb-16">
            ¿Por qué <span className="text-primary">elegirnos</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors duration-300 group"
              >
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
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
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Explorá nuestro catálogo y descubrí los mejores cortes de carne argentina. 
            Hacemos envíos a domicilio con cadena de frío.
          </p>
          <Link
            to="/tienda"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-background text-foreground font-semibold uppercase tracking-wider rounded-lg hover:bg-foreground hover:text-background transition-colors duration-300"
          >
            Ver Tienda
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
