import { Component,input } from '@angular/core';
import { Product } from '@shared/api/models/product.interface';
@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
})
export class ProductCard {
  product = input.required<Product>();

}
