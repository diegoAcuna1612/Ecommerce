import { inject, Service } from '@angular/core';
import { Product } from '../models/product.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SUPABASE_CONFIG } from '../client';

export interface ResultadoBusqueda {
    productos: Product[];
    total: number;
}

@Service()
export class ProductService {

    private http = inject(HttpClient);
    private endPoint = `${SUPABASE_CONFIG.baseUrl}/products`;

    buscar(texto: string, categoriaId: string, pagina: number, tamanoPagina = 10): Observable<ResultadoBusqueda> {
        const offset = (pagina - 1) * tamanoPagina;

        let params = new HttpParams()
            .set('select', '*,categories(id,name,slug)')
            .set('order', 'created_at.desc')
            .set('offset', offset)
            .set('limit', tamanoPagina);

        if (texto.trim()) {
            params = params.set('title', `ilike.*${this.escapeFiltro(texto.trim())}*`);
        }

        if (categoriaId) {
            params = params.set('category_id', `eq.${categoriaId}`);
        }

        return this.http.get<Product[]>(this.endPoint, {
            params,
            observe: 'response',
            headers: { Prefer: 'count=exact' },
        }).pipe(
            map((respuesta) => ({
                productos: respuesta.body ?? [],
                total: this.parseTotal(respuesta.headers.get('Content-Range')),
            })),
        );
    }

    obtenerPorId(id: string): Observable<Product | null> {
        const params = new HttpParams()
            .set('id', `eq.${id}`)
            .set('select', '*,categories(id,name,slug)')
            .set('limit', '1');

        return this.http
            .get<Product[]>(this.endPoint, { params })
            .pipe(map((respuesta) => respuesta[0] ?? null));
    }

    private parseTotal(contentRange: string | null): number {
        if (!contentRange) {
            return 0;
        }

        const total = contentRange.split('/')[1];
        return Number(total) || 0;
    }

    private escapeFiltro(texto: string): string {
        return texto.replace(/[%,()]/g, (caracter) => `\\${caracter}`);
    }


}
