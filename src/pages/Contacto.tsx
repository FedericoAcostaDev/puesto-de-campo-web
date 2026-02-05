import { useState } from 'react';
import { Instagram, Mail, MapPin, Phone, Send, Clock } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function Contacto() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the form data to a backend
    toast.success('¡Mensaje enviado! Te contactaremos pronto.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
                Información de Contacto
              </h2>
              <div className="space-y-6">
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
                    <p className="text-muted-foreground">+54 11 1234-5678</p>
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
                    <p className="text-muted-foreground">Buenos Aires, Argentina</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Envíos a toda la zona metropolitana
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
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
                Envianos un Mensaje
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Nombre Completo
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Tu nombre"
                    className="bg-card border-border focus:border-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="tu@email.com"
                    className="bg-card border-border focus:border-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Teléfono (opcional)
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+54 11 1234-5678"
                    className="bg-card border-border focus:border-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Mensaje
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="¿En qué podemos ayudarte?"
                    rows={5}
                    className="bg-card border-border focus:border-primary resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary-custom rounded-lg inline-flex items-center justify-center gap-2"
                >
                  Enviar Mensaje
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
