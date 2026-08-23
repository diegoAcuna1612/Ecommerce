import { inject, Service,signal } from '@angular/core';
import { Product } from '../models/product.interface';
import { HttpClient } from '@angular/common/http';
import { SUPABASE_CONFIG } from '../client';
@Service()
export class ProductService {

    private http = inject(HttpClient);
    private endPoint = `${SUPABASE_CONFIG.baseUrl}/products`;
    private options= {headers: SUPABASE_CONFIG.header}
    
    private productsSignal = signal<Product[]>([])
    public products = this.productsSignal.asReadonly()

    constructor(){
        this.getProducts()
    }
    private getProducts() {
        const queryUrl = `${this.endPoint}?select=*,categories(name,slug)`;
        this.http.get<Product[]>(queryUrl,this.options).subscribe({
            next: (data) => this.productsSignal.set(data),
            error: (err) => console.error('Error al cargar el catálogo:', err)
        });
    }


}
