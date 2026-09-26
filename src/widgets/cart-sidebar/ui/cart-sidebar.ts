import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '@entities/cart';
import { CartItem } from '@entities/cart';
@Component({
  selector: 'app-cart-sidebar',
  imports: [CartItem],
  templateUrl: './cart-sidebar.html',
})
export class CartSidebar {
  cartService = inject(CartService)
  private router = inject(Router)

  irAlCheckout() {
    this.cartService.closeSidebar();
    this.router.navigate(['/checkout']);
  }
}
