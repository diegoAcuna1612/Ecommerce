import { inject, Service,signal } from '@angular/core';
import { Product } from '../models/product.interface';
import { HttpClient } from '@angular/common/http';
import { SUPABASE_CONFIG } from '../client';
@Service()
export class CategoryService {

    private http = inject(HttpClient);
    private endPoint= SUPABASE_CONFIG.baseUrl
    private options= {headers: SUPABASE_CONFIG.header}
    private categoriesSignal = signal<Product[]>([])
    public category = this.categoriesSignal.asReadonly()

    constructor(){
        this.getCategories()
    }
    private getCategories() {
        this.http.get<Product[]>(this.endPoint+'/categories',this.options).subscribe({
            next: (data) => this.categoriesSignal.set(data),
            error: (err) => console.error('Error al cargar el catálogo:', err)
        });
    }


}
