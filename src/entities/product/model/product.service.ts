import { inject, Service,signal } from '@angular/core';
import { Product } from './product.interface';
import { HttpClient } from '@angular/common/http';
@Service()
export class ProductService {

    private http = inject(HttpClient);
    private jsonUrl = 'data/products.json'
    private productsSignal = signal<Product[]>([])
    public products = this.productsSignal.asReadonly()

    constructor(){
        this.getProducts()
    }
    private getProducts() {
        this.http.get<Product[]>(this.jsonUrl).subscribe({
            next: (data) => this.productsSignal.set(data),
            error: (err) => console.error('Error al cargar el catálogo:', err)
        });
    }


}
