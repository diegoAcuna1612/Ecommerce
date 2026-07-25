import { Component, Input } from '@angular/core';
import { Producto } from '../../../../models/product.interface';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input({
  }) imagen: string = 'Imagen ejemplo';
  @Input({
    required: true, 
  }) nombre: string = 'Nombre ejemplo';
  @Input({
  }) precio: number = 0;
  @Input() stock:number=0;

  agregarAlCarrito() {
    console.log(`Producto agregado al carrito: ${this.nombre} - Precio: $${this.precio}`);
  }
  retornarStock(): string{
    if(this.stock>0){
      return `Stock disponible: ${this.stock}`;
    }else{
      return 'Producto agotado';
    }
  }
}
