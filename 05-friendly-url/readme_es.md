# URLS amigables

Uno de los objetivos que tenemos a la hora de implementar server side rendering es poder obtener buenos resultados en SEO. Uno de sus pilares es generar URLS amigables. Si vamos al "user detail page" podremos ver que se esta generando algo como:

http://localhost:3000/user-info?login=brauliodiez

De otra manera se podría reescribir la URL mostrándola así:

http://localhost:3000/user-info/login/brauliodiez

Podemos hacer esto en dos pasos:
  - Dar soporte a la URL amigable en el lado del cliente.
  - Dar soporte a la URL amigable en el lado del servidor.

# Pasos

- Vamos a copiar el contenido de _04-querystring_ en nuestra carpeta de trabajo.

- Acto seguido, instalaremos los paquetes necesarios.

```bash
npm install
```
- Actualizaremos el componente  _row.tsx_  para usar un alias en nuestro enlace.

_./pages/components/users/row.tsx_

```diff
    <td>
-     <Link href={`/user-info?login=${props.user.login}`}>
+     <Link as={`user-info/login/${props.user.login}`} href={`/user-info?login=${props.user.login}`}>
        <a>{props.user.login}</a>
      </Link>    
    </td>
...

```

- Ahora comprobamos como funciona ejecutando el ejemplo:

```bash
npm run dev
```

- Ya estamos listos? La respuesta es NO. Si refrescáramos la página el server side rendering no estaría funcionando correctamente, por lo que obtendríamos un 404.

- Para que el servidor se comporte de la misma manera que el cliente, vamos a necesitar añadir más contenido:

- Instalamos _express_

```bash
npm install express --save
```

- Crearemos un archivo llamado _server.js_ 

_./server.js_

```javascript
const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handler = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.get('*', (req, res) => {
      return handler(req, res);
    });

    server.listen(3000, err => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000');
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });

```

> en este archivo solo hemos creado una aplicación "next" escuchando cualquier petición. Esta petición solo será controlada por la aplicación "next".

- Ahora actualizamos nuestra entrada _package.json_ .

_./package.json_

```diff
  "scripts": {
-    "dev": "next"
+    "dev": "node server.js"
  },
```

- Vamos a comprobar si el servidor esta funcionando (todavía sin URL limpia del lado del servidor)

```bash
npm run dev
```

- Añadiremos un "server.get" para la nueva URL amigable que hemos creado.

_./server.js_

```diff
...

app
  .prepare()
  .then(() => {
    const server = express();

+   server.get('/user-info/login/:login', (req, res) => {
+     return app.render(req, res, 'user-info', { login: req.params.login });
+   });

    server.get('*', (req, res) => {
      return handler(req, res);
    });
...

```

- Ahora si ejecutamos el código vamos a ver que la URL amigable funciona de manera correcta, una vez que refresquemos la página.

```bash
npm run dev
```
