# Hello typescript

En este ejemplo vamos a añadir soporte Typescript a nuestro proyecto, partiremos del ejemplo _00-hello-next_.

En el momento de escribir este ejemplo Babel 7 estaba en versión beta (Babel 7 tendrá soporte para typescript), usaremos un plugin basado en Babel 7: https://github.com/zeit/next-plugins/tree/master/packages/next-typescript

Este es el plugin oficial de typescript  para next.

# Pasos

- Para comenzar copia los fichero del ejemplo _00-hello-next_ y ejecuta:

```bash
npm install
```

- Instalemos el plugin _next-typescript_.

```
npm install @zeit/next-typescript --save
```

- Y los typings.

```
npm install typescript @types/react --save-dev
```

- Necesitamos añadir una configuración typescript.

_./tsconfig.json_

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "jsx": "preserve",
    "allowJs": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "removeComments": false,
    "preserveConstEnums": true,
    "sourceMap": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "lib": [
      "dom",
      "es2016"
    ]
  }
}
```

- Next nos permite extender la configuración por defecto de webpack,
creemos un fichero _next.config.js_ file e incluyamos la configuración Typescript.

_./next.config.js_

```javascript
const withTypescript = require('@zeit/next-typescript');

module.exports = withTypescript();

```

- Necesitamos configurar Babel para que funcione. Creamos un ./.babelrc en la carpeta raíz.  En este ejemplo vamos a utilizar el siguien .babelrc:

_[./.babelrc](./.babelrc)_

```json
{
  "presets": [
    "next/babel",
    "@zeit/next-typescript/babel"
  ]
}

```

- Renombremos nuestro _index.js_ a _index.tsx_.

- Añadamos algo de codigo typescript simple para comprobar que la transpilación funciona como esperamos.

```diff 
+ const myLanguage = "Typescript";

const Index = () => (
  <div>
    <p>Hello Next.js</p>
+    <p>From {myLanguage}</p>
  </div>
);

export default Index;
```

- Probemos el ejemplo

```bash
npm run dev
```



