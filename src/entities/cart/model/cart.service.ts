import { computed, Service, signal } from '@angular/core';
import { CartItem } from './cart.interface';
import { Product } from '@shared/api';

@Service()
export class Cart {
    isSidebarOpen = signal<boolean>(false)
    private state =signal<CartItem[]>([])
    public items = this.state.asReadonly()

    toggleSidebar(){
        console.log('llego al toggle')
        this.isSidebarOpen.update((v) => !v);
    }

    closeSidebar(){
        this.isSidebarOpen.set(false);
    }

    totalItems=computed(()=>this.items().reduce((total,item)=>total + item.quantity,0))
    totalPrice= computed(()=>this.items().reduce((total,item)=>total + (item.product.price*item.quantity),0))
    
    addProduct(product: Product) {
        this.state.update((currentItems) => {
            const existingItem = currentItems.find(item => item.product.id === product.id);
            
            if (existingItem) {
                return currentItems.map(item => 
                    item.product.id === product.id 
                        ? { ...item, quantity: item.quantity + 1 } 
                        : item
                );
            }
        return [...currentItems, { product, quantity: 1 }];
        });
        console.log(this.state())

    }
}
