# Maqueta pública · Sistema Integral de Investigación FM-UNC

Versión estática, navegable e instalable del piloto de la Dirección de Investigación de la Facultad de Medicina de la Universidad Nacional de Concepción.

## Circuitos incluidos

- Portal del solicitante para inscribir un protocolo en cinco etapas.
- Descarga del formulario institucional en Word como alternativa.
- Captura simulada de correo y teléfono para futuras notificaciones.
- Mesa de entrada ficticia para revisión técnica y documental.
- Estados de admisión, corrección solicitada y protocolo admitido.
- Representación del futuro envío de una invitación de acceso de un solo uso.
- Seguimiento de proyectos, evidencias, ética, tutorías, evaluaciones y avisos.

## Seguridad del piloto

- Utiliza exclusivamente datos ficticios.
- No contiene contraseñas, tokens, claves de API ni documentos institucionales.
- No implementa autenticación real ni almacenamiento permanente.
- No envía correos ni carga los archivos seleccionados en el formulario.
- Los registros creados durante la navegación desaparecen al recargar la página.
- No debe utilizarse todavía para información personal, clínica o institucional real.

## Publicación gratuita en GitHub Pages

1. Crear un repositorio público denominado `johannaperez0422.github.io`.
2. Colocar todos los archivos de esta carpeta directamente en la raíz del repositorio.
3. Abrir `Settings` → `Pages`.
4. En `Build and deployment`, seleccionar `Deploy from a branch`.
5. Seleccionar la rama `main`, carpeta `/(root)` y guardar.
6. La dirección será `https://johannaperez0422.github.io`.

## Archivos

- `index.html`: estructura principal y metadatos.
- `styles.css`: identidad institucional y diseño adaptable.
- `app.js`: navegación, búsqueda, simulaciones y exportación CSV.
- `manifest.webmanifest`: instalación móvil como PWA.
- `sw.js`: funcionamiento básico sin conexión después de la primera visita.
- `icon.svg`: icono de la maqueta.
- `logo-fm-unc.jpeg`: logotipo institucional proporcionado por la Facultad de Medicina.
- `Formulario_Inscripcion_Protocolo_Investigacion_2025.docx`: formulario institucional en blanco para descarga.
- `.nojekyll`: publicación directa de archivos estáticos.

## Uso móvil

En Android, Chrome puede mostrar la opción **Instalar aplicación**. En iPhone, utilizar Safari → **Compartir** → **Añadir a pantalla de inicio**.

## Próxima etapa

La versión funcional requerirá autenticación real, base de datos, almacenamiento privado, permisos por rol, bitácora y copias de respaldo. Esas funciones no deben programarse dentro de esta maqueta pública.
