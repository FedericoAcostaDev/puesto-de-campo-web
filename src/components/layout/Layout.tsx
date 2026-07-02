import { ReactNode, useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';

interface LayoutProps {
  children: ReactNode;
}

interface Ember {
  id: number;
  left: number;
  delay: number;
  duration: number;
}

export function Layout({ children }: LayoutProps) {
  const [embers, setEmbers] = useState<Ember[]>([]);

  useEffect(() => {
    // Generar ascuas iniciales
    const initialEmbers = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 6 + Math.random() * 4,
    }));
    setEmbers(initialEmbers);

    // Agregar nuevas ascuas de forma continua
    const interval = setInterval(() => {
      setEmbers(prev => {
        const newEmber = {
          id: Math.random(),
          left: Math.random() * 100,
          delay: 0,
          duration: 6 + Math.random() * 4,
        };
        return [...prev.slice(-20), newEmber]; // Mantener máximo 20 ascuas
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="embers-container fixed inset-0 pointer-events-none z-0">
        {embers.map(ember => (
          <div
            key={ember.id}
            className="ember"
            style={{
              left: `${ember.left}%`,
              animation: `floatUp ${ember.duration}s linear infinite, flicker 2s ease-in-out infinite`,
              animationDelay: `${ember.delay}s`,
            }}
          />
        ))}
      </div>
      <Navbar />
      <main className="flex-1 pt-20 relative z-10">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
