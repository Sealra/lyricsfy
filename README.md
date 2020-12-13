Primero que todo hay que instalar las librerias utilizadas en el proyecto.

Estas son:

### `npm install`
### `npm install axios`
### `npm install spotify-web-api-js`
### `npm install react-router-dom`


Para correr la aplicación es necesario primero poner en la terminal:

### `cd auth-sv`
### `node authorization_code/app.js`

Esto se abrirá en localhost:8888, es para la conectarse a la cuenta de spotify.

### `npm start`

Esto es la aplicación de React, se abrirá en localhost:3000.

Si salta un error tipo " Error: Cannot find module 'nombreX' "

Esto es solucionado corriendo:

### `npm instalL nombreX`

IMPORTANTE!

Si no se descarga la carpeta "auth-sv":

- Crear una carpeta llamada "auth-sv" dentro de la carpeta de donde se alla clonado este repositorio.
- Clonar este repositorio dentro de aquella carpeta https://github.com/spotify/web-api-auth-examples
