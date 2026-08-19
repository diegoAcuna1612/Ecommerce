import { Routes } from '@angular/router';
import { MainLayout } from '../widgets/main-layout/ui/main-layout';
export const routes: Routes = [
    {
        path:'',
        component:MainLayout,
        children:[
            {
                path:'',
                loadComponent:()=>import('../pages/catalog/ui/catalog-page')
                .then(m=>m.CatalogPage)
            }

        ]
    }

];
