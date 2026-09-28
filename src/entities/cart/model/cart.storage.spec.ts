import { cargarCarrito, guardarCarrito } from './cart.storage';
import { Cart } from './cart.interface';
import { Product } from '@shared/api';

function crearItem(overrides: Partial<Cart> = {}): Cart {
    const producto: Product = {
        id: 1,
        title: 'Polo',
        price: 50,
        stock: 10,
        image_url: 'polo.jpg',
        category_id: 1,
        created_at: '2026-01-01',
    };

    return { product: producto, quantity: 1, ...overrides };
}

describe('cart.storage', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('devuelve un arreglo vacío si no hay nada guardado', () => {
        expect(cargarCarrito()).toEqual([]);
    });

    it('devuelve un arreglo vacío si el contenido no es JSON válido', () => {
        localStorage.setItem('carrito', '{no-json');

        expect(cargarCarrito()).toEqual([]);
    });

    it('devuelve un arreglo vacío si el contenido no es un arreglo', () => {
        localStorage.setItem('carrito', JSON.stringify({ product: 1 }));

        expect(cargarCarrito()).toEqual([]);
    });

    it('filtra las entradas inválidas', () => {
        localStorage.setItem(
            'carrito',
            JSON.stringify([
                crearItem(),
                { quantity: 2 },
                { product: { id: null }, quantity: 1 },
                null,
            ]),
        );

        const cargado = cargarCarrito();

        expect(cargado).toHaveLength(1);
        expect(cargado[0].product.id).toBe(1);
    });

    it('guarda y recupera el carrito (round-trip)', () => {
        const carrito = [crearItem({ quantity: 3 })];

        guardarCarrito(carrito);

        expect(cargarCarrito()).toEqual(carrito);
    });
});
