import { Component, inject } from '@angular/core';
import { ProductCard } from '@entities/product';
import { ProductService, Product} from '@shared/api'
import { AddToCartButton } from '@features/add-to-cart';
@Component({
  selector: 'app-catalog-page',
  imports: [ProductCard, AddToCartButton],
  templateUrl: './catalog-page.html',
})
export class CatalogPage {
  public productService = inject(ProductService)


}
