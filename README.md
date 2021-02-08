# [Pack&Pack](https://packandpack.com/index.html) (Prueba técnica)

> **IMPORTANTE:**
>
> * Los proyectos **frontend** y **backend** pueden funcionar fuera del directorio raiz y son totalmente autónomos.

## 🛠️ Construido en

_SO:_

* [Distribución basada en Ubuntu 20.04](https://ubuntu.com/).

_Backend:_

* [TypeScript v4.1.3.](https://www.typescriptlang.org/)
* [MongoDB v3.6.8.](https://www.mongodb.com/)
* [Node.js v15.8.0.](https://nodejs.org/)
* [npm v7.5.1.](https://www.npmjs.com/)

_Frontend:_

* [AngularJS v1.7.0.](https://angularjs.org/)
* [npm v7.5.1.](https://www.npmjs.com/)
* [webpack v2.7.0.](https://webpack.js.org/)

## 📋 Pre-requisitos

* Tener instalado MongoDB.
* Tener instalado Node.js y npm.

## ⚙️ Configuración del proyecto _**BACKEND**_

**1.** Entrar al directorio backend (Desde la raíz del repositorio).
```
cd backend
```

**2.** Instalación de dependencias.
```
npm install
```

**3.** Iniciar servidor Node.js. Este comando compilara el código original _TypeScript_ a _JS_ para su correcta interpretación por el servidor, levantando el proyecto sobre el puerto predeterminado _**3000  (http://localhost:3000/)**_.
```
npm start
```
> **Notas:**
>
> * Los servicios _API Rest_ cuentan con una capa de seguridad mediante el manejo de token JWT.
>
> * Los tokens de acceso son enviados por la cabecera **Authorization: Bearer _token_** desde el cliente.
>
> * La clave secreta para el cifrado de los token JWT asi como el tiempo de expiración del mismo, pueden ser modificados en el archivo de configuración **[jwt.ts](backend/src/config/jwt.ts)**.
>
> * La configuración de conexión a la BD puede ser actualizada modificando el archivo de configuración **[database.ts](backend/src/config/database.ts)**. Actualmente usa la configuracion por defecto de _MongoDB_ sin credenciales de autenticación.
>
> * El schema se compone de la BD _**pack-and-pack**_ y de la colección _**users**_.

## ⚙️ Configuración del proyecto _**FRONTEND**_

**1.** Entrar al directorio frontend (Desde la raíz del repositorio).
```
cd frontend
```

**2.** Instalación de dependencias.
```
npm install
```

**3.** Iniciar servidor webpack. Este comando compilara el código original mediante el uso de webpack y babel, levantando el proyecto sobre el puerto predeterminado _**8080 (http://localhost:8080/)**_.
```
npm start
```
> **Notas:**
>
> * No existen usuario pre-cargados, por lo que se tendrán que registrar nuevos usuarios.
>
> * Es necesario verificar la configuración de la zona horaria de _MongoDB_ puesto que una mala configuración podría ocasionar problemas en la generación automática de fechas.

## 🎁 Extras (Postman)

Se incluye **[colección Postman](Pack&Pack.postman_collection.json)** para la interacción con los servicios **API Rest**.

> **Notas:**
>
> * No existen usuarios pre-cargados, por lo cual es necesario hacer uso del servicio _**REGISTRO**_.

## ✒️ Autor

**[Nazareth Omar Martínez Valerio.](mailto:nazareth.trabajo@gmail.com)**

## 📄 Licencia

Este proyecto está bajo la **[Licencia MIT](LICENSE)**.