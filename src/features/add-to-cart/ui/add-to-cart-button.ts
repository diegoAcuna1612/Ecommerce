import { Component, computed, inject, input, output } from '@angular/core';
import { Product } from '@shared/api/models/product.interface';
import { Button } from '@shared/ui';
import { Cart,CartItem } from '@entities/cart';
@Component({
  selector: 'app-add-to-cart',
  imports: [Button],
  templateUrl: './add-to-cart-button.html',
})
export class AddToCartButton {
  product = input.required<Product>();
  private cartService=inject(Cart);

  isOutOfStock = computed(() => this.product().stock <= 0);

  addToCart() {
    this.cartService.addProduct(this.product())
  }
}
