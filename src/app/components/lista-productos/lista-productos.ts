import { Component } from '@angular/core';
import { Producto} from '../../models/index';
import { ProductCard } from './components/product-card/product-card';
@Component({
  selector: 'app-lista-productos',
  imports: [ProductCard],
  templateUrl: './lista-productos.html',
})
export class ListaProductos {
   producto1: Producto = {
    nombre: 'Zapatillas Urbanas',
    imagen: 'https://picsum.photos/seed/zapatillas/300/300',
    precio: 189.9,
    stock: 10
  };
  
   producto2: Producto = {
    nombre: 'Mochila Antirrobo',
    imagen: 'https://picsum.photos/seed/mochila/300/300',
    precio: 129.5,
    stock:5
  };
  
   producto3: Producto = {
    nombre: 'Audífonos Bluetooth',
    imagen: 'https://picsum.photos/seed/audifonos/300/300',
    precio: 99.0,
    stock: 0
  };
  
   producto4: Producto = {
    nombre: 'Reloj Inteligente',
    imagen: 'https://picsum.photos/seed/reloj/300/300',
    precio: 249.9,
    stock: 3

  };
  
   producto5: Producto = {
    nombre: 'Botella Térmica',
    imagen: 'https://picsum.photos/seed/botella/300/300',
    precio: 39.9,
    stock: 15
  };
  
   productos: Producto[] = [this.producto1, this.producto2, this.producto3, this.producto4, this.producto5];

}
