import { Component, inject } from '@angular/core';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';
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
