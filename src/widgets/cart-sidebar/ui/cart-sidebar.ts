import { Component, inject } from '@angular/core';
import { CartService } from '@entities/cart';
import { CartItem } from '@entities/cart';
@Component({
  selector: 'app-cart-sidebar',
  imports: [CartItem],
  templateUrl: './cart-sidebar.html',
})
export class CartSidebar {
  cartService = inject(CartService)
}
