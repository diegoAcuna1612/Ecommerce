import {
    AbstractControl,
    ValidationErrors,
    ValidatorFn,
} from '@angular/forms';

export function passwordsIguales(): ValidatorFn {
    return (grupo: AbstractControl): ValidationErrors | null => {
        const password = grupo.get('password')?.value;
        const confirmar = grupo.get('confirmarPassword')?.value;
        return password === confirmar ? null : { passwordsNoCoinciden: true };
    };
}

export function titularCoincide(grupo: AbstractControl): ValidationErrors | null {
    const metodo = grupo.get('pago.metodo')?.value;
    if (metodo !== 'tarjeta') {
        return null;
    }

    const nombre = String(grupo.get('contacto.nombre')?.value ?? '').trim().toLowerCase();
    const titular = String(grupo.get('pago.titular')?.value ?? '').trim().toLowerCase();

    if (!nombre || !titular) {
        return null;
    }

    return nombre === titular ? null : { titularDistinto: true };
}

export function vencimientoFuturo(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const valor = String(control.value ?? '');
        if (!/^\d{2}\/\d{2}$/.test(valor)) {
            return { formatoVencimiento: true };
        }

        const [mes, anio] = valor.split('/').map(Number);
        if (mes < 1 || mes > 12) {
            return { formatoVencimiento: true };
        }

        const finDeMes = new Date(2000 + anio, mes, 0);
        return finDeMes >= new Date() ? null : { vencimientoPasado: true };
    };
}
