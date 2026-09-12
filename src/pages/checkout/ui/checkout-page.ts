import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '@entities/cart';

@Component({
    selector: 'app-checkout-page',
    imports: [ReactiveFormsModule],
    templateUrl: './checkout-page.html',
})
export class CheckoutPage {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    cartService = inject(CartService);

    checkoutForm = this.fb.group({
        nombreCompleto: ['', Validators.required],
        direccion: ['', Validators.required],
        numeroTarjeta: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
        cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
    });

    get nombreCompleto() {
        return this.checkoutForm.get('nombreCompleto');
    }

    get direccion() {
        return this.checkoutForm.get('direccion');
    }

    get numeroTarjeta() {
        return this.checkoutForm.get('numeroTarjeta');
    }

    get cvv() {
        return this.checkoutForm.get('cvv');
    }

    confirmarPedido() {
        if (this.checkoutForm.invalid) {
            this.checkoutForm.markAllAsTouched();
            return;
        }

        console.log('Pedido confirmado', {
            ...this.checkoutForm.value,
            items: this.cartService.items(),
            total: this.cartService.totalPrice(),
        });

        this.cartService.clearCart();
        this.router.navigate(['/']);
    }
}