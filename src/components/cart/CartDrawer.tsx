import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export function CartDrawer() {
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
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price);
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md bg-card border-border">
        <SheetHeader>
          <SheetTitle className="font-display text-xl flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Tu Carrito
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
            <ShoppingBag className="h-16 w-16 mb-4 opacity-50" />
            <p className="text-lg">Tu carrito está vacío</p>
            <p className="text-sm mt-2">Agregá productos desde nuestra tienda</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 h-[60vh] pr-4 mt-6">
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-secondary rounded-lg"
                  >
                    <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-display font-semibold text-foreground">
                        {item.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">{item.weight}</p>
                      <p className="text-primary font-semibold mt-1">
                        {formatPrice(item.price)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded bg-muted hover:bg-border transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded bg-muted hover:bg-border transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 rounded text-destructive hover:bg-destructive/10 transition-colors ml-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="mt-6 space-y-4">
              <Separator />
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(totalPrice)}</span>
              </div>
              <Button className="w-full btn-primary-custom rounded-lg">
                Finalizar Compra
              </Button>
              <Button
                variant="outline"
                onClick={clearCart}
                className="w-full btn-outline-custom rounded-lg"
              >
                Vaciar Carrito
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
