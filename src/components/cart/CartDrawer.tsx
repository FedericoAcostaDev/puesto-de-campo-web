import { useState, useEffect, useMemo } from "react";
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  ArrowLeft,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Timer,
  TriangleAlert,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useDiscountCodes } from "@/hooks/useDiscountCodes";
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
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

export function CartDrawer() {
  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const [shippingMethod, setShippingMethod] = useState("delivery");
  const [isSuccess, setIsSuccess] = useState(false);
  const [touched, setTouched] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    receiver: "",
    paymentMethod: "Efectivo",
    address: "",
    branch: "",
    notes: "",
  });

  const [discountCode, setDiscountCode] = useState("");
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [discountStatus, setDiscountStatus] = useState<"idle" | "applied" | "invalid">("idle");
  const [discountMessage, setDiscountMessage] = useState<string>("");

  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    totalPrice,
    clearCart,
  } = useCart();

  const { discountCodes } = useDiscountCodes();
  const [appliedDiscount, setAppliedDiscount] = useState<"applied" | "invalid" | "idle">("idle");

  // Validation Logic
  const errors = {
    name: formData.name.trim() === "",
    address: shippingMethod === "delivery" && formData.address.trim() === "",
    branch: shippingMethod === "pickup" && formData.branch === "",
  };

  const isFormValid = !errors.name && !errors.address && !errors.branch;

  const isWholeChickenItem = (item: { category?: string; name?: string }) => {
    const value = `${item.category ?? ""} ${item.name ?? ""}`.toLowerCase();
    return /pollo\s+entero|entero\s+pollo|whole chicken|pollo/i.test(value) && /entero|whole/i.test(value);
  };

  const hasWholeChicken = items.some(isWholeChickenItem);

  useEffect(() => {
    const savedData = localStorage.getItem("puesto-de-campo-customer");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData((prev) => ({ ...prev, ...parsed }));
        if (parsed.shippingMethod) setShippingMethod(parsed.shippingMethod);
      } catch (e) {
        console.error("Error loading local storage", e);
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
      const isWholeChicken = /pollo\s+entero|entero\s+pollo|whole chicken|pollo/i.test(`${item.category ?? ""} ${item.name ?? ""}`.toLowerCase()) && /entero|whole/i.test(`${item.category ?? ""} ${item.name ?? ""}`.toLowerCase());
      const unitLabel = isWholeChicken ? "pollo entero" : item.name;
      const priceText = isWholeChicken ? "precio a definir" : `$${(item.price * item.quantity).toLocaleString("es-AR")}`;
      message += `• ${item.quantity}x ${unitLabel} - ${priceText}\n`;
    });

    message += `\n--------------------------------\n`;
    message += `💰 *TOTAL ESTIMADO: $${totalPrice.toLocaleString("es-AR")}*`;

    setIsSuccess(true);
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
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
    <Sheet
      open={isCartOpen}
      onOpenChange={(open) => {
        setIsCartOpen(open);
        if (!open) {
          setStep("cart");
          setTouched(false);
        }
      }}
    >
      <SheetContent className="w-full sm:max-w-md bg-card flex flex-col p-0">
        {isSuccess && (
          <div className="absolute inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
            <CheckCircle2 className="h-16 w-16 text-green-600 mb-4 animate-bounce" />
            <h3 className="text-2xl font-bold font-display">
              ¡Pedido Enviado!
            </h3>
            <p className="text-muted-foreground mt-2">
              Redirigiendo a WhatsApp...
            </p>
          </div>
        )}

        <SheetHeader className="p-6 pb-2 border-b border-border/50">
          <SheetTitle className="font-display text-xl flex items-center gap-2">
            {step === "checkout" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setStep("cart")}
                className="h-8 w-8 mr-1"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <ShoppingBag className="h-5 w-5 text-primary" />
            {step === "cart" ? "Tu Carrito" : "Finalizar Pedido"}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          {step === "cart" ? (
            <div className="space-y-4 py-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-secondary/30 rounded-2xl border border-border/40"
                >
                  <img
                    src={item.image}
                    className="w-20 h-20 rounded-lg object-cover bg-muted"
                    alt={item.name}
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm leading-tight">
                        {item.name}
                      </h4>
                      {item.purchaseLabel && (
                        <p className="text-[11px] text-muted-foreground mt-1">
                          {item.purchaseLabel}
                        </p>
                      )}
                      <p className="text-primary font-bold text-sm mt-1">
                        {(/pollo\s+entero|entero\s+pollo|whole chicken|pollo/i.test(`${item.category ?? ""} ${item.name ?? ""}`.toLowerCase()) && /entero|whole/i.test(`${item.category ?? ""} ${item.name ?? ""}`.toLowerCase()) ? "A definir" : `$${item.price.toLocaleString("es-AR")}`)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-background border rounded-lg p-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-1"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-1"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6 py-6">
              {/* FIELD: NAME */}
              <div
                className={cn(
                  "p-4 rounded-xl border transition-colors",
                  errors.name && touched
                    ? "bg-red-50/50 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
                    : "bg-primary/5 border-primary/10",
                )}
              >
                <Label
                  htmlFor="name"
                  className="flex justify-between font-bold mb-1"
                >
                  Nombre del cliente{" "}
                  {errors.name && touched && (
                    <span className="text-red-500 text-[10px] uppercase tracking-widest">
                      Obligatorio
                    </span>
                  )}
                </Label>
                <p className="text-[11px] text-muted-foreground mb-2">
                  Ingresá tu nombre para que sepamos quién hace el pedido.
                </p>
                <Input
                  id="name"
                  placeholder="Ej: Juan Pérez"
                  className={cn(
                    "bg-background h-11",
                    errors.name &&
                      touched &&
                      "border-red-500 focus-visible:ring-red-500",
                  )}
                  value={formData.name}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                />
              </div>

              {/* LOGISTICS */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground">
                    MODALIDAD
                  </Label>
                  <select
                    className="flex h-11 w-full rounded-md border bg-background px-3 py-2 text-sm"
                    value={shippingMethod}
                    onChange={(e) => setShippingMethod(e.target.value)}
                  >
                    <option value="delivery">📍 Domicilio</option>
                    <option value="pickup">🛒 Retiro en Local</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground">
                    PAGO
                  </Label>
                  <select
                    className="flex h-11 w-full rounded-md border bg-background px-3 py-2 text-sm"
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      updateFormData({ paymentMethod: e.target.value })
                    }
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia">Transferencia</option>
                  </select>
                </div>
              </div>

              {/* FIELD: ADDRESS OR BRANCH */}
              <div
                className={cn(
                  "p-4 rounded-xl border transition-colors",
                  (errors.address || errors.branch) && touched
                    ? "bg-red-50/50 border-red-500"
                    : "bg-secondary/30 border-border",
                )}
              >
                {shippingMethod === "delivery" ? (
                  <>
                    <Label className="flex justify-between font-bold mb-1">
                      Dirección de envío{" "}
                      {errors.address && touched && (
                        <span className="text-red-500 text-[10px] uppercase tracking-widest">
                          Requerido
                        </span>
                      )}
                    </Label>
                    <p className="text-[11px] text-muted-foreground mb-2">
                      Incluí calle, número y cualquier referencia útil.
                    </p>
                    <Input
                      placeholder="Calle, nro, piso/depto..."
                      className={cn(
                        "bg-background h-11",
                        errors.address && touched && "border-red-500",
                      )}
                      value={formData.address}
                      onChange={(e) =>
                        updateFormData({ address: e.target.value })
                      }
                    />
                  </>
                ) : (
                  <>
                    <Label className="flex justify-between font-bold mb-1">
                      Punto de retiro{" "}
                      {errors.branch && touched && (
                        <span className="text-red-500 text-[10px] uppercase tracking-widest">
                          Elegí uno
                        </span>
                      )}
                    </Label>
                    <p className="text-[11px] text-muted-foreground mb-2">
                      Seleccioná la sucursal donde retirarás tus productos.
                    </p>
                    <select
                      className={cn(
                        "flex h-11 w-full rounded-md border bg-background px-3 py-2 text-sm",
                        errors.branch && touched && "border-red-500",
                      )}
                      value={formData.branch}
                      onChange={(e) =>
                        updateFormData({ branch: e.target.value })
                      }
                    >
                      <option value="">Seleccionar sucursal...</option>
                      <option value="Sucursal Goyena">Pedro Goyena 298</option>
                      <option value="Sucursal Suipacha">Suipacha 304</option>
                      <option value="Sucursal Guzman">Gdor. Guzmán 1560</option>
                    </select>
                  </>
                )}
                {(errors.address || errors.branch) && touched && (
                  <p className="mt-2 text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Por favor, completa la
                    información de entrega.
                  </p>
                )}
              </div>

              {shippingMethod === "delivery" && (
                <div className="space-y-3">
                  <div className="flex items-start gap-2 rounded-2xl border border-primary/10 bg-primary/5 p-4 shadow-sm">
                    <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <p className="text-sm font-medium text-foreground">
                      El costo de envío no está incluido, se debe abonar aparte.
                    </p>
                  </div>
                  <div className="flex items-start gap-2 rounded-2xl border border-primary/10 bg-background/80 p-4 shadow-sm">
                    <Timer className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <p className="text-sm font-medium text-foreground">
                      El envío demora 30 minutos aproximadamente.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">
                    ¿Quién recibe? (Opcional)
                  </Label>
                  <Input
                    placeholder="Nombre de la persona"
                    value={formData.receiver}
                    onChange={(e) =>
                      updateFormData({ receiver: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-2 block">
                    Notas extras
                  </Label>
                  <Textarea
                    className="resize-none bg-background"
                    placeholder="Ej: No funciona el timbre..."
                    value={formData.notes}
                    onChange={(e) => updateFormData({ notes: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        <div className="p-6 bg-background border-t border-border mt-auto">
          <div className="space-y-4 mb-6">
            {discountStatus === "applied" ? (
              <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {discountMessage || 'Código aplicado'}
              </div>
            ) : discountStatus === "invalid" ? (
              <div className="space-y-3">
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {discountMessage || 'Código no válido'}
                </div>
                <Button
                  variant="secondary"
                  className="w-full h-12 rounded-2xl"
                  onClick={() => {
                    setShowDiscountInput(true);
                    setDiscountStatus("idle");
                    setDiscountMessage("");
                  }}
                >
                  Reingresar código
                </Button>
              </div>
            ) : !showDiscountInput ? (
              <Button
                variant="secondary"
                className="w-full h-12 rounded-2xl"
                onClick={() => setShowDiscountInput(true)}
              >
                Tengo código de descuento
              </Button>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="discount-code" className="text-sm font-semibold">
                  Código de descuento
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="discount-code"
                    placeholder="Ingresá tu código"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="bg-background flex-1"
                  />
                      <Button
                    variant="secondary"
                    className="h-11 px-4"
                    onClick={() => {
                      const trimmedCode = discountCode.trim().toUpperCase();
                      const matched = discountCodes.find(
                        (discount) =>
                          discount.active &&
                          discount.code.toUpperCase() === trimmedCode,
                      );

                      if (matched) {
                        setDiscountStatus("applied");
                        const formattedValue = matched.type === 'porcentaje'
                          ? `${matched.value}%`
                          : `$${matched.value.toLocaleString('es-AR')}`;
                        setDiscountMessage(`Código aplicado: ${formattedValue}`);
                        setShowDiscountInput(false);
                      } else {
                        setDiscountStatus("invalid");
                        setDiscountMessage("Código no válido");
                        setShowDiscountInput(false);
                      }
                    }}
                  >
                    Aplicar
                  </Button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">
                  Subtotal estimado:
                </span>
                <span className="text-2xl font-bold text-primary font-display">
                  ${totalPrice.toLocaleString("es-AR")}
                </span>
              </div>
              {hasWholeChicken && (
                <span className="text-sm text-muted-foreground">
                  pollo entero a definir
                </span>
              )}
            </div>
          </div>

          {step === "cart" ? (
            <Button
              className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg"
              onClick={() => setStep("checkout")}
              disabled={items.length === 0}
            >
              Siguiente: Datos de envío
            </Button>
          ) : (
            <Button
              className={cn(
                "w-full h-14 text-lg font-bold rounded-2xl flex gap-3 items-center shadow-lg transition-all",
                isFormValid
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-muted text-muted-foreground opacity-70 grayscale",
              )}
              onClick={handleWhatsAppOrder}
              onMouseDown={() => {
                if (!isFormValid) setTouched(true);
              }}
            >
              <MessageCircle className="h-6 w-6" />
              {isFormValid
                ? "Hacer pedido por WhatsApp"
                : "Completa los campos marcados"}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
