import { Product } from "@/contexts/CartContext";

export type PurchaseMode = "weight" | "unit";

export interface PurchaseSelection {
  mode: PurchaseMode;
  amount: number;
  label: string;
  price: number;
}

export const isWholeChickenProduct = (product: Pick<Product, "category" | "name">): boolean => {
  const haystack = `${product.category ?? ""} ${product.name ?? ""}`.toLowerCase();
  return /pollo\s+entero|entero\s+pollo|whole chicken|pollo/i.test(haystack) && /entero|whole/i.test(haystack);
};

export const getPurchaseMode = (product: Pick<Product, "saleType" | "category" | "name">): PurchaseMode => {
  const rawType = String(product.saleType ?? "").trim().toLowerCase();

  if (rawType === "unit" || rawType === "unidad" || rawType === "unidades") {
    return "unit";
  }

  if (rawType === "weight" || rawType === "kg" || rawType === "kilo" || rawType === "kilogramo") {
    return "weight";
  }

  if (isWholeChickenProduct(product)) {
    return "unit";
  }

  const haystack = `${product.category ?? ""} ${product.name ?? ""}`.toLowerCase();
  const unitKeywords = /(beb|refresc|gase|agua|jugo|vino|cerve|cafe|te|leche|yog|soda|drink|beer|wine|milk|condiment|condimentos|leña|carbon|carbón)/i;

  return unitKeywords.test(haystack) ? "unit" : "weight";
};

export const getPurchaseSelection = (
  product: Product,
  amount: number,
): PurchaseSelection => {
  const mode = getPurchaseMode(product);
  const safeAmount = Number.isFinite(amount) && amount > 0 ? amount : 1;
  const price = safeAmount * product.price;

  return {
    mode,
    amount: safeAmount,
    label: formatPurchaseLabel(mode, safeAmount),
    price,
  };
};

export const formatPurchaseLabel = (mode: PurchaseMode, amount: number): string => {
  if (mode === "weight") {
    if (amount >= 1) {
      return `${amount.toLocaleString("es-AR", { maximumFractionDigits: 2 })} kg`;
    }

    const grams = Math.round(amount * 1000);
    return `${grams} g`;
  }

  const rounded = Number.isInteger(amount) ? Math.round(amount) : amount;
  return `${rounded.toLocaleString("es-AR", { maximumFractionDigits: 2 })} unidad${rounded === 1 ? "" : "es"}`;
};

export const formatWeightLabel = (amount: number): string => {
  if (amount >= 1) {
    return `${amount.toLocaleString("es-AR", { maximumFractionDigits: 2 })} kg`;
  }

  return `${Math.round(amount * 1000)} g`;
};
