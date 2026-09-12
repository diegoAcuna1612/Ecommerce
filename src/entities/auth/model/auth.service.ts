import { computed, Service, signal } from '@angular/core';
import { Usuario } from './auth.interface';

@Service()
export class AuthService {
    private usuarioActual = signal<Usuario | null>(null);

    isLoggedIn = computed(() => this.usuarioActual() !== null);
    usuario = this.usuarioActual.asReadonly();

    login(usuario: Usuario) {
        this.usuarioActual.set(usuario);
    }

    logout() {
        this.usuarioActual.set(null);
    }
}