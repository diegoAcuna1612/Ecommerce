export interface Usuario {
    nombre: string;
    email: string;
}

export interface Sesion {
    accessToken: string;
    refreshToken: string | null;
    expiresAt: number;
    usuario: Usuario;
}
