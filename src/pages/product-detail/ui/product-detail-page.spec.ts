import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { ProductDetailPage } from './product-detail-page';
import { CartService } from '@entities/cart';
import { Product } from '@shared/api';

function crearProducto(overrides: Partial<Product> = {}): Product {
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
        ...overrides,
    };
}

describe('ProductDetailPage', () => {
    let fixture: ComponentFixture<ProductDetailPage>;
    let componente: ProductDetailPage;
    let httpMock: HttpTestingController;
    let cartService: CartService;

    function responderCon(productos: Product[]): void {
        const peticion = httpMock.expectOne((req) => req.method === 'GET');
        peticion.flush(productos);
    }

    beforeEach(async () => {
        localStorage.clear();
        TestBed.configureTestingModule({
            imports: [ProductDetailPage],
            providers: [
                provideRouter([]),
                provideHttpClient(),
                provideHttpClientTesting(),
                {
                    provide: ActivatedRoute,
                    useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } },
                },
            ],
        });

        fixture = TestBed.createComponent(ProductDetailPage);
        componente = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        cartService = TestBed.inject(CartService);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('renderiza los datos del producto', async () => {
        fixture.detectChanges();

        responderCon([crearProducto()]);
        await fixture.whenStable();
        fixture.detectChanges();

        const texto = fixture.nativeElement.textContent as string;
        expect(texto).toContain('Polo');
        expect(texto).toContain('S/ 50.00');
        expect(texto).toContain('Ropa');
    });

    it('muestra el estado de producto no encontrado', async () => {
        fixture.detectChanges();

        responderCon([]);
        await fixture.whenStable();
        fixture.detectChanges();

        expect(fixture.nativeElement.textContent).toContain('Producto no encontrado');
    });

    it('agrega al carrito la cantidad seleccionada y abre el sidebar', async () => {
        fixture.detectChanges();

        responderCon([crearProducto({ stock: 10 })]);
        await fixture.whenStable();
        fixture.detectChanges();

        componente.cantidad.setValue(3);
        componente.agregarAlCarrito();

        expect(cartService.items()).toHaveLength(1);
        expect(cartService.items()[0].quantity).toBe(3);
        expect(cartService.isSidebarOpen()).toBe(true);
    });

    it('deshabilita el botón cuando no hay stock', async () => {
        fixture.detectChanges();

        responderCon([crearProducto({ stock: 0 })]);
        await fixture.whenStable();
        fixture.detectChanges();

        const boton = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
        expect(boton.disabled).toBe(true);
        expect(fixture.nativeElement.textContent).toContain('Producto agotado');
    });
});
