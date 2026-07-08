export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  weight: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface DiscountCode {
  id: string;
  code: string;
  type: 'monto' | 'porcentaje';
  value: number;
  active: boolean;
  description?: string;
}
