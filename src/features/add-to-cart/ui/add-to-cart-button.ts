import { Component, computed, inject, input, output } from '@angular/core';
import { Product } from '@shared/api';
import { Button } from '@shared/ui';
import { CartService } from '@entities/cart';
@Component({
  selector: 'app-add-to-cart',
  imports: [Button],
  templateUrl: './add-to-cart-button.html',
})
export class AddToCartButton {
  product = input.required<Product>();
  private cartService=inject(CartService);

  isOutOfStock = computed(() => this.product().stock <= 0);

  addToCart(event:MouseEvent) {
    event.stopPropagation();
    this.cartService.addProduct(this.product())
  }
}
