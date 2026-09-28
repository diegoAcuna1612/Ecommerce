export interface Product {
  id: number | string;
  title: string;
  description?:string;
  price: number;
  stock: number;
  image_url: string;
  category_id: number | string;
  categories?:{
    id?: number | string;
    name:string;
    slug:string;
  }
  created_at: string;
}
