# Navegación por "Query String"

Hemos creado una página para listar los usuarios, que tal si mostramos la información de un usuario dado en una página de detalles? 

(Caso de uso: Un usuario hace click en la lista de usuarios, navega a la página de detalles para  ver los detalles de ese usuario).

# Pasos

- Comenzamos por el ejemplo _03-fetch_, copiamos el contenido dentro de una carpeta nueva y trabajamos desde allí.

-Instalamos las dependencias

```bash
npm install
```

- Actualizamos _row.tsx_ y añadimos un link que nos permita navegar a la página de detalles.

- Primero añadimos un import del _"link"_ .

_./pages/components/user-collection/row.tsx_

```diff
import * as React from 'react';
import { UserEntity } from 'model/user';
+ import Link from 'next/link';
```

- Ahora añadimos el elemento Link:

_./pages/components/user-collection/row.tsx_

```diff
    <td>
+     <Link href={`/user-info?id=${props.user.id}`}>
-      <span>{props.user.login}</span>
+      <a>{props.user.login}</a>
+     </Link>        
    </td>
```

- Ahora vamos a leer el paramétro query string  desde la página de información del usuario  _user-info_, para lograrlo haremos uso del  _nextjs_ _withRouter_ HOC.

_./pages/user-info-tsx_

```diff
+ import {withRouter} from 'next/router';

- const Index = () => (
+ const UserInfoPage = withRouter((props) => (
  <div>
    <h2>I'm the user info page</h2>    
+   <h3>{props.router.query.id}</h3>    
  </div>
-);
+));

export default UserInfoPage;
``` 

- Ahora ejecutamos el ejemplo.

```bash
npm run dev
```
Si quieres jugar un poco más con las query strings añade: 

_./pages/components/user-collection/row.tsx_
```diff
<td>
+ <Link href={`/user-info?id=${props.user.id}&name=${props.user.login}`}>
- <Link href={`/user-info?id=${props.user.id}`}>     
     <a>{props.user.login}</a>
 </Link>        
</td>
````
Despúes para ver otro parámetro capturado desde la query string añade esto:  

_./pages/user-info-tsx_

```dif  import {withRouter} from 'next/router';


const UserInfoPage = withRouter((props) => (
  <div>
  <h2>I'm the user info page</h2>    
  <h3>{props.router.query.id}</h3>
+ <h3>{props.router.query.name}</h3>      
  </div>
));

export default UserInfoPage;
```

Ejecuta el ejemplo de nuevo si lo habías parado 

```bash
npm run dev
```