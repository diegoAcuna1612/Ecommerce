import { Component } from '@angular/core';
import { Header } from '@widgets/header';
import { Footer } from '@widgets/footer';
import { RouterOutlet } from '@angular/router';
import { from } from 'rxjs';
@Component({
  selector: 'app-main-layout',
  imports: [Header,Footer,RouterOutlet],
  templateUrl: './main-layout.html',
})
export class MainLayout {}
