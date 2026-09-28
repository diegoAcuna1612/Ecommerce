import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from '@shared/api';

/** Crea un producto completo para usar en los tests. */
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

describe('CartService', () => {
    let service: CartService;

    beforeEach(() => {
        localStorage.clear();
        TestBed.configureTestingModule({});
        service = TestBed.inject(CartService);
    });

    it('inicia con el carrito vacío', () => {
        expect(service.items()).toEqual([]);
        expect(service.subtotal()).toBe(0);
        expect(service.totalItems()).toBe(0);
    });

    it('agrega un producto nuevo', () => {
        // Arrange
        const polo = crearProducto();

        // Act
        service.addProduct(polo);

        // Assert
        expect(service.items()).toHaveLength(1);
        expect(service.items()[0].quantity).toBe(1);
    });

    it('agrega varias unidades de un producto nuevo', () => {
        service.addProduct(crearProducto({ id: 3 }), 4);

        expect(service.items()).toHaveLength(1);
        expect(service.items()[0].quantity).toBe(4);
        expect(service.totalItems()).toBe(4);
    });

    it('ignora cantidades menores o iguales a cero', () => {
        service.addProduct(crearProducto({ id: 3 }), 0);

        expect(service.items()).toEqual([]);
    });

    it('incrementa la cantidad si el producto ya existe', () => {
        const polo = crearProducto();

        service.addProduct(polo);
        service.addProduct(polo);

        expect(service.items()).toHaveLength(1);
        expect(service.items()[0].quantity).toBe(2);
    });

    it('calcula subtotal, igv y total', () => {
        service.addProduct(crearProducto({ id: 1, price: 50 }));
        service.addProduct(crearProducto({ id: 2, price: 30 }));
        service.addProduct(crearProducto({ id: 2, price: 30 }));

        // 50 + 30*2 = 110
        expect(service.subtotal()).toBe(110);
        expect(service.igv()).toBeCloseTo(19.8);
        expect(service.total()).toBeCloseTo(129.8);
        expect(service.totalItems()).toBe(3);
    });

    it('actualiza la cantidad de un producto', () => {
        service.addProduct(crearProducto({ id: 7 }));

        service.updateQuantity(7, 4);

        expect(service.items()[0].quantity).toBe(4);
    });

    it('elimina el producto si la cantidad es cero o menor', () => {
        service.addProduct(crearProducto({ id: 7 }));

        service.updateQuantity(7, 0);

        expect(service.items()).toEqual([]);
    });

    it('elimina un producto por su id', () => {
        service.addProduct(crearProducto({ id: 1 }));
        service.addProduct(crearProducto({ id: 2 }));

        service.removeProduct(1);

        expect(service.items().map((item) => item.product.id)).toEqual([2]);
    });

    it('vacía el carrito', () => {
        service.addProduct(crearProducto({ id: 1 }));
        service.addProduct(crearProducto({ id: 2 }));

        service.clearCart();

        expect(service.items()).toEqual([]);
        expect(service.subtotal()).toBe(0);
    });

    it('formatea el total con la moneda configurada', () => {
        service.addProduct(crearProducto({ price: 100 }));

        expect(service.totalFormateado()).toBe('S/ 118.00');
    });

    it('abre y cierra el sidebar', () => {
        expect(service.isSidebarOpen()).toBe(false);

        service.openSidebar();
        expect(service.isSidebarOpen()).toBe(true);

        service.toggleSidebar();
        expect(service.isSidebarOpen()).toBe(false);

        service.toggleSidebar();
        expect(service.isSidebarOpen()).toBe(true);

        service.closeSidebar();
        expect(service.isSidebarOpen()).toBe(false);
    });

    it('guarda el carrito en localStorage', () => {
        service.addProduct(crearProducto({ id: 5 }));

        // El effect de guardado se ejecuta al vaciar la cola de efectos.
        TestBed.tick();

        const guardado = JSON.parse(localStorage.getItem('carrito') ?? '[]');
        expect(guardado).toHaveLength(1);
        expect(guardado[0].product.id).toBe(5);
    });
});
