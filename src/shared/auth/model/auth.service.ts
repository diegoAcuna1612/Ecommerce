import { computed, inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from '@shared/config/environment';
import { Sesion, Usuario } from './auth.interface';
import { cargarSesion, guardarSesion, limpiarSesion } from './auth.storage';

interface RespuestaToken {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    user?: {
        email?: string;
        user_metadata?: { nombre?: string };
    };
}

const ERROR_CONFIRMACION = 'confirmacion-pendiente';

@Service()
export class AuthService {
    private http = inject(HttpClient);
    private authUrl = environment.authUrl;

    private sesionActual = signal<Sesion | null>(cargarSesion());
    readonly sesion = this.sesionActual.asReadonly();

    usuario = computed<Usuario | null>(() => this.sesionActual()?.usuario ?? null);
    isLoggedIn = computed(() => this.sesionActual() !== null);
    accessToken = computed(() => this.sesionActual()?.accessToken ?? null);

    cargando = signal(false);
    error = signal<string | null>(null);

    constructor() {
        this.refrescarSiExpiro();
    }

    login(email: string, password: string): Observable<void> {
        this.cargando.set(true);
        this.error.set(null);

        return this.http
            .post<RespuestaToken>(
                `${this.authUrl}/token?grant_type=password`,
                { email, password },
                { headers: { apikey: environment.apiKey } },
            )
            .pipe(
                tap((respuesta) => this.guardarRespuesta(respuesta, email)),
                map(() => void 0),
                catchError(() => {
                    this.error.set('Correo o contraseña incorrectos.');
                    return throwError(() => new Error('login-fallido'));
                }),
                finalize(() => this.cargando.set(false)),
            );
    }

    registro(nombre: string, email: string, password: string): Observable<void> {
        this.cargando.set(true);
        this.error.set(null);

        return this.http
            .post<Partial<RespuestaToken>>(
                `${this.authUrl}/signup`,
                { email, password, data: { nombre } },
                { headers: { apikey: environment.apiKey } },
            )
            .pipe(
                switchMap((respuesta) => {
                    if (respuesta.access_token) {
                        this.guardarRespuesta(respuesta as RespuestaToken, email);
                        return of(void 0);
                    }
                    this.error.set(
                        'Cuenta creada. Revisa tu correo para confirmarla antes de iniciar sesión.',
                    );
                    return throwError(() => new Error(ERROR_CONFIRMACION));
                }),
                catchError((err: Error) => {
                    if (err?.message !== ERROR_CONFIRMACION) {
                        this.error.set(
                            'No se pudo crear la cuenta. ¿Ya está registrado ese correo?',
                        );
                    }
                    return throwError(() => err);
                }),
                finalize(() => this.cargando.set(false)),
            );
    }

    logout(): void {
        this.http
            .post(`${this.authUrl}/logout`, {}, { headers: { apikey: environment.apiKey } })
            .subscribe({ error: () => undefined });

        this.limpiar();
    }

    private guardarRespuesta(respuesta: RespuestaToken, emailFallback?: string): void {
        const sesion: Sesion = {
            accessToken: respuesta.access_token,
            refreshToken: respuesta.refresh_token ?? null,
            expiresAt: Date.now() + respuesta.expires_in * 1000,
            usuario: this.extraerUsuario(respuesta, emailFallback),
        };

        this.sesionActual.set(sesion);
        guardarSesion(sesion);
    }

    private refrescarSiExpiro(): void {
        const actual = this.sesionActual();
        if (!actual?.refreshToken) {
            return;
        }
        if (actual.expiresAt > Date.now() + 60_000) {
            return;
        }

        this.http
            .post<RespuestaToken>(
                `${this.authUrl}/token?grant_type=refresh_token`,
                { refresh_token: actual.refreshToken },
                { headers: { apikey: environment.apiKey } },
            )
            .pipe(
                tap((respuesta) => this.guardarRespuesta(respuesta, actual.usuario.email)),
                catchError(() => {
                    this.limpiar();
                    return of(null);
                }),
            )
            .subscribe();
    }

    private limpiar(): void {
        this.sesionActual.set(null);
        limpiarSesion();
    }

    private extraerUsuario(respuesta: RespuestaToken, emailFallback?: string): Usuario {
        const payload = this.decodificarJwt(respuesta.access_token);
        const metadata = payload?.['user_metadata'] as { nombre?: string } | undefined;

        const email =
            respuesta.user?.email ?? (payload?.['email'] as string | undefined) ?? emailFallback ?? '';
        const nombre =
            respuesta.user?.user_metadata?.nombre ??
            metadata?.nombre ??
            email.split('@')[0] ??
            'Usuario';

        return { nombre, email };
    }

    private decodificarJwt(token: string): Record<string, unknown> | null {
        try {
            const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            const relleno = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
            return JSON.parse(atob(relleno)) as Record<string, unknown>;
        } catch {
            return null;
        }
    }
}
