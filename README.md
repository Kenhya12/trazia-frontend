# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



Componentes de Autenticación
	•	LoginForm: Maneja formulario con campos controlados y validación básica, conecta con backend vía  authService.login . Implementa estados para error y carga, y usa traducciones para mensajes y etiquetas.
	•	RegisterForm: Formulario complejo con validaciones de campos, indicadores visuales de fortaleza de contraseña, gestión local de intentos para limitar registros, manejo de errores detallado y uso del hook auth para login automático tras registro exitoso. También emplea traducciones.
	•	Ambos formularios están diseñados para accesibilidad (uso de  aria-* ) y feedback claro al usuario.
	2.	Gestión de Autenticación a Nivel Global
	•	AuthProvider: Usa contexto React para manejar estado global de autenticación incluyendo usuario, carga, login, registro y logout. Utiliza almacenamiento local para persistencia de token y username, con actualización reactiva del contexto.
	•	Diferentes versiones del AuthProvider y uso del hook personalizado  useAuth  facilitan acceso global al estado de autenticación desde cualquier componente.
	3.	Rutas Protegidas
	•	PrivateRoute: Implementada mediante contexto o hook auth que verifica autenticación y carga; muestra loading mientras se verifica y redirige a login si no está autenticado.
	•	Uso de  <Outlet>  para anidar rutas protegidas, siguiendo mejores prácticas en React Router.
    Internacionalización con react-i18next
	•	Uso consistente de  useTranslation  para textos estáticos y dinámicos.
	•	Componente de selección de idioma previamente enviado complementa este aspecto, almacenando la preferencia y actualizando reactivamente.
	5.	Navegación y Manejo del Estado
	•	Uso de hooks estándar de React Router (useNavigate, Link) para navegación clara y SPA.
	•	Estados locales para formularios con control fino y manejo de errores que mejoran UX.
	6.	Estilos y Accesibilidad
	•	Los estilos CSS están aún pendientes, pero el código ya incorpora buenas prácticas de accesibilidad ( aria  attributes, labels bien definidos).
	•	Modularidad y claridad facilitarán la aplicación de estilos más adelante.
	7.	Servicios y Hooks
	•	 authService  y  useAuth  proveen una capa de abstracción para llamadas API y manejo de estado que permite desacoplamiento y testeabilidad.
	•	Código preparado para escalar con mayor lógica o integración sin mezclar responsabilidades.