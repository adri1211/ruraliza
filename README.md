#Reaviva - Plataforma de Conexión Rural

## 🌱 Descripción del Proyecto
Reaviva es una plataforma innovadora que conecta espacios rurales con emprendedores, facilitando el desarrollo económico sostenible en entornos rurales. La plataforma permite a propietarios publicar sus espacios (locales, terrenos, naves industriales) y a emprendedores encontrar el lugar ideal para sus proyectos.

## 🚀 Credenciales

### Backend
- **Base de datos MySQL**:
  - Usuario: 
  - Contraseña: `root`
  - Base de datos: `rental_app`

### Frontend
- La aplicación utiliza autenticación JWT para el acceso a la API
- Las credenciales de usuario se gestionan a través del sistema de autenticación

## 🔌 Puertos

### Servicios Principales
- **Frontend**: `5173` (http://localhost:5173)
- **Backend API**: `8000` (http://localhost:8000)
- **Servidor Web (Nginx)**: `80` (http://localhost)

### Servicios de Soporte
- **Base de datos MySQL**: `3306`


## 📋 Instrucciones de Uso

### Requisitos Previos
- Docker y Docker Compose
- React (para desarrollo frontend)
- Symfony (para desarrollo backend)

### Desarrollo Local con Docker

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/adri1211/ruraliza.git
   cd ruraliza
   ```

2. **Iniciar los servicios**:
   ```bash
   docker-compose up -d
   ```

3. **Instalar dependencias del backend**:
   ```bash
   docker exec -it backend composer install
   ```

4. **Instalar dependencias del frontend**:
   ```bash
   docker exec -it frontend npm install
   ```

5. **Acceder a la aplicación**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

### Desarrollo sin Docker

#### Backend
1. Navegar al directorio backend:
   ```bash
   cd backend
   ```

2. Instalar dependencias:
   ```bash
   composer install
   ```

3. Configurar variables de entorno:
   - Copiar `.env`
   - Ajustar las variables según sea necesario

4. Iniciar el servidor:
   ```bash
   symfony server:start
   ```

#### Frontend
1. Navegar al directorio frontend:
   ```bash
   cd frontend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   npm start
   ```

## 🧪 Datos de Prueba

### Tipos de Usuarios
1. **Usuario**:
   - Email: `adrian.ariza1211@gmail.com`
   - Contraseña: `1234`
   - Funcionalidades: Publicar espacios, gestionar propiedades, buscar espacios, suscripcion, alquilar espacios (al pinchar en alquilar, le llega una notificación al dueño del espacio, el puede iniciar un chat contigo)

2. **Admin**:
   - Email: `admin@gmail.com`
   - Contraseña: `1234`
   - Funcionalidades: Las mismas que un usuario, editar/eliminar usuarios, editar/eliminar espacios, visualización de usuarios suscritos

### Tipos de Espacios
- Local comercial
- Oficina
- Nave industrial
- Terreno
- Otros (personalizable)

### Base de Datos
La base de datos se inicializa automáticamente cuando se inicia el contenedor de MySQL.

## 📝 Notas Adicionales

### Características Principales
- Sistema de búsqueda y filtrado de espacios
- Chat integrado para comunicación entre propietarios y emprendedores
- Sistema de notificaciones para gestionar consultas
- Soporte para múltiples tipos de archivos (imágenes y PDFs)
- Panel de administración para gestión de usuarios y espacios

### Configuración del Entorno
- Backend: Symfony 7.2 con API Platform
- Frontend: React con Vite
- Autenticación: JWT
- Base de datos: MySQL 8.0
- CORS configurado para desarrollo local

### Comandos Útiles
- **Reiniciar contenedores**: `docker-compose restart`
- **Ver logs**: `docker-compose logs -f [servicio]`
- **Detener todos los servicios**: `docker-compose down`
- **Reconstruir imágenes**: `docker-compose build`

### Solución de Problemas
- Para problemas de permisos en la base de datos, verifica las credenciales en el archivo `.env`
- En caso de problemas con CORS, verifica la configuración en `backend/config/packages/nelmio_cors.yaml`


### Seguridad
- Las credenciales proporcionadas son solo para desarrollo
- En producción, asegúrate de cambiar todas las contraseñas y claves
- No subir archivos `.env` o claves JWT al repositorio

### Archivo .env

# In all environments, the following files are loaded if they exist,
# the latter taking precedence over the former:
#
#  * .env                contains default values for the environment variables needed by the app
#  * .env.local          uncommitted file with local overrides
#  * .env.$APP_ENV       committed environment-specific defaults
#  * .env.$APP_ENV.local uncommitted environment-specific overrides
#
# Real environment variables win over .env files.
#
# DO NOT DEFINE PRODUCTION SECRETS IN THIS FILE NOR IN ANY OTHER COMMITTED FILES.
# https://symfony.com/doc/current/configuration/secrets.html
#
# Run "composer dump-env prod" to compile .env files for production use (requires symfony/flex >=1.2).
# https://symfony.com/doc/current/best_practices.html#use-environment-variables-for-infrastructure-configuration

###> symfony/framework-bundle ###
APP_ENV=dev
APP_SECRET=
###< symfony/framework-bundle ###

###> doctrine/doctrine-bundle ###
# Format described at https://www.doctrine-project.org/projects/doctrine-dbal/en/latest/reference/configuration.html#connecting-using-a-url
# IMPORTANT: You MUST configure your server version, either here or in config/packages/doctrine.yaml
#
# DATABASE_URL="sqlite:///%kernel.project_dir%/var/data.db"
DATABASE_URL="mysql://root@127.0.0.1:3306/rental_app?serverVersion=8.0.23&charset=utf8mb4"
# DATABASE_URL="mysql://app:!ChangeMe!@127.0.0.1:3306/app?serverVersion=10.11.2-MariaDB&charset=utf8mb4"
# DATABASE_URL="postgresql://app:!ChangeMe!@127.0.0.1:5432/app?serverVersion=16&charset=utf8"
###< doctrine/doctrine-bundle ###

###> symfony/messenger ###
# Choose one of the transports below
# MESSENGER_TRANSPORT_DSN=amqp://guest:guest@localhost:5672/%2f/messages
# MESSENGER_TRANSPORT_DSN=redis://localhost:6379/messages
MESSENGER_TRANSPORT_DSN=doctrine://default?auto_setup=0
###< symfony/messenger ###

###> symfony/mailer ###
MAILER_DSN=null://null
###< symfony/mailer ###

###> lexik/jwt-authentication-bundle ###
JWT_PASSPHRASE=palenciana
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PRIVATE_KEY=%kernel.project_dir%/config/jwt/private.pem
###< lexik/jwt-authentication-bundle ###

CORS_ALLOW_ORIGIN='^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$'

###> nelmio/cors-bundle ###
CORS_ALLOW_ORIGIN='^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$'
###< nelmio/cors-bundle ###

OPENAI_API_KEY=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

STRIPE_SECRET_KEY=sk_test_51RMSlrPfJNBJHVdcXSFg7XvoAuRrPyy3UCdTrSYV27YaSml44k48k9UjijbmsuP16I93peFBWf7jHkE4Oze3u9CD00MCvSkuIp

STRIPE_WEBHOOK_SECRET=whsec_da4af95409b8f1a68c63be264f491ba57ad4592de629eace36eb1b343d9f6b08



