import { Product } from "@shared/api";

export interface CartItem{
    product: Product,
    quantity:number
}