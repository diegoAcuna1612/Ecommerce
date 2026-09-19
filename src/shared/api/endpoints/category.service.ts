import { inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category.interface';
import { SUPABASE_CONFIG } from '../client';

@Service()
export class CategoryService {

    private http = inject(HttpClient);
    private endPoint = SUPABASE_CONFIG.baseUrl;
    private categoriesSignal = signal<Category[]>([]);
    public category = this.categoriesSignal.asReadonly();

    constructor() {
        this.getCategories();
    }

    private getCategories() {
        const queryUrl = `${this.endPoint}/categories?select=id,name,slug&order=name.asc`;
        this.http.get<Category[]>(queryUrl).subscribe({
            next: (data) => this.categoriesSignal.set(data),
            error: (err) => console.error('Error al cargar las categorías:', err),
        });
    }


}
