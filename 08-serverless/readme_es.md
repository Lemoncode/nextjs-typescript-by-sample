# Serverless

En este ejemplo vamos a añadir la configuración necesaria para crear una aplicación serverless.

# Steps

- Copiamos el contenido del ejemplo _07-styles_ .

- Vamos a instalar los paquetes necesarios.

```bash
npm install
```

- Creamos un nuevo repositorio en [github](https://github.com) or [gitlab](https://gitlab.com).

- Creamos una cuenta gratuita en [zeit.co/now](https://zeit.co/now).

- Subimos la aplicación en el repositorio.

- Para habilitar el modo `serverless`, necesitamos actualizar nuestro fichero `next.config.js`:

_./next.config.js_

```diff
const withTypescript = require('@zeit/next-typescript');
const withCSS = require('@zeit/next-css');

module.exports = withTypescript(
  withCSS({
    cssModules: true,
    cssLoaderOptions: {
      camelCase: true,
      importLoaders: 1,
      localIdentName: '[local]___[hash:base64:5]',
    },
+   target: 'serverless',
  })
);

```

- Añadimos el fichero de configuración `now`, [más info](https://zeit.co/docs/v2/deployments/configuration):

_./now.json_

```json
{
  "version": 2,
  "name": "test-now-deploy",
  "builds": [{ "src": "next.config.js", "use": "@now/next" }]
}

```

- Hacemos un git commit al repositorio.

- Ya tenemos desplegada nuestra aplicación en `https://test-now-deploy-59lyhaf1v.now.sh/` or en una url similar.

- Importante, no está funcionando las `friendly-url` debido a que el now.json no está usando el fichero `server.js` cuando compila la aplicación. Para solucionarlo, necesitamos configurar las rutas en el fichero `now.json`:

_./now.json_

```diff
{
  "version": 2,
  "name": "test-now-deploy",
- "builds": [{ "src": "next.config.js", "use": "@now/next" }]
+ "builds": [{ "src": "next.config.js", "use": "@now/next" }],
+ "routes": [{ "src": "/user-info/login/(?<login>[^/]+)", "dest": "/user-info?login=$login" }]
}

```

> NOTA: Esta configuración solamente funciona para la cloud `now`, no funciona en local.

- Hacemos commit al repositorio y se auto desplegará el código en la cloud `now`.
