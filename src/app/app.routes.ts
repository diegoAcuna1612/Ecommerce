import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout';
export const routes: Routes = [
    {
        path:'',
        component:MainLayout,
        children:[
            {
                path:'',
                loadComponent: () => import('@pages/catalog')
                .then(m => m.CatalogPage)
            }

        ]
    }

];
