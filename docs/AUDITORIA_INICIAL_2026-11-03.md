# Auditoría inicial de integración — 2026-11-03

## Alcance
Exclusivamente `joseantgon/biblia-claridad`. No se inspeccionan ni modifican otros proyectos.

## Evidencia confirmada
- El repositorio existe y tiene rama `main`; visibilidad **public** según el conector de GitHub.
- Se verificó la presencia de `index.html`, `README.md`, `assets/recursos.js`, `assets/datos-biblicos.js`, `assets/aplicacion-2.js` y `assets/aplicacion-3.js`.
- El HTML local entregado contiene referencias a esos cuatro scripts.
- El código de `assets/aplicacion-2.js` del paquete entregado incluye solicitudes a `/api/account`, `/api/auth/email` y `/api/sync`. **Esto no acredita que el servidor tenga implementados esos endpoints**.
- En el paquete local, `assets/recursos.js` tiene 17,688,787 bytes y `assets/datos-biblicos.js` 7,596,685 bytes (tamaños sin comprimir).

## Riesgos y bloqueos
1. No se ha identificado un servidor HTTPS con control administrativo que aloje las API y la web.
2. No se ha confirmado un proyecto Supabase **dedicado** a Biblia Claridad; no reutilizar uno de otro producto.
3. El repositorio es público: prohibido almacenar secretos o publicar contenido sin revisar licencias.
4. Android WebView que abra `file://` no puede asumir que las rutas relativas `/api/*` lleguen al servidor deseado.
5. La carga inicial y las funciones de lectura/audio/búsqueda aún requieren pruebas de regresión.
6. No hay evidencia de pruebas de sincronización entre dos dispositivos.

## Criterios de aceptación
- Inicio de sesión por correo con enlace verificable y sesión persistente en HTTPS.
- `/api/account` responde con identidad autenticada y rechaza sesiones no autenticadas.
- `/api/sync` solo permite leer/escribir los datos de la cuenta autenticada, con RLS y control de conflictos.
- Datos locales respaldados y migración reversible, sin borrado automático.
- Dos cuentas de prueba aisladas; dos navegadores/dispositivos con notas, marcadores y progreso coincidentes tras sincronizar.
- Pruebas de lectura, búsqueda, audio, plan anual y navegación en PC, iPad y Android.
- Despliegue solo después de revisar permisos, licencia de contenido y aprobación de la versión.

## Siguiente implementación
Identificar hosting y crear un proyecto Supabase independiente, previa selección de organización y confirmación de costos. Desarrollar y probar endpoints en entorno de ensayo. No afirmar despliegue antes de verificarlo.
