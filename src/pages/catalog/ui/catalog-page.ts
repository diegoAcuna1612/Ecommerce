import { Component, inject } from '@angular/core';
import { ProductCard } from '@entities/product';
import { Product, ProductService} from '@shared/api'
import { AddToCartButton } from '@features/add-to-cart';
import { Router } from '@angular/router';
@Component({
  selector: 'app-catalog-page',
  imports: [ProductCard, AddToCartButton],
  templateUrl: './catalog-page.html',
})
export class CatalogPage {
  public productService = inject(ProductService)
  public router=inject(Router)

  navigateToProduct(event:Product){
    this.router.navigate(['/product',event.id])
  }
}
