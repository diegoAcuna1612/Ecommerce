/**
 * Entorno de pruebas.
 *
 * Node expone un `localStorage` experimental que no funciona salvo que se
 * ejecute con `--localstorage-file`, por lo que en los tests lo reemplazamos
 * por una implementación en memoria que se comporta como el del navegador.
 */
class MemoriaStorage implements Storage {
    private datos = new Map<string, string>();

    get length(): number {
        return this.datos.size;
    }

    clear(): void {
        this.datos.clear();
    }

    getItem(clave: string): string | null {
        return this.datos.get(clave) ?? null;
    }

    key(indice: number): string | null {
        return [...this.datos.keys()][indice] ?? null;
    }

    removeItem(clave: string): void {
        this.datos.delete(clave);
    }

    setItem(clave: string, valor: string): void {
        this.datos.set(clave, String(valor));
    }
}

Object.defineProperty(globalThis, 'localStorage', {
    value: new MemoriaStorage(),
    configurable: true,
    writable: true,
});
