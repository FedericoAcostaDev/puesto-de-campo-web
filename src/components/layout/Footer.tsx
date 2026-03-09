import { useState } from "react";
import {
  Instagram,
  Mail,
  MapPin,
  Phone,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpeg";

export function Footer() {
  const [navOpen, setNavOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start">
            <img
              src={logo}
              alt="Puesto de Campo"
              className="h-20 w-auto mb-4"
            />
            <p className="text-muted-foreground text-center md:text-left">
              El Sabor Natural de la Carne
            </p>
          </div>

          {/* Navegación */}
          <div className="flex flex-col items-center md:items-start border-b md:border-none border-border pb-4 md:pb-0">
            <button
              onClick={() => setNavOpen(!navOpen)}
              className="flex items-center justify-between w-full md:cursor-default"
            >
              <h4 className="font-display text-lg font-semibold md:mb-4 text-foreground">
                Navegación
              </h4>
              <span className="md:hidden">
                {navOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </span>
            </button>

            <div
              className={`${navOpen ? "flex" : "hidden"} md:flex flex-col gap-2 mt-4 md:mt-0 text-center md:text-left`}
            >
              <Link
                to="/"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Inicio
              </Link>
              <Link
                to="/tienda"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Tienda
              </Link>
              <Link
                to="/contacto"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Contacto
              </Link>
            </div>
          </div>

          {/* Contacto */}
          <div className="flex flex-col items-center md:items-start pt-4 md:pt-0">
            <button
              onClick={() => setContactOpen(!contactOpen)}
              className="flex items-center justify-between w-full md:cursor-default"
            >
              <h4 className="font-display text-lg font-semibold md:mb-4 text-foreground">
                Contacto
              </h4>
              <span className="md:hidden">
                {contactOpen ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </span>
            </button>

            <div
              className={`${contactOpen ? "flex" : "hidden"} md:flex flex-col gap-3 mt-4 md:mt-0 text-muted-foreground`}
            >
              <a
                href="https://www.instagram.com/puestodecampo/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center md:justify-start gap-2 hover:text-primary transition-colors"
              >
                <Instagram className="h-4 w-4" />
                @puestodecampo
              </a>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Phone className="h-4 w-4" />
                +54 3586101467
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Mail className="h-4 w-4" />
                puestodecampoweb@gmail.com
              </div>

              {/* Locales ahora es un Link que lleva a la sección específica */}
              <Link
                to="/contacto#sedes"
                className="flex items-center justify-center md:justify-start gap-2 hover:text-primary transition-colors group"
                onClick={() => {
                  // Pequeño truco para asegurar el scroll si ya estás en la página de contacto
                  const element = document.getElementById("sedes");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <MapPin className="h-4 w-4 group-hover:animate-bounce" />
                Locales
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground text-sm">
          <p>
            © {new Date().getFullYear()} Puesto de Campo. Todos los derechos
            reservados.
          </p>
          <p>
            {" "}
            Diseñado y desarrollado por{" "}
            <a
              href="https://github.com/FedericoAcostaDev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary"
            >
              Federico Acosta
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
