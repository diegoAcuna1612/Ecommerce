import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { OrderService } from './order.service';
import { OrderInput } from './order.interface';
import { SUPABASE_CONFIG } from '@shared/api';

describe('OrderService', () => {
    let service: OrderService;
    let httpMock: HttpTestingController;

    const pedido: OrderInput = {
        nombre: 'Ana',
        email: 'ana@test.com',
        tipo_entrega: 'casa',
        direccion: 'Av. Siempre Viva 123',
        ciudad: 'Lima',
        metodo_pago: 'tarjeta',
        total: 118,
        items: [
            { product_id: 1, title: 'Polo', quantity: 2, unit_price: 50 },
        ],
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(OrderService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('envía el pedido con order_items y devuelve la primera orden', () => {
        let resultado: unknown;

        service.crearPedido(pedido).subscribe((orden) => (resultado = orden));

        const peticion = httpMock.expectOne(`${SUPABASE_CONFIG.baseUrl}/orders`);

        expect(peticion.request.method).toBe('POST');
        expect(peticion.request.headers.get('Prefer')).toBe('return=representation');
        expect(peticion.request.body.order_items).toEqual(pedido.items);
        expect(peticion.request.body.nombre).toBe('Ana');

        const ordenCreada = { ...pedido, id: 99, created_at: '2026-01-01' };
        peticion.flush([ordenCreada]);

        expect(resultado).toEqual(ordenCreada);
    });
});
