import { useState, useEffect } from "react";
import {
  X,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  ArrowLeft,
  MessageCircle,
  CheckCircle2,
  AlertCircle, // New icon for warnings
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils"; // Assuming you have shadcn's cn helper

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

export function CartDrawer() {
  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const [shippingMethod, setShippingMethod] = useState("delivery");
  const [isSuccess, setIsSuccess] = useState(false);
  const [touched, setTouched] = useState(false); // Track if user tried to submit

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

  // Logic to determine errors
  const errors = {
    name: formData.name.trim() === "",
    address: shippingMethod === "delivery" && formData.address.trim() === "",
    branch: shippingMethod === "pickup" && formData.branch === "",
  };

  const isFormValid = !errors.name && !errors.address && !errors.branch;

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

  const updateFormData = (updates: Partial<typeof formData>) => {
    const newData = { ...formData, ...updates };
    setFormData(newData);
    localStorage.setItem(
      "puesto-de-campo-customer",
      JSON.stringify({ ...newData, shippingMethod }),
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  const handleOpenChange = (open: boolean) => {
    setIsCartOpen(open);
    if (!open) {
      setTimeout(() => {
        setStep("cart");
        setIsSuccess(false);
        setTouched(false);
      }, 300);
    }
  };

  const handleWhatsAppOrder = () => {
    setTouched(true);
    if (!isFormValid) return;

    let message = `*NUEVO PEDIDO - PUESTO DE CAMPO*\n`;
    message += `--------------------------------\n`;
    message += `👤 *Cliente:* ${formData.name}\n`;
    message += `📦 *Recibe:* ${formData.receiver || formData.name}\n`;
    message += `💳 *Pago:* ${formData.paymentMethod}\n`;
    message += `🚚 *Método:* ${shippingMethod === "delivery" ? "Envío a domicilio" : "Retiro en local"}\n`;

    if (shippingMethod === "delivery") {
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

    setIsSuccess(true);
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`,
      "_blank",
    );

    setTimeout(() => {
      clearCart();
      setIsCartOpen(false);
      setStep("cart");
      setIsSuccess(false);
      setTouched(false);
    }, 2500);
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-md bg-card border-border flex flex-col p-0 overflow-hidden">
        {/* SUCCESS OVERLAY */}
        {isSuccess && (
          <div className="absolute inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-500 delay-150">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-foreground font-display">
              ¡Pedido Enviado!
            </h3>
            <p className="text-muted-foreground mt-2">
              Te estamos redirigiendo a WhatsApp...
            </p>
          </div>
        )}

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
            <Button variant="link" onClick={() => setIsCartOpen(false)}>
              Empezar a comprar
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              {step === "cart" ? (
                <div className="flex flex-col gap-4 py-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 bg-secondary/50 rounded-xl border border-border/40"
                    >
                      <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          <h4 className="font-medium text-sm mb-1">
                            {item.name}
                          </h4>
                          <p className="text-primary font-bold">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 bg-background rounded-md border border-border p-1">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="p-1 hover:text-primary"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="p-1 hover:text-primary"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6 py-4">
                  {/* NAME FIELD */}
                  <div
                    className={cn(
                      "space-y-2 p-4 rounded-xl border transition-all duration-300",
                      errors.name && touched
                        ? "bg-destructive/5 border-destructive"
                        : "bg-primary/5 border-primary/10",
                    )}
                  >
                    <Label
                      htmlFor="name"
                      className="text-sm font-bold flex items-center justify-between"
                    >
                      Nombre de quien compra
                      <span className="text-destructive">* Requerido</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Ej: Juan Pérez"
                      className={cn(
                        "bg-background h-11 transition-all",
                        errors.name && touched
                          ? "border-destructive focus-visible:ring-destructive"
                          : "border-primary/20",
                      )}
                      value={formData.name}
                      onChange={(e) => updateFormData({ name: e.target.value })}
                    />
                    {errors.name && touched && (
                      <p className="text-xs text-destructive font-semibold flex items-center gap-1 animate-in slide-in-from-top-1">
                        <AlertCircle className="h-3 w-3" /> Por favor, ingresa
                        tu nombre
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 px-1">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Tipo de entrega
                      </Label>
                      <select
                        className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={shippingMethod}
                        onChange={(e) => setShippingMethod(e.target.value)}
                      >
                        <option value="delivery">Envío a domicilio</option>
                        <option value="pickup">Retiro en local</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Forma de pago
                      </Label>
                      <select
                        className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.paymentMethod}
                        onChange={(e) =>
                          updateFormData({ paymentMethod: e.target.value })
                        }
                      >
                        <option value="Efectivo">Efectivo</option>
                        <option value="Transferencia">Transferencia</option>
                        <option value="Mercado Pago">Mercado Pago</option>
                      </select>
                    </div>
                  </div>

                  {/* DYNAMIC FIELD (ADDRESS OR BRANCH) */}
                  <div
                    className={cn(
                      "space-y-2 p-4 rounded-xl border transition-all duration-300",
                      (errors.address || errors.branch) && touched
                        ? "bg-destructive/5 border-destructive"
                        : "bg-secondary/30 border-border",
                    )}
                  >
                    {shippingMethod === "delivery" ? (
                      <>
                        <Label
                          htmlFor="address"
                          className="text-sm font-bold flex items-center justify-between"
                        >
                          Dirección de envío
                          <span className="text-destructive">* Requerido</span>
                        </Label>
                        <Input
                          id="address"
                          placeholder="Calle, número, depto..."
                          className={cn(
                            "bg-background h-11",
                            errors.address && touched
                              ? "border-destructive focus-visible:ring-destructive"
                              : "border-border",
                          )}
                          value={formData.address}
                          onChange={(e) =>
                            updateFormData({ address: e.target.value })
                          }
                        />
                        {errors.address && touched && (
                          <p className="text-xs text-destructive font-semibold flex items-center gap-1 animate-in slide-in-from-top-1">
                            <AlertCircle className="h-3 w-3" /> Indica dónde
                            debemos entregarlo
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <Label
                          htmlFor="branch"
                          className="text-sm font-bold flex items-center justify-between"
                        >
                          Selecciona la sucursal
                          <span className="text-destructive">* Requerido</span>
                        </Label>
                        <select
                          id="branch"
                          className={cn(
                            "flex h-11 w-full rounded-md border bg-background px-3 py-2 text-sm",
                            errors.branch && touched
                              ? "border-destructive"
                              : "border-border",
                          )}
                          value={formData.branch}
                          onChange={(e) =>
                            updateFormData({ branch: e.target.value })
                          }
                        >
                          <option value="">Elegir sucursal...</option>
                          <option value="Sucursal Centro">
                            Centro (Av. Colón 123)
                          </option>
                          <option value="Sucursal Norte">
                            Norte (Calle Ficticia 456)
                          </option>
                        </select>
                        {errors.branch && touched && (
                          <p className="text-xs text-destructive font-semibold flex items-center gap-1 animate-in slide-in-from-top-1">
                            <AlertCircle className="h-3 w-3" /> Debes elegir una
                            sucursal para retirar
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  <div className="space-y-2 px-1">
                    <Label htmlFor="receiver">¿Quién recibe? (opcional)</Label>
                    <Input
                      id="receiver"
                      placeholder="Nombre de la persona"
                      className="bg-background h-11"
                      value={formData.receiver}
                      onChange={(e) =>
                        updateFormData({ receiver: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2 px-1">
                    <Label>Notas o referencias</Label>
                    <Textarea
                      placeholder="Ej: Portón negro, tocar timbre fuerte..."
                      maxLength={70}
                      className="resize-none h-20 bg-background"
                      value={formData.notes}
                      onChange={(e) =>
                        updateFormData({ notes: e.target.value })
                      }
                    />
                    <p className="text-[10px] text-right text-muted-foreground">
                      {formData.notes.length}/70
                    </p>
                  </div>
                </div>
              )}
            </ScrollArea>

            <div className="mt-auto p-6 bg-background border-t border-border space-y-4">
              <div className="flex items-center justify-between text-lg">
                <span className="font-medium">Total estimado</span>
                <span className="font-display font-bold text-primary text-xl">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              {step === "cart" ? (
                <div className="flex flex-col gap-2">
                  <Button
                    className="w-full h-12 text-md font-bold rounded-xl"
                    onClick={() => setStep("checkout")}
                  >
                    Confirmar Pedido
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={clearCart}
                    className="text-muted-foreground text-xs hover:text-destructive"
                  >
                    Vaciar mi carrito
                  </Button>
                </div>
              ) : (
                <Button
                  className={cn(
                    "w-full h-14 text-md font-bold rounded-xl flex gap-2 items-center transition-all",
                    isFormValid
                      ? "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200"
                      : "bg-muted text-muted-foreground cursor-not-allowed opacity-70",
                  )}
                  onClick={handleWhatsAppOrder}
                  // We handle the "touched" state on click if it's invalid
                  onMouseDown={() => {
                    if (!isFormValid) setTouched(true);
                  }}
                >
                  <MessageCircle className="h-5 w-5" />
                  {isFormValid
                    ? "Enviar pedido por WhatsApp"
                    : "Completa los campos (*) para continuar"}
                </Button>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
