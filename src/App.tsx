import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Tienda from "./pages/Tienda";
import Contacto from "./pages/Contacto";
import NotFound from "./pages/NotFound";

// 1. Configuración del QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // Los datos se consideran frescos por 10 minutos
      gcTime: 1000 * 60 * 60 * 24, // Mantener en caché 24 horas
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// 2. Configuración del Persistidor ASYNC
// Definimos un adaptador para que localStorage funcione con promesas
const asyncStorage = {
  getItem: (key: string) => Promise.resolve(window.localStorage.getItem(key)),
  setItem: (key: string, value: string) => Promise.resolve(window.localStorage.setItem(key, value)),
  removeItem: (key: string) => Promise.resolve(window.localStorage.removeItem(key)),
};

const asyncPersister = createAsyncStoragePersister({
  storage: asyncStorage,
  key: 'PUESTO_CAMPO_CACHE', // Una clave única para tu app
});

// 3. Conectar la persistencia
persistQueryClient({
  queryClient,
  persister: asyncPersister,
  maxAge: 1000 * 60 * 60 * 24, // 24 horas de vida útil en disco
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tienda" element={<Tienda />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;