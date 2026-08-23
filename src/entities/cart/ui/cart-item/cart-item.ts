import { Component, input } from '@angular/core';
import { Cart } from '@entities/cart';
@Component({
  selector: 'app-cart-item',
  imports: [],
  templateUrl: './cart-item.html',
})
export class CartItem {
  item = input.required<Cart>()
}
