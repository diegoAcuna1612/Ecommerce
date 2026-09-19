import { Component, input } from '@angular/core';
import { Cart } from '../../model/cart.interface';
@Component({
  selector: 'app-cart-item',
  imports: [],
  templateUrl: './cart-item.html',
})
export class CartItem {
  item = input.required<Cart>()
}
