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