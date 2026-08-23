export interface Product {
  id: number | string;
  title: string;
  description?:string;
  price: number;
  stock: number;
  image_url: string;
  category_id: number | string;
  created_at: string;
}
