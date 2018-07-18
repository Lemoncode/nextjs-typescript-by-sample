# Navegacion

Hasta aquí hemos creado un simple proyecto qeu incluye una página simple, vamos a crear una segunda página y añadir navegación entre la primera y la segunda

#Pasos

- Para empezar debemos copiar los ficheros del ejemplo _01-hello-typescript_ y ejecutar:

```bash
npm install
```

- Ahora creamos una nueva página y la llamamos 'user-info':
_./pages/user-info.tsx_

```typescript
const UserInfoPage = () => (
  <div>
    <h2>I'm the user info page</h2>    
  </div>
);

export default UserInfoPage;
```

- Ahora para poder añadir una navegación satisfactoria tanto en el cliente como en el servidor debemos envolver la navegación mediante nextjs para poder manejar la navegación de forma global.


_./pages/index.tsx_

```diff
const myLanguage = "Typescript";
+ import Link from 'next/link';

const Index = () => (
  <div>
    <p>Hello Next.js</p>
    <p>From {myLanguage}</p>
+    <Link href="/user-info">
+      <a>Navegar a la página de información del usuario</a>
+    </Link>    
  </div>
);

export default Index;
```

> Si no usuamos este objeto _Link_ cuando clicamos en el link, este navegará en el lado del servidor en lugar del lado del cliente. 

- Ahora, ejecuta el ejemplo

```bash
npm run dev
```

> Ahora puedes observar que hay navegación entre cliente y servidor. Además el histórico del navegador se rellena con dicha navegación.