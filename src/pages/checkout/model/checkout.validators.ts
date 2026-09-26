import { AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, of, switchMap, timer } from 'rxjs';
import { CartService } from '@entities/cart';
import { SUPABASE_CONFIG } from '@shared/api';

export function validarStock(http: HttpClient, cart: CartService): AsyncValidatorFn {
    return (): Observable<ValidationErrors | null> => {
        const items = cart.items();

        if (items.length === 0) {
            return of({ carritoVacio: true });
        }

        const consultas = items.map((item) =>
            http
                .get<{ stock: number }[]>(
                    `${SUPABASE_CONFIG.baseUrl}/products?id=eq.${item.product.id}&select=stock`,
                )
                .pipe(
                    map((respuesta) => ({
                        id: item.product.id,
                        hay: (respuesta[0]?.stock ?? 0) >= item.quantity,
                    })),
                ),
        );

        return timer(400).pipe(
            switchMap(() => forkJoin(consultas)),
            map((resultados) => (resultados.every((r) => r.hay) ? null : { sinStock: true })),
            catchError(() => of(null)),
        );
    };
}
