import { Component } from '@angular/core';
import { Header } from '@widgets/header';
import { Footer } from '@widgets/footer';
import { CartSidebar } from '@widgets/cart-sidebar';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-main-layout',
  imports: [Header,Footer,RouterOutlet,CartSidebar],
  templateUrl: './main-layout.html',
})
export class MainLayout {}
