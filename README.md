# Ecommerce Angular Modulo 3

Proyecto de comercio electrónico desarrollado con Node.js/Express en el backend y Angular en el frontend.

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:
- **Backend**: API REST desarrollada con Node.js y Express
- **Frontend**: Aplicación SPA desarrollada con Angular

## Backend (Node.js + Express)

### Instalación de Dependencias

Ejecutar en la carpeta del backend:

```bash
npm i
```

### Ejecución en Modo Desarrollo

```bash
npm run dev
```

El servidor se iniciará en el puerto configurado en las variables de entorno (por defecto 5000).

### Variables de Entorno

Crear un archivo `.env` en la raíz del backend con la siguiente configuración:

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=ecommerce-db
PORT=5000
JWT_SECRET=f6b5b3676b6aa326c7258ebd2c4a2fa05b7fb51fb8a0fe9479f679c10cbc7931532e79422a9a2b262029318dd97b7774f595d2a4dbe9564513aeb52415317012
JWT_REFRESH_SECRET=f6b5b3676b6aa326c7258ebd2c4a2fa05b7fb51fb8a0fe9479f679c10cbc7931532e79422a9a2b262029318dd97b7774f595d2a4dbe9564513aeb52415317012
ANGULAR_APP_URL=http://localhost:4200
```

**Descripción de Variables:**
- `MONGODB_URI`: Cadena de conexión a la base de datos MongoDB
- `MONGODB_DB`: Nombre de la base de datos
- `PORT`: Puerto donde se ejecutará la API
- `JWT_SECRET` y `JWT_REFRESH_SECRET`: Claves secretas para la autenticación JWT
- `FRONT_APP_URL`: URL del frontend para configuración de CORS

### CORS (Cross-Origin Resource Sharing)

CORS es un mecanismo de seguridad crítico implementado por los navegadores web que controla cómo las aplicaciones web pueden acceder a recursos desde diferentes orígenes (dominio, protocolo o puerto). Su correcta configuración es fundamental para el funcionamiento de aplicaciones full stack.

**¿Por qué es importante CORS?**

Los navegadores implementan la "Política del Mismo Origen" (Same-Origin Policy) como medida de seguridad, que bloquea las solicitudes HTTP entre diferentes orígenes. Sin CORS configurado correctamente, el frontend Angular (ejecutándose en `http://localhost:4200`) no podría comunicarse con la API backend (ejecutándose en `http://localhost:5000`).

**Cómo funciona CORS:**

1. **Solicitudes Simples**: Para solicitudes GET, POST con ciertos tipos de contenido, el navegador envía la solicitud directamente pero verifica las cabeceras CORS en la respuesta.

2. **Solicitudes Preflighted**: Para solicitudes más complejas (PUT, DELETE, o con headers personalizados), el navegador primero envía una solicitud OPTIONS (preflight) para verificar si el servidor permite la operación.

3. **Cabeceras CORS**: El servidor debe responder con cabeceras específicas como:
   - `Access-Control-Allow-Origin`: Especifica qué orígenes pueden acceder al recurso
   - `Access-Control-Allow-Methods`: Métodos HTTP permitidos
   - `Access-Control-Allow-Headers`: Headers permitidos en las solicitudes
   - `Access-Control-Allow-Credentials`: Permite el envío de cookies y headers de autenticación

**Instalación y Configuración:**

```bash
npm i cors
```

Configuración en el servidor ( server.js ):

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.ANGULAR_APP_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

Esta configuración asegura que solo el frontend especificado en `ANGULAR_APP_URL` pueda realizar solicitudes al backend, permitiendo el intercambio de credenciales y especificando los métodos y headers permitidos.

## Frontend (Angular)

### Instalación de Dependencias

Ejecutar en la carpeta del frontend:

```bash
npm i
```

### Ejecución en Modo Desarrollo

```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

### Instalación de TailwindCSS

Para una guía completa de instalación, consultar: https://tailwindcss.com/docs/installation/framework-guides/angular

```bash
npm install tailwindcss @tailwindcss/postcss postcss --force
```

Configure PostCSS Plugins
Create a .postcssrc.json file in the root of your project and add the @tailwindcss/postcss plugin to your PostCSS configuration.

```.postcssrc.json
/** 
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

Agregar las directivas de Tailwind en `styles.css`:

```css
    @import "tailwindcss";
```

### Extensiones Recomendadas

Para mejorar la experiencia de desarrollo con TailwindCSS, se recomienda instalar la siguiente extensión en VS Code:

**Tailwind CSS IntelliSense**
- Proporciona autocompletado inteligente, resaltado de sintaxis y linting para clases de Tailwind
- Muestra previsualizaciones de los estilos CSS al pasar el cursor sobre las clases
- Valida las clases de Tailwind y sugiere correcciones

### Instalación de Angular Material

Para documentación completa, visitar: https://material.angular.dev

```bash
ng add @angular/material
```

Importar módulos necesarios en `app.module.ts`:

```typescript
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    MatButtonModule,
    MatInputModule
  ]
})
export class AppModule {}
```