import { Component, effect, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Cart } from '../../model/cart.interface';
import { CartService } from '../../model/cart.service';
import { QuantitySelector } from '../quantity-selector/quantity-selector';

@Component({
  selector: 'app-cart-item',
  imports: [QuantitySelector, ReactiveFormsModule],
  templateUrl: './cart-item.html',
})
export class CartItem {
  item = input.required<Cart>();
  private cartService = inject(CartService);

  cantidad = new FormControl(1, { nonNullable: true });

  constructor() {
    effect(() => {
      this.cantidad.setValue(this.item().quantity, { emitEvent: false });
    });

    this.cantidad.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((valor) => this.cartService.updateQuantity(this.item().product.id, valor));
  }

  quitar() {
    this.cartService.removeProduct(this.item().product.id);
  }
}
