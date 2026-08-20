import { Component,computed,input, output} from '@angular/core';
import { Product } from '@shared/api/models/product.interface';
import { Button } from '@shared/ui';
@Component({
  selector: 'app-product-card',
  imports: [Button],
  templateUrl: './product-card.html',
})
export class ProductCard {
  product = input.required<Product>();
  addToCart = output<Product>()
  isOutOfStock=computed(()=>this.product().stock <= 0)

  handleComprarClick(event:MouseEvent){
    this.addToCart.emit(this.product());
  }
}
