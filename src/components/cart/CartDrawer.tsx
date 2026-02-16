import { useState, useEffect } from "react";
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowLeft, MessageCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/**
 * tomamos el número desde el .env
 * Formato esperado en el .env: VITE_WHATSAPP_NUMBER=549XXXXXXXXX
 */
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

export function CartDrawer() {
  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const [shippingMethod, setShippingMethod] = useState("delivery");
  
  const [formData, setFormData] = useState({
    name: "",
    receiver: "",
    paymentMethod: "Efectivo",
    address: "",
    branch: "",
    notes: "",
  });

  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    totalPrice,
    clearCart,
  } = useCart();

  // --- PERSISTENCIA: CARGAR DATOS ---
  useEffect(() => {
    const savedData = localStorage.getItem("puesto-de-campo-customer");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData({
          name: parsed.name || "",
          receiver: parsed.receiver || "",
          paymentMethod: parsed.paymentMethod || "Efectivo",
          address: parsed.address || "",
          branch: parsed.branch || "",
          notes: parsed.notes || "",
        });
        if (parsed.shippingMethod) setShippingMethod(parsed.shippingMethod);
      } catch (e) {
        console.error("Error al cargar LocalStorage", e);
      }
    }
  }, []);

  // --- PERSISTENCIA: GUARDAR DATOS ---
  const updateFormData = (updates: Partial<typeof formData>) => {
    const newData = { ...formData, ...updates };
    setFormData(newData);
    localStorage.setItem("puesto-de-campo-customer", JSON.stringify({
      ...newData,
      shippingMethod
    }));
  };

  useEffect(() => {
    localStorage.setItem("puesto-de-campo-customer", JSON.stringify({
      ...formData,
      shippingMethod
    }));
  }, [shippingMethod, formData]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  const handleOpenChange = (open: boolean) => {
    setIsCartOpen(open);
    if (!open) setTimeout(() => setStep("cart"), 300);
  };

  // --- LÓGICA DE WHATSAPP ---
  const handleWhatsAppOrder = () => {
    if (!WHATSAPP_NUMBER) {
      console.error("Error: VITE_WHATSAPP_NUMBER no está configurado en el .env");
      alert("Error en la configuración del contacto. Por favor, intente más tarde.");
      return;
    }

    let message = `*NUEVO PEDIDO - PUESTO DE CAMPO*\n`;
    message += `--------------------------------\n`;
    message += `👤 *Cliente:* ${formData.name}\n`;
    message += `📦 *Recibe:* ${formData.receiver || formData.name}\n`;
    message += `💳 *Pago:* ${formData.paymentMethod}\n`;
    message += `🚚 *Método:* ${shippingMethod === 'delivery' ? 'Envío a domicilio' : 'Retiro en local'}\n`;
    
    if (shippingMethod === 'delivery') {
      message += `📍 *Dirección:* ${formData.address}\n`;
    } else {
      message += `🏠 *Sucursal:* ${formData.branch}\n`;
    }

    if (formData.notes) message += `📝 *Notas:* ${formData.notes}\n`;

    message += `\n*PRODUCTOS:*\n`;
    items.forEach((item) => {
      message += `• ${item.quantity}x ${item.name} - ${formatPrice(item.price * item.quantity)}\n`;
    });

    message += `\n--------------------------------\n`;
    message += `💰 *TOTAL ESTIMADO: ${formatPrice(totalPrice)}*`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, "_blank");
  };

  const isFormValid = formData.name.trim() !== "" && 
    (shippingMethod === 'delivery' ? formData.address.trim() !== "" : formData.branch !== "");

  return (
    <Sheet open={isCartOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-md bg-card border-border flex flex-col p-0">
        <SheetHeader className="p-6 pb-2">
          <SheetTitle className="font-display text-xl flex items-center gap-2">
            {step === "checkout" && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setStep("cart")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <ShoppingBag className="h-5 w-5" />
            {step === "cart" ? "Tu Carrito" : "Datos de Entrega"}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground px-6">
            <ShoppingBag className="h-16 w-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">Tu carrito está vacío</p>
            <Button variant="link" onClick={() => setIsCartOpen(false)}>Empezar a comprar</Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              {step === "cart" ? (
                <div className="flex flex-col gap-4 py-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-3 bg-secondary/50 rounded-xl border border-border/40">
                      <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          <h4 className="font-medium text-sm leading-tight mb-1">{item.name}</h4>
                          <p className="text-primary font-bold">{formatPrice(item.price)}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 bg-background rounded-md border border-border p-1">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-primary transition-colors">
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-primary transition-colors">
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-5 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre de quien compra</Label>
                    <Input id="name" placeholder="Ej: Juan Pérez" value={formData.name} onChange={(e) => updateFormData({ name: e.target.value })} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo de entrega</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value)}>
                        <option value="delivery">Envío a domicilio</option>
                        <option value="pickup">Retiro en local</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Forma de pago</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.paymentMethod} onChange={(e) => updateFormData({ paymentMethod: e.target.value })}>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Transferencia">Transferencia</option>
                        <option value="Mercado Pago">Mercado Pago</option>
                      </select>
                    </div>
                  </div>

                  {shippingMethod === "delivery" ? (
                    <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300">
                      <Label htmlFor="address">Dirección de envío</Label>
                      <Input id="address" placeholder="Calle, número, depto..." value={formData.address} onChange={(e) => updateFormData({ address: e.target.value })} />
                    </div>
                  ) : (
                    <div className="space-y-2 animate-in fade-in slide-in-from-right-2 duration-300">
                      <Label htmlFor="branch">Selecciona la sucursal</Label>
                      <select id="branch" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.branch} onChange={(e) => updateFormData({ branch: e.target.value })}>
                        <option value="">Elegir...</option>
                        <option value="Sucursal Centro">Centro (Av. Colón 123)</option>
                        <option value="Sucursal Norte">Norte (Calle Ficticia 456)</option>
                      </select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="receiver">¿Quién recibe? (opcional)</Label>
                    <Input id="receiver" placeholder="Nombre de la persona" value={formData.receiver} onChange={(e) => updateFormData({ receiver: e.target.value })} />
                  </div>

                  <div className="space-y-2">
                    <Label>Notas o referencias</Label>
                    <Textarea placeholder="Ej: Portón negro, tocar timbre fuerte..." maxLength={70} className="resize-none h-20" value={formData.notes} onChange={(e) => updateFormData({ notes: e.target.value })} />
                    <p className="text-[10px] text-right text-muted-foreground">{formData.notes.length}/70</p>
                  </div>
                </div>
              )}
            </ScrollArea>

            <div className="mt-auto p-6 bg-background border-t border-border space-y-4">
              <div className="flex items-center justify-between text-lg">
                <span className="font-medium">Total estimado</span>
                <span className="font-display font-bold text-primary text-xl">{formatPrice(totalPrice)}</span>
              </div>

              {step === "cart" ? (
                <div className="flex flex-col gap-2">
                  <Button className="w-full h-12 text-md font-bold rounded-xl btn-primary-custom" onClick={() => setStep("checkout")}>
                    Confirmar Pedido
                  </Button>
                  <Button variant="ghost" onClick={clearCart} className="text-muted-foreground text-xs hover:text-destructive">
                    Vaciar mi carrito
                  </Button>
                </div>
              ) : (
                <Button 
                  className="w-full h-12 text-md font-bold rounded-xl bg-green-600 hover:bg-green-700 text-white flex gap-2 items-center" 
                  onClick={handleWhatsAppOrder}
                  disabled={!isFormValid}
                >
                  <MessageCircle className="h-5 w-5" />
                  Enviar pedido por WhatsApp
                </Button>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}