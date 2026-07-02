import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  getPurchaseMode,
  getPurchaseSelection,
  isWholeChickenProduct,
  PurchaseSelection,
} from "@/lib/purchase";
import { Product } from "@/contexts/CartContext";

interface PurchaseSelectorProps {
  product: Product;
  onSelectionChange?: (selection: PurchaseSelection) => void;
}

export function PurchaseSelector({ product, onSelectionChange }: PurchaseSelectorProps) {
  const mode = getPurchaseMode(product);
  const isWeight = mode === "weight";
  const isWholeChicken = isWholeChickenProduct(product);

  const [preset, setPreset] = useState<string>(isWeight ? "1" : "1");
  const [customValue, setCustomValue] = useState("1");
  const [customUnit, setCustomUnit] = useState<"kg" | "g">("kg");

  useEffect(() => {
    setPreset(isWeight ? "1" : "1");
    setCustomValue("1");
    setCustomUnit("kg");
  }, [product.id, isWeight]);

  const resolvedAmount = useMemo(() => {
    if (preset === "custom") {
      const parsed = Number.parseFloat(customValue);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        return isWeight ? 1 : 1;
      }

      if (!isWeight) {
        return Math.round(parsed);
      }

      return customUnit === "g" ? parsed / 1000 : parsed;
    }

    return Number.parseFloat(preset) || 1;
  }, [customUnit, customValue, isWeight, preset]);

  const selection = useMemo(
    () => getPurchaseSelection(product, resolvedAmount),
    [product, resolvedAmount],
  );

  useEffect(() => {
    onSelectionChange?.(selection);
  }, [onSelectionChange, selection]);

  const presetOptions = isWeight
    ? [
        { value: "1", label: "1 kg" },
        { value: "0.5", label: "500 g" },
        { value: "0.25", label: "250 g" },
        { value: "custom", label: "Personalizado" },
      ]
    : [
        { value: "1", label: "1 unidad" },
        { value: "2", label: "2 unidades" },
        { value: "3", label: "3 unidades" },
        { value: "custom", label: "Personalizado" },
      ];

  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">
        {isWeight ? "Cantidad" : "Unidades"}
      </label>
      <select
        value={preset}
        onChange={(e) => setPreset(e.target.value)}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {presetOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {preset === "custom" && (
        <div className="flex gap-2">
          <Input
            type="number"
            min={isWeight ? "0.1" : "1"}
            step={isWeight ? "0.1" : "1"}
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            className="h-10"
            placeholder={isWeight ? "Peso" : "Cantidad"}
          />
          {isWeight && (
            <select
              value={customUnit}
              onChange={(e) => setCustomUnit(e.target.value as "kg" | "g")}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="kg">kg</option>
              <option value="g">g</option>
            </select>
          )}
        </div>
      )}

      <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 px-3 py-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
            {isWeight ? "Precio estimado" : "Precio"}
          </p>
          <p className="text-sm font-semibold text-foreground">
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(selection.price)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
            {isWeight ? "Seleccionado" : "Cantidad"}
          </p>
          <p className="text-sm font-semibold text-primary">{selection.label}</p>
        </div>
      </div>

      {isWholeChicken && (
        <p className="text-[11px] text-amber-700 font-medium">
          Al mandar el pedido se pesará y te pasaremos el precio.
        </p>
      )}

      {isWeight && (
        <p className="text-[11px] text-muted-foreground italic">
          El precio puede variar, el corte no es preciso.
        </p>
      )}
    </div>
  );
}
