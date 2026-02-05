import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo.jpg';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start">
            <img src={logo} alt="Puesto de Campo" className="h-20 w-auto mb-4" />
            <p className="text-muted-foreground text-center md:text-left">
              El Sabor Natural de la Carne
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-display text-lg font-semibold mb-4 text-foreground">
              Navegación
            </h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                Inicio
              </Link>
              <Link to="/tienda" className="text-muted-foreground hover:text-primary transition-colors">
                Tienda
              </Link>
              <Link to="/contacto" className="text-muted-foreground hover:text-primary transition-colors">
                Contacto
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-display text-lg font-semibold mb-4 text-foreground">
              Contacto
            </h4>
            <div className="flex flex-col gap-3 text-muted-foreground">
              <a
                href="https://www.instagram.com/puestodecampo/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Instagram className="h-4 w-4" />
                @puestodecampo
              </a>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +54 11 1234-5678
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                info@puestodecampo.com
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Buenos Aires, Argentina
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Puesto de Campo. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
