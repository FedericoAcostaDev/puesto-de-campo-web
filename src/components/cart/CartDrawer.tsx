import { useState } from "react"; // 1. Agregamos useState
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
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
import { Input } from "@/components/ui/input"; // Asegúrate de tener estos componentes de shadcn
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CartDrawer() {
  const [step, setStep] = useState<"cart" | "checkout">("cart"); // Control de vista

  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    totalPrice,
    clearCart,
  } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  // Resetear el paso al cerrar el drawer
  const handleOpenChange = (open: boolean) => {
    setIsCartOpen(open);
    if (!open) setTimeout(() => setStep("cart"), 300);
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-md bg-card border-border flex flex-col">
        <SheetHeader>
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
            {step === "cart" ? "Tu Carrito" : "Completa tu pedido"}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
            <ShoppingBag className="h-16 w-16 mb-4 opacity-50" />
            <p className="text-lg">Tu carrito está vacío</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 pr-4 mt-6">
              {step === "cart" ? (
                /* VISTA DE PRODUCTOS */
                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 bg-secondary rounded-lg"
                    >
                      <div className="w-20 h-20 bg-muted rounded-md overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-display font-semibold">
                          {item.name}
                        </h4>
                        <p className="text-primary font-semibold">
                          {formatPrice(item.price)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1 rounded bg-muted"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 rounded bg-muted"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* FORMULARIO DE CHECKOUT */
                <div className="space-y-6 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input id="name" placeholder="Ej: Juan Pérez" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="receiver">
                      ¿Quién va a recibir el pedido?
                    </Label>
                    <Input id="receiver" placeholder="Nombre de la persona" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo de envío</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option>Envío a domicilio</option>
                        <option>Retiro en local</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Forma de pago</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option>Efectivo</option>
                        <option>Transferencia</option>
                        <option>Mercado Pago</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Dirección de envío</Label>
                    <Input placeholder="Calle, altura y departamento" />
                  </div>

                  <div className="space-y-2">
                    <Label>Fecha y hora de retiro (si aplica)</Label>
                    <Textarea
                      placeholder="Decinos el día y hora..."
                      maxLength={70}
                      className="resize-none"
                    />
                    <p className="text-[10px] text-right text-muted-foreground">
                      0/70
                    </p>
                  </div>
                </div>
              )}
            </ScrollArea>

            <div className="mt-auto pt-6 space-y-4">
              <Separator />
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total estimado</span>
                <span className="text-primary">{formatPrice(totalPrice)}</span>
              </div>

              {step === "cart" ? (
                <>
                  <Button
                    className="w-full btn-primary-custom rounded-lg"
                    onClick={() => setStep("checkout")}
                  >
                    Continuar Compra
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="w-full rounded-lg text-xs opacity-70"
                  >
                    Vaciar Carrito
                  </Button>
                </>
              ) : (
                <Button className="w-full btn-primary-custom rounded-lg bg-green-600 hover:bg-green-700">
                  Finalizar Pedido por WhatsApp
                </Button>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
