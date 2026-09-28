import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product.interface';
import { SUPABASE_CONFIG } from '../client';

function crearProducto(): Product {
    return {
        id: 1,
        title: 'Polo',
        description: 'Polo de algodón',
        price: 50,
        stock: 10,
        image_url: 'polo.jpg',
        category_id: 1,
        categories: { name: 'Ropa', slug: 'ropa' },
        created_at: '2026-01-01',
    };
}

describe('ProductService', () => {
    let service: ProductService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(ProductService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('obtenerPorId', () => {
        it('consulta el producto con su categoría y lo devuelve', () => {
            const producto = crearProducto();
            let resultado: Product | null | undefined;

            service.obtenerPorId('1').subscribe((valor) => (resultado = valor));

            const peticion = httpMock.expectOne(
                (req) =>
                    req.url === `${SUPABASE_CONFIG.baseUrl}/products` &&
                    req.params.get('id') === 'eq.1' &&
                    req.params.get('limit') === '1' &&
                    req.params.get('select') === '*,categories(id,name,slug)',
            );
            expect(peticion.request.method).toBe('GET');

            peticion.flush([producto]);

            expect(resultado).toEqual(producto);
        });

        it('devuelve null cuando no hay resultados', () => {
            let resultado: Product | null | undefined;

            service.obtenerPorId('999').subscribe((valor) => (resultado = valor));

            httpMock.expectOne((req) => req.params.get('id') === 'eq.999').flush([]);

            expect(resultado).toBeNull();
        });
    });
});
