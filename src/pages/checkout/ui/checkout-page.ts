import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { CartService } from '@entities/cart';
import { OrderInput, OrderService } from '@entities/order';
import { titularCoincide, vencimientoFuturo } from '@shared/forms';
import { validarStock } from '../model/checkout.validators';

type EstadoEnvio = 'idle' | 'enviando' | 'exito' | 'error';

@Component({
    selector: 'app-checkout-page',
    imports: [ReactiveFormsModule],
    templateUrl: './checkout-page.html',
})
export class CheckoutPage {
    private fb = inject(FormBuilder);
    private http = inject(HttpClient);
    private orderService = inject(OrderService);
    cartService = inject(CartService);

    checkoutForm = this.fb.group(
        {
            contacto: this.fb.group({
                nombre: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]],
            }),
            envio: this.fb.group({
                tipo: ['casa', Validators.required],
                direccion: ['', Validators.required],
                ciudad: ['', Validators.required],
            }),
            pago: this.fb.group({
                metodo: ['tarjeta', Validators.required],
                titular: ['', Validators.required],
                numeroTarjeta: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
                vencimiento: ['', [Validators.required, vencimientoFuturo()]],
                cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
            }),
        },
        {
            validators: [titularCoincide],
            asyncValidators: [validarStock(this.http, this.cartService)],
        },
    );

    estado = signal<EstadoEnvio>('idle');

    private formStatus = toSignal(this.checkoutForm.statusChanges, {
        initialValue: this.checkoutForm.status,
    });

    puedeEnviar = computed(() => this.formStatus() === 'VALID' && this.estado() === 'idle');
    verificandoStock = computed(() => this.formStatus() === 'PENDING');
    exito = computed(() => this.estado() === 'exito');

    constructor() {
        this.configurarReactividadCondicional();
    }

    get contacto() {
        return this.checkoutForm.controls.contacto;
    }

    get pago() {
        return this.checkoutForm.controls.pago;
    }

    get nombre() {
        return this.checkoutForm.get('contacto.nombre')!;
    }

    get email() {
        return this.checkoutForm.get('contacto.email')!;
    }

    get direccion() {
        return this.checkoutForm.get('envio.direccion')!;
    }

    get ciudad() {
        return this.checkoutForm.get('envio.ciudad')!;
    }

    get titular() {
        return this.checkoutForm.get('pago.titular')!;
    }

    get numeroTarjeta() {
        return this.checkoutForm.get('pago.numeroTarjeta')!;
    }

    get vencimiento() {
        return this.checkoutForm.get('pago.vencimiento')!;
    }

    get cvv() {
        return this.checkoutForm.get('pago.cvv')!;
    }

    get esEnvioDomicilio() {
        return this.checkoutForm.get('envio.tipo')?.value === 'casa';
    }

    get esPagoConTarjeta() {
        return this.checkoutForm.get('pago.metodo')?.value === 'tarjeta';
    }

    private configurarReactividadCondicional(): void {
        const tipo = this.checkoutForm.get('envio.tipo')!;
        const direccion = this.checkoutForm.get('envio.direccion')!;
        const ciudad = this.checkoutForm.get('envio.ciudad')!;

        tipo.valueChanges.subscribe((valor) => {
            if (valor === 'recojo') {
                direccion.reset('');
                ciudad.reset('');
                direccion.disable();
                ciudad.disable();
            } else {
                direccion.enable();
                ciudad.enable();
            }
            direccion.updateValueAndValidity();
            ciudad.updateValueAndValidity();
        });

        const metodo = this.checkoutForm.get('pago.metodo')!;
        const camposTarjeta = ['titular', 'numeroTarjeta', 'vencimiento', 'cvv'];

        metodo.valueChanges.subscribe((valor) => {
            camposTarjeta.forEach((nombreCampo) => {
                const control = this.checkoutForm.get(`pago.${nombreCampo}`)!;
                if (valor === 'contraentrega') {
                    control.reset('');
                    control.disable();
                } else {
                    control.enable();
                }
                control.updateValueAndValidity();
            });
        });
    }

    guardar(): void {
        if (this.checkoutForm.invalid) {
            this.checkoutForm.markAllAsTouched();
            return;
        }

        this.estado.set('enviando');

        this.orderService.crearPedido(this.construirPedido()).subscribe({
            next: () => {
                this.estado.set('exito');
                this.checkoutForm.reset({
                    envio: { tipo: 'casa' },
                    pago: { metodo: 'tarjeta' },
                });
                this.cartService.clearCart();
            },
            error: () => this.estado.set('error'),
        });
    }

    private construirPedido(): OrderInput {
        const valor = this.checkoutForm.getRawValue();
        const esDomicilio = valor.envio.tipo === 'casa';

        return {
            nombre: valor.contacto.nombre!,
            email: valor.contacto.email!,
            tipo_entrega: valor.envio.tipo as 'casa' | 'recojo',
            direccion: esDomicilio ? valor.envio.direccion : null,
            ciudad: esDomicilio ? valor.envio.ciudad : null,
            metodo_pago: valor.pago.metodo as 'tarjeta' | 'contraentrega',
            total: this.cartService.total(),
            items: this.cartService.items().map((item) => ({
                product_id: item.product.id,
                title: item.product.title,
                quantity: item.quantity,
                unit_price: item.product.price,
            })),
        };
    }
}
