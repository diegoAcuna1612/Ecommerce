import { Component, signal } from '@angular/core';
import {ListaProductos} from './components/lista-productos/lista-productos';
import {Header} from './shared/header/header';
import {Footer} from './shared/footer/footer';
import {User} from './models/index';
import {UserCard} from './components/user-card/user-card';
@Component({
  selector: 'app-root',
  imports: [ Header,Footer,UserCard, ListaProductos],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ecommerce');

  user1:User={
    name:'Juan Perez',
    email:'juan@gmail.com'
  }
  user2:User={
    name:'María García',
    email:'maria@gmail.com'
  }
  


}
