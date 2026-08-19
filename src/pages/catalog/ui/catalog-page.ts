import { Component, inject } from '@angular/core';
import { ProductCard , ProductService, Product} from '@entities/product';
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
