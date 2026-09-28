import { FormControl, FormGroup } from '@angular/forms';
import {
    passwordsIguales,
    titularCoincide,
    vencimientoFuturo,
} from './validators';

describe('validators', () => {
    describe('passwordsIguales', () => {
        it('devuelve null cuando las contraseñas coinciden', () => {
            const grupo = new FormGroup({
                password: new FormControl('secreta123'),
                confirmarPassword: new FormControl('secreta123'),
            });

            expect(passwordsIguales()(grupo)).toBeNull();
        });

        it('devuelve passwordsNoCoinciden cuando son distintas', () => {
            const grupo = new FormGroup({
                password: new FormControl('secreta123'),
                confirmarPassword: new FormControl('otra'),
            });

            expect(passwordsIguales()(grupo)).toEqual({ passwordsNoCoinciden: true });
        });
    });

    describe('titularCoincide', () => {
        function crearGrupo(metodo: string, nombre: string, titular: string) {
            return new FormGroup({
                contacto: new FormGroup({ nombre: new FormControl(nombre) }),
                pago: new FormGroup({
                    metodo: new FormControl(metodo),
                    titular: new FormControl(titular),
                }),
            });
        }

        it('devuelve null si no se paga con tarjeta', () => {
            const grupo = crearGrupo('contraentrega', 'Ana', 'Pedro');

            expect(titularCoincide(grupo)).toBeNull();
        });

        it('devuelve null si el titular coincide (ignorando mayúsculas y espacios)', () => {
            const grupo = crearGrupo('tarjeta', '  Ana Pérez ', 'ana pérez');

            expect(titularCoincide(grupo)).toBeNull();
        });

        it('devuelve titularDistinto si el titular no coincide', () => {
            const grupo = crearGrupo('tarjeta', 'Ana', 'Pedro');

            expect(titularCoincide(grupo)).toEqual({ titularDistinto: true });
        });
    });

    describe('vencimientoFuturo', () => {
        it('acepta una fecha de vencimiento futura', () => {
            const control = new FormControl('12/30');

            expect(vencimientoFuturo()(control)).toBeNull();
        });

        it('rechaza una fecha de vencimiento pasada', () => {
            const control = new FormControl('08/26');

            expect(vencimientoFuturo()(control)).toEqual({ vencimientoPasado: true });
        });

        it('rechaza un formato inválido', () => {
            const control = new FormControl('1230');

            expect(vencimientoFuturo()(control)).toEqual({ formatoVencimiento: true });
        });

        it('rechaza un mes fuera de rango', () => {
            const control = new FormControl('13/30');

            expect(vencimientoFuturo()(control)).toEqual({ formatoVencimiento: true });
        });
    });
});
