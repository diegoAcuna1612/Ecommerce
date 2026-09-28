import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddToCartButton } from './add-to-cart-button';
import { CartService } from '@entities/cart';
import { Product } from '@shared/api';

function crearProducto(overrides: Partial<Product> = {}): Product {
    return {
        id: 1,
        title: 'Polo',
        price: 50,
        stock: 10,
        image_url: 'polo.jpg',
        category_id: 1,
        created_at: '2026-01-01',
        ...overrides,
    };
}

describe('AddToCartButton', () => {
    let fixture: ComponentFixture<AddToCartButton>;
    let componente: AddToCartButton;
    let cartService: CartService;

    beforeEach(() => {
        localStorage.clear();
        TestBed.configureTestingModule({ imports: [AddToCartButton] });
        fixture = TestBed.createComponent(AddToCartButton);
        componente = fixture.componentInstance;
        cartService = TestBed.inject(CartService);
    });

    it('agrega el producto al carrito al hacer clic', () => {
        fixture.componentRef.setInput('product', crearProducto());
        fixture.detectChanges();

        const boton = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
        boton.click();

        expect(cartService.items()).toHaveLength(1);
        expect(cartService.items()[0].product.id).toBe(1);
    });

    it('marca como agotado cuando no hay stock', () => {
        fixture.componentRef.setInput('product', crearProducto({ stock: 0 }));
        fixture.detectChanges();

        expect(componente.isOutOfStock()).toBe(true);

        const boton = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
        expect(boton.disabled).toBe(true);
    });
});
