import { Component, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCard, ProductCardSkeleton } from '@entities/product';
import { CategoryService, Product, ProductService } from '@shared/api';
import { AddToCartButton } from '@features/add-to-cart';
import { catchError, combineLatest, debounceTime, distinctUntilChanged, finalize, map, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-catalog-page',
  imports: [ProductCard, ProductCardSkeleton, AddToCartButton],
  templateUrl: './catalog-page.html',
})
export class CatalogPage {
  public productService = inject(ProductService);
  public categoryService = inject(CategoryService);
  public router = inject(Router);
  private route = inject(ActivatedRoute);

  public readonly tamanoPagina = 10;

  textoBusqueda = signal('');
  categoria = signal('');
  paginaActual = signal(1);
  cargando = signal(true);
  totalPaginas = signal(1);

  private textoBusqueda$ = toObservable(this.textoBusqueda);
  private categoria$ = toObservable(this.categoria);
  private pagina$ = toObservable(this.paginaActual);

  private resultados$ = combineLatest([this.textoBusqueda$, this.categoria$, this.pagina$]).pipe(
    debounceTime(300),
    distinctUntilChanged(
      ([textoA, categoriaA, paginaA], [textoB, categoriaB, paginaB]) =>
        textoA === textoB && categoriaA === categoriaB && paginaA === paginaB,
    ),
    tap(() => this.cargando.set(true)),
    switchMap(([texto, categoria, pagina]) =>
      this.productService.buscar(texto, categoria, pagina, this.tamanoPagina).pipe(
        tap(({ total }) =>
          this.totalPaginas.set(Math.max(1, Math.ceil(total / this.tamanoPagina))),
        ),
        catchError(() => {
          this.totalPaginas.set(1);
          return of({ productos: [] as Product[], total: 0 });
        }),
        finalize(() => this.cargando.set(false)),
      ),
    ),
    map((resultado) => resultado.productos),
  );

  resultados = toSignal(this.resultados$, { initialValue: [] as Product[] });

  private primerCambioTexto = true;

  constructor() {
    const params = this.route.snapshot.queryParamMap;
    this.textoBusqueda.set(params.get('q') ?? '');
    this.categoria.set(params.get('categoria') ?? '');
    this.paginaActual.set(Number(params.get('page') ?? 1));

    effect(() => {
      this.textoBusqueda();
      if (this.primerCambioTexto) {
        this.primerCambioTexto = false;
        return;
      }
      this.paginaActual.set(1);
    });

    effect(() => {
      this.router.navigate([], {
        queryParams: {
          q: this.textoBusqueda() || null,
          categoria: this.categoria() || null,
          page: this.paginaActual() > 1 ? this.paginaActual() : null,
        },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });
  }

  onTextoChange(texto: string) {
    this.textoBusqueda.set(texto);
  }

  onCategoriaChange(categoria: string) {
    this.categoria.set(categoria);
    this.paginaActual.set(1);
  }

  siguientePagina() {
    if (this.paginaActual() < this.totalPaginas()) {
      this.paginaActual.update((pagina) => pagina + 1);
    }
  }

  paginaAnterior() {
    this.paginaActual.update((pagina) => Math.max(1, pagina - 1));
  }

  navigateToProduct(event: Product) {
    this.router.navigate(['/product', event.id]);
  }

}
