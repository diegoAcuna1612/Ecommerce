# 🛒 Ecommerce Tecsup

**Demo en vivo:** https://ecommerce-tecsup.vercel.app/

Aplicación web de comercio electrónico desarrollada con **Angular** y **Supabase** como backend, que implementa un flujo completo de compra: catálogo de productos con búsqueda y filtros, detalle de producto, carrito de compras persistente, autenticación de usuarios y registro de pedidos.

El proyecto sigue una arquitectura **Feature-Sliced Design (FSD)** y una estética minimalista monocromática (blanco y negro) construida con **Tailwind CSS v4**.

---

## 🚀 Stack tecnológico

| Categoría | Tecnología |
|---|---|
| Framework | [Angular](https://angular.dev/) 22 (standalone components, signals, `@Service`) |
| Lenguaje | TypeScript 6 |
| Estado reactivo | Angular Signals (`signal`, `computed`, `effect`) |
| UI / Estilos | [Tailwind CSS](https://tailwindcss.com/) v4 + PostCSS |
| Backend / BaaS | [Supabase](https://supabase.com/) (PostgreSQL, REST API y Auth) |
| Cliente HTTP | Angular `HttpClient` + interceptores funcionales |
| Routing | Angular Router con lazy loading y guards |
| Testing | [Vitest](https://vitest.dev/) + jsdom |
| Gestor de paquetes | [Bun](https://bun.sh/) |
| Deploy | [Vercel](https://vercel.com/) |
| Formato | Prettier |

---

## 🧩 ¿De qué trata el sistema?

Es una tienda en línea que permite a los usuarios explorar un catálogo de productos, buscarlos y filtrarlos por categoría y ver el detalle de cada uno. Los productos se obtienen en tiempo real desde Supabase.

Los usuarios pueden registrarse e iniciar sesión. Una vez autenticados, pueden agregar productos al carrito (que se conserva en el navegador), gestionar cantidades y finalizar la compra mediante un formulario de checkout validado. Al confirmar, se crea un pedido con sus ítems en la base de datos.

### Funcionalidades principales

- **Catálogo** de productos con paginación, búsqueda por texto y filtro por categoría.
- **Detalle de producto** con información de su categoría.
- **Carrito de compras** lateral (sidebar) con persistencia en `localStorage`, cálculo de subtotal, IGV (18%) y total.
- **Autenticación**: registro, inicio de sesión, manejo de sesión con JWT, refresh token y logout.
- **Checkout protegido** por `authGuard`, con validaciones de formulario.
- **Placeholder/skeletons** de carga para mejorar la experiencia de usuario.
- **Diseño responsive** con enfoque brutalista monocromático (blanco/negro).

---

## 🏗️ Arquitectura

El código sigue **Feature-Sliced Design**, organizando las capas de la siguiente manera:

```
src/
├── app/          # Configuración raíz, rutas y guards
├── pages/        # Páginas (catalog, product-detail, login, registro, checkout)
├── widgets/      # Bloques de UI compuestos (header, footer, cart-sidebar)
├── features/     # Funcionalidades (add-to-cart)
├── entities/     # Modelos de dominio (product, cart, order)
└── shared/       # API, auth, config, forms y UI reutilizable
```

Los alias de importación (`@pages/*`, `@widgets/*`, `@entities/*`, `@shared/*`, etc.) se definen en `tsconfig.json`.

### Conexión al backend

- La configuración de Supabase (`apiUrl`, `authUrl`, `apiKey`) vive en `src/shared/config/environment.ts`.
- El interceptor `apiKeyInterceptor` agrega la `apikey` y el `Bearer` token (de la sesión o la clave anónima) a cada petición.

---

## 🛠️ Requisitos previos

- Node.js 20+ o [Bun](https://bun.sh/)
- Angular CLI 22

---

## ⚙️ Instalación y uso

Instalar dependencias:

```bash
bun install
```

Levantar el servidor de desarrollo:

```bash
ng serve
```

Abre tu navegador en `http://localhost:4200/`. La aplicación se recarga automáticamente al modificar los archivos fuente.

Compilar para producción (los artefactos se generan en `dist/`):

```bash
ng build
```

Ejecutar pruebas unitarias con Vitest:

```bash
ng test
```

---

## 📁 Rutas principales

| Ruta | Descripción |
|---|---|
| `/` | Catálogo de productos |
| `/product/:id` | Detalle de un producto |
| `/login` | Inicio de sesión |
| `/registro` | Registro de usuario |
| `/checkout` | Checkout (requiere autenticación) |

---

## 📚 Recursos

- [Angular CLI](https://angular.dev/tools/cli)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Supabase](https://supabase.com/docs)
- [Feature-Sliced Design](https://feature-sliced.design/)
