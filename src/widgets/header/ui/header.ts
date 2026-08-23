import { Component, inject } from '@angular/core';
import { Button } from '@shared/ui';
import { CartService } from '@entities/cart';
@Component({
  selector: 'app-header',
  imports: [Button],
  templateUrl: './header.html',
})
export class Header {
  cartService = inject(CartService)
  
  handleIniciarSesion(event:MouseEvent){
    console.log('Inicar sesion handle')
  }
}
