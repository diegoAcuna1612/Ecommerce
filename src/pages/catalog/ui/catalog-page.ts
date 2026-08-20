import { Component, inject } from '@angular/core';
import { ProductCard } from '@entities/product';
import { ProductService, Product} from '@shared/api'
@Component({
  selector: 'app-catalog-page',
  imports: [ProductCard],
  templateUrl: './catalog-page.html',
})
export class CatalogPage {
  public productService = inject(ProductService)

  handleAddToCart(product: Product) {
    console.log('Producto agregado desde la tarjeta:', product);
  }
}
