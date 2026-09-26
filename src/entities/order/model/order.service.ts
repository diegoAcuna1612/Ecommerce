import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SUPABASE_CONFIG } from '@shared/api';
import { Order, OrderInput } from './order.interface';

@Service()
export class OrderService {
    private http = inject(HttpClient);
    private endPoint = `${SUPABASE_CONFIG.baseUrl}/orders`;

    crearPedido(pedido: OrderInput): Observable<Order> {
        const { items, ...cabecera } = pedido;
        const cuerpo = { ...cabecera, order_items: items };

        return this.http
            .post<Order[]>(this.endPoint, cuerpo, {
                headers: { Prefer: 'return=representation' },
            })
            .pipe(map((respuesta) => respuesta[0]));
    }
}
