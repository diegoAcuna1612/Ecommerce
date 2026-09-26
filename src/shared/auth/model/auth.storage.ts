import { Sesion } from './auth.interface';

const CLAVE_SESION = 'sesion';

export function cargarSesion(): Sesion | null {
    if (typeof localStorage === 'undefined') {
        return null;
    }

    try {
        const crudo = localStorage.getItem(CLAVE_SESION);
        if (!crudo) {
            return null;
        }

        const datos = JSON.parse(crudo) as Sesion;
        if (!datos?.accessToken || !datos.usuario) {
            return null;
        }

        return datos;
    } catch {
        return null;
    }
}

export function guardarSesion(sesion: Sesion): void {
    if (typeof localStorage === 'undefined') {
        return;
    }

    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
}

export function limpiarSesion(): void {
    if (typeof localStorage === 'undefined') {
        return;
    }

    localStorage.removeItem(CLAVE_SESION);
}

export function obtenerAccessToken(): string | null {
    return cargarSesion()?.accessToken ?? null;
}
