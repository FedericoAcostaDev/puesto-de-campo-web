import { Instagram, Mail, MapPin, Phone, ExternalLink, Clock } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';

export default function Contacto() {
  // URL de tu Google Form (reemplaza con tu link real)
  const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSeDqofZ__fnivo1rzFrL7PsKCQcFVjrQuibPK-Cn7BU6XzOxw/viewform?usp=publish-editor";

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
            <span className="text-primary">Contacto</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ¿Tenés alguna pregunta o querés hacer un pedido especial? 
            Estamos acá para ayudarte.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
                Información de Contacto
              </h2>
              
              <a
                href="https://www.instagram.com/puestodecampo/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors group"
              >
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Instagram className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Instagram</h3>
                  <p className="text-muted-foreground">@puestodecampo</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Seguinos para ver novedades y promociones
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Teléfono</h3>
                  <p className="text-muted-foreground">+54 3586101467</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    WhatsApp disponible
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <p className="text-muted-foreground">info@puestodecampo.com</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Respondemos en 24hs
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Ubicación</h3>
                  <p className="text-muted-foreground">Río Cuarto, Córdoba, Argentina</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Envíos en Río Cuarto
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Horarios</h3>
                  <p className="text-muted-foreground">Lunes a Viernes: 8:00 - 18:00</p>
                  <p className="text-muted-foreground">Sábados: 8:00 - 14:00</p>
                </div>
              </div>
            </div>

            {/* CTA Google Form */}
            <div className="flex flex-col justify-center">
              <div className="p-8 md:p-12 bg-card rounded-2xl border-2 border-dashed border-primary/30 text-center">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
                  ¿Querés enviarnos un mensaje?
                </h2>
                <p className="text-muted-foreground mb-8">
                  Completá nuestro formulario de consultas para que podamos brindarte una atención personalizada.
                </p>
                <a
                  href={googleFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  Abrir Formulario de contacto
                  <ExternalLink className="h-5 w-5" />
                </a>
                <p className="text-xs text-muted-foreground mt-4">
                  Serás redirigido a Google Forms
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
}