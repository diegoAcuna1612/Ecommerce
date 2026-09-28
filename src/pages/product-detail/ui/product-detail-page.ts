import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductService } from '@shared/api';
import { CartService, QuantitySelector } from '@entities/cart';

@Component({
    selector: 'app-product-detail-page',
    imports: [ReactiveFormsModule, RouterLink, QuantitySelector],
    templateUrl: './product-detail-page.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailPage {
    private route = inject(ActivatedRoute);
    private productService = inject(ProductService);
    private cartService = inject(CartService);

    readonly id = signal(this.route.snapshot.paramMap.get('id') ?? '');

    readonly producto = rxResource({
        params: () => this.id(),
        stream: ({ params }) => this.productService.obtenerPorId(params),
    });

    readonly cantidad = new FormControl(1, { nonNullable: true });

    readonly agotado = computed(() => {
        const producto = this.producto.value();
        return !!producto && producto.stock <= 0;
    });

    readonly noEncontrado = computed(
        () =>
            !this.producto.isLoading() &&
            !this.producto.error() &&
            this.producto.value() === null,
    );

    agregarAlCarrito(): void {
        const producto = this.producto.value();
        if (!producto || producto.stock <= 0) {
            return;
        }

        this.cartService.addProduct(producto, this.cantidad.value);
        this.cartService.openSidebar();
    }
}
