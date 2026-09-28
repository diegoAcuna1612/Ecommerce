import { computed, effect, Service, signal, untracked } from '@angular/core';
import { Cart } from './cart.interface';
import { Product } from '@shared/api';
import { cargarCarrito, guardarCarrito } from './cart.storage';

@Service()
export class CartService {
    isSidebarOpen = signal<boolean>(false);

    private state = signal<Cart[]>(cargarCarrito());
    public items = this.state.asReadonly();

    totalItems = computed(() =>
        this.items().reduce((total, item) => total + item.quantity, 0),
    );

    subtotal = computed(() =>
        this.items().reduce((total, item) => total + item.product.price * item.quantity, 0),
    );

    igv = computed(() => this.subtotal() * 0.18);

    total = computed(() => this.subtotal() + this.igv());

    moneda = signal('S/');

    totalFormateado = computed(
        () => `${untracked(() => this.moneda())} ${this.total().toFixed(2)}`,
    );

    constructor() {
        effect(() => guardarCarrito(this.items()));
    }

    toggleSidebar() {
        this.isSidebarOpen.update((v) => !v);
    }

    openSidebar() {
        this.isSidebarOpen.set(true);
    }

    closeSidebar() {
        this.isSidebarOpen.set(false);
    }

    addProduct(product: Product, quantity = 1) {
        if (quantity <= 0) {
            return;
        }

        this.state.update((currentItems) => {
            const existingItem = currentItems.find((item) => item.product.id === product.id);

            if (existingItem) {
                return currentItems.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item,
                );
            }
            return [...currentItems, { product, quantity }];
        });
    }

    updateQuantity(productId: Product['id'], quantity: number) {
        if (quantity <= 0) {
            this.removeProduct(productId);
            return;
        }

        this.state.update((currentItems) =>
            currentItems.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item,
            ),
        );
    }

    removeProduct(productId: Product['id']) {
        this.state.update((currentItems) =>
            currentItems.filter((item) => item.product.id !== productId),
        );
    }

    clearCart() {
        this.state.set([]);
    }
}
