import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout';
import { authGuard } from './guards/auth.guard';
export const routes: Routes = [
    {
        path:'',
        component:MainLayout,
        children:[
            {
                path:'',
                loadComponent: () => import('@pages/catalog')
                .then(m => m.CatalogPage)
            },
            {
                path:'product/:id',
                loadComponent: () => import('@pages/product-detail')
                .then(m => m.ProductDetailPage) 
            },
            {
                path:'login',
                loadComponent: () => import('@pages/login')
                .then(m => m.LoginPage) 
            },
            {
                path:'registro',
                loadComponent: () => import('@pages/registro')
                .then(m => m.RegistroPage) 
            },
            {
                path:'checkout',
                loadComponent: () => import('@pages/checkout')
                .then(m => m.CheckoutPage),
                canActivate: [authGuard]
            }

        ]
    }

];