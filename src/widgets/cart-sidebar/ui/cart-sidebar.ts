import { Component, inject } from '@angular/core';
import { Cart } from '@entities/cart';
@Component({
  selector: 'app-cart-sidebar',
  imports: [],
  templateUrl: './cart-sidebar.html',
})
export class CartSidebar {
  cartService = inject(Cart)


}
