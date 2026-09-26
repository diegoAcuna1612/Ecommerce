import { Cart } from './cart.interface';

const CLAVE_CARRITO = 'carrito';

export function cargarCarrito(): Cart[] {
    if (typeof localStorage === 'undefined') {
        return [];
    }

    try {
        const crudo = localStorage.getItem(CLAVE_CARRITO);
        if (!crudo) {
            return [];
        }

        const datos = JSON.parse(crudo) as unknown;
        if (!Array.isArray(datos)) {
            return [];
        }

        return datos.filter(
            (item): item is Cart =>
                !!item &&
                typeof item.quantity === 'number' &&
                !!item.product &&
                item.product.id != null,
        );
    } catch {
        return [];
    }
}

export function guardarCarrito(items: Cart[]): void {
    if (typeof localStorage === 'undefined') {
        return;
    }

    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
}
