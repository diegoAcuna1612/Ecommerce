import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-quantity-selector',
  imports: [],
  templateUrl: './quantity-selector.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => QuantitySelector),
    },
  ],
})
export class QuantitySelector implements ControlValueAccessor {
  min = input(1);
  max = input(Number.POSITIVE_INFINITY);

  cantidad = signal(0);
  bloqueado = signal(false);

  private alCambiar: (valor: number) => void = () => {};
  private alTocar: () => void = () => {};

  writeValue(valor: number | null): void {
    this.cantidad.set(valor ?? this.min());
  }

  registerOnChange(fn: (valor: number) => void): void {
    this.alCambiar = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.alTocar = fn;
  }

  setDisabledState(deshabilitado: boolean): void {
    this.bloqueado.set(deshabilitado);
  }

  incrementar(): void {
    if (this.bloqueado()) return;
    this.actualizar(this.cantidad() + 1);
  }

  decrementar(): void {
    if (this.bloqueado()) return;
    this.actualizar(this.cantidad() - 1);
  }

  private actualizar(valor: number): void {
    const acotado = Math.min(Math.max(valor, this.min()), this.max());
    this.cantidad.set(acotado);
    this.alCambiar(acotado);
    this.alTocar();
  }
}
