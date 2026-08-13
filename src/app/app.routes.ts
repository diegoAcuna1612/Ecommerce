import { Routes } from '@angular/router';
import { MainLayout } from './core/layouts/main-layout/main-layout';
export const routes: Routes = [
    {
        path:'',
        component:MainLayout,
        children:[
            {
                path:'',
                loadComponent:()=>import('./features/catalog/pages/catalog-page/catalog-page')
                .then(m=>m.CatalogPage)
            }

        ]
    }

];
