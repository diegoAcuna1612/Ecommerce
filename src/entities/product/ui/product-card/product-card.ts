import { Component,input, output } from '@angular/core';
import { Product } from '@shared/api';
@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
})
export class ProductCard {
  product = input.required<Product>();
  productClick = output<Product>();
  onClick(){
    this.productClick.emit(this.product())
  }

}
