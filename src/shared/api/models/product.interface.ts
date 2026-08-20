export interface Product {
  id: number | string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  description?: string;
}