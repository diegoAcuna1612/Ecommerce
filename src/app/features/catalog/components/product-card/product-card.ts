import { Component,input, output} from '@angular/core';
import { Product } from '../../interfaces/product.interface';
@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
})
export class ProductCard {
  product = input.required<Product>();
  addToCart = output<Product>()

  onAdd(){
    this.addToCart.emit(this.product());
  }

}
