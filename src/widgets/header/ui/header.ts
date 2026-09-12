import { Component, inject } from '@angular/core';
import { Button } from '@shared/ui';
import { CartService } from '@entities/cart';
import { AuthService } from '@entities/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  imports: [Button],
  templateUrl: './header.html',
})
export class Header {
  cartService = inject(CartService)
  authService = inject(AuthService)
  private router = inject(Router)
  
  handleIniciarSesion(event:MouseEvent){
    this.router.navigate(['/login'])
  }

  handleCerrarSesion(){
    this.authService.logout()
    this.router.navigate(['/'])
  }
}