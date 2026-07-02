import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import logo from "@/assets/logo.jpeg";

const navLinks = [
  { name: "Inicio", path: "/" },
  { name: "Tienda", path: "/tienda" },
  { name: "Contacto", path: "/contacto" },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const location = useLocation();
  const { totalItems, setIsCartOpen } = useCart();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    if (totalItems === 0) return;

    setCartPulse(true);
    const timeout = window.setTimeout(() => setCartPulse(false), 900);

    return () => window.clearTimeout(timeout);
  }, [totalItems]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Puesto de Campo" className="h-14 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? "active" : ""}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center gap-4">
            <button
              data-cart-trigger
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2 text-foreground/80 hover:text-foreground transition-colors ${cartPulse ? "animate-[pulse_0.8s_ease-in-out_2]" : ""}`}
            >
              <ShoppingCart className={`h-6 w-6 transition-all ${cartPulse ? "scale-110 text-primary drop-shadow-[0_0_10px_rgba(14,165,233,0.35)]" : ""}`} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-foreground/80 hover:text-foreground transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`nav-link py-2 ${isActive(link.path) ? "active" : ""}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
