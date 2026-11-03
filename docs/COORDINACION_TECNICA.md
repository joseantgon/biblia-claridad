# Coordinación técnica — Biblia Claridad

## Alcance exclusivo
Este repositorio contiene únicamente **Biblia Claridad**. No incorporar código, credenciales, bases de datos ni configuraciones de otros proyectos.

## Responsabilidades
- **ChatGPT:** arquitectura, requisitos, coordinación, auditoría y criterios de aceptación.
- **Claude (cuando se conecte y autorice):** implementación y correcciones en ramas de trabajo, con revisión antes de integrar.
- **Muse / Muse Spark (cuando esté disponible):** evaluación independiente y propuestas; no se presupone acceso directo al repositorio.
- **GitHub:** historial, ramas, revisión y trazabilidad.
- **Supabase:** proyecto dedicado a Biblia Claridad, autenticación y almacenamiento por cuenta, únicamente después de identificar y configurar el proyecto correcto.

## Normas de seguridad
1. No colocar claves privadas, service_role, contraseñas ni tokens en el repositorio.
2. No modificar producción ni publicar despliegues sin revisión y autorización.
3. Antes de migrar o transformar datos, realizar respaldo verificable y establecer recuperación.
4. Aplicar políticas RLS a toda tabla con datos personales y comprobar aislamiento entre cuentas.
5. No afirmar que una función está instalada sin pruebas reales de servidor y cliente.
6. No integrar contenidos de terceros sin comprobar sus derechos de uso.

## Orden de trabajo
1. Auditar integridad de los archivos de la aplicación y dependencias.
2. Preparar entorno de desarrollo y pruebas de lectura, búsqueda, audio y planes.
3. Crear o seleccionar un Supabase exclusivo de Biblia Claridad.
4. Implementar inicio de sesión por correo, manejo de sesión y sincronización con resolución de conflictos.
5. Verificar notas, favoritos, subrayados y progreso en dos sesiones independientes.
6. Adaptar Android WebView, probar en Android, iPad y PC.
7. Aprobar y ejecutar publicación en el alojamiento confirmado.

## Estado
Este documento es una guía de coordinación. **No acredita** que autenticación, sincronización, pruebas multidispositivo ni publicación estén realizadas.
