import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuantitySelector } from './quantity-selector';

describe('QuantitySelector', () => {
    let fixture: ComponentFixture<QuantitySelector>;
    let selector: QuantitySelector;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [QuantitySelector] });
        fixture = TestBed.createComponent(QuantitySelector);
        selector = fixture.componentInstance;
    });

    it('incrementa la cantidad y notifica el cambio', () => {
        const cambios: number[] = [];
        selector.registerOnChange((valor) => cambios.push(valor));
        selector.writeValue(2);

        selector.incrementar();

        expect(selector.cantidad()).toBe(3);
        expect(cambios).toEqual([3]);
    });

    it('decrementa la cantidad respetando el mínimo', () => {
        fixture.componentRef.setInput('min', 1);
        selector.writeValue(1);

        selector.decrementar();

        expect(selector.cantidad()).toBe(1);
    });

    it('no incrementa por encima del máximo', () => {
        fixture.componentRef.setInput('max', 3);
        selector.writeValue(3);

        selector.incrementar();

        expect(selector.cantidad()).toBe(3);
    });

    it('no cambia la cantidad cuando está deshabilitado', () => {
        selector.writeValue(2);

        selector.setDisabledState(true);
        selector.incrementar();

        expect(selector.cantidad()).toBe(2);
        expect(selector.bloqueado()).toBe(true);
    });

    it('renderiza la cantidad actual', () => {
        selector.writeValue(4);
        fixture.detectChanges();

        expect(fixture.nativeElement.textContent).toContain('4');
    });

    it('incrementa al hacer clic en el botón +', () => {
        selector.writeValue(1);
        fixture.detectChanges();

        const [, botonMas] = fixture.nativeElement.querySelectorAll('button');
        botonMas.click();
        fixture.detectChanges();

        expect(selector.cantidad()).toBe(2);
    });
});
