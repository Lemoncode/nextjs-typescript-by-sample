# Recuperando datos

Ha llegado el momento de recuperar datos desde una fuente remota, vamos a consumir datos a través de un servicio de github para recuperar una lista de miembros que pertenecen a un grupo.

# Pasos
- El punto de comienzo de este ejemplo es _02-navigation_ (vamos a copiar este ejemplo en una nueva subcarpeta)

- A continuación instalaremos las dependencias

```bash
npm install
```

- Para realizar la recuperación de datos en el lado de servidor y en el de cliente vamos a instalar el paquete _isomorphic-unfetch_.

```bash
npm install isomorphic-unfetch --save
```


- A continuación vamos a crear un modelo.

_./model/user.ts_

```typescript
export interface User {
  login: string;
  id: number;
  avatar_url: string;
}

```

- Vamos a crear una rest-api simple:

_./rest-api/github.ts_

```typescript
import { User } from '../model/user';
import fetch from 'isomorphic-unfetch';

const baseRoot = 'https://api.github.com/orgs/lemoncode';
const userCollectionURL = `${baseRoot}/members`

export const fetchUsers = async () => {
  const res = await fetch(userCollectionURL)
  const data = await res.json();

  return data.map(
    ({ id, login, avatar_url, }) => ({ id, login, avatar_url, } as User)
  );
}

```

- Vamos a consumir los datos en nuestra página principal, primero simplemente mostraremos por consola el resultado de la llamada a la api. Una cosa importante a remarcar, vamos a hacer uso de getInitialProps que nos permite realizar una llamada desde el lado del servidor o del cliente.

_./pages/index.tsx_

```diff
+ import * as Next from 'next';
import Link from 'next/link';
+ import { fetchUsers } from '../rest-api/github';
+ import { User } from '../model/user';

- const myLanguage = "Typescript";

+ interface Props {
+   users: User[];
+ }

- const Index = () => (
+ const Index: Next.NextStatelessComponent<Props> = (props) => (
  <div>
    <p>Hello Next.js</p>
-   <p>From {myLanguage}</p>
    <Link href="/user-info">
      <a>Navigate to user info page</a>
    </Link>
  </div>
);

+ Index.getInitialProps = async () => {
+   const users = await fetchUsers();
+   console.log(users);

+   return {
+     users,
+   }
+ }

export default Index;
```

> Ahora si colocamos un  _console.log(data);_ justo después de 
> _fetch_ aunque no se vea en el navegador el resultado se mostrará en la consola del servidor.
> Pero si navegamos a `user-info` y después volvemos, veremos que se ejecuta en cliente.

- Ahora que tenemos la parte del consumo de datos vamos a comenzar con la parte UI.

_./components/users/header.tsx_

```typescript
export const Header = () => (
  <tr>
    <th>Avatar</th>
    <th>Id</th>
    <th>Name</th>
  </tr>
)

```

_./components/users/row.tsx_

```typescript
import * as Next from 'next';
import { User } from '../../model/user';

interface Props {
  user: User;
}

export const Row: Next.NextStatelessComponent<Props> = (props) => (
  <tr>
    <td>
      <img src={props.user.avatar_url} style={{ maxWidth: '10rem' }} />
    </td>
    <td>
      <span>{props.user.id}</span>
    </td>
    <td>
      <span>{props.user.login}</span>
    </td>
  </tr>
)

```

_./components/users/table.tsx_

```typescript
import * as Next from 'next';
import { User } from '../../model/user';
import { Header } from './header';
import { Row } from './row';

interface Props {
  users: User[];
}

export const Table: Next.NextStatelessComponent<Props> = (props) => (
  <table>
    <thead>
      <Header />
    </thead>
    <tbody>
      {
        props.users.map(user => (
          <Row key={user.id} user={user} />
        ))
      }
    </tbody>
  </table>
)

```

_./components/users/index.ts_

```typescript
export * from './table';

```

- Actualicemos la página.

_./pages/index.tsx_

```diff
...
import { User } from '../model/user';
+ import { Table } from '../components/users';

...

const Index: Next.NextStatelessComponent<Props> = (props) => (
  <div>
    <p>Hello Next.js</p>
+   <Table users={props.users} />
    <Link href="/user-info">
      <a>Navigate to user info page</a>
    </Link>
  </div>
);
...

```

## Apendice

Si preferimos mantener la lista de usuarios en el estado del componente en lugar de en las propiedades, podemos hacerlo de la siguiente manera:

_./pages/index.tsx_

```diff
+ import * as React from 'react';
import * as Next from 'next';
import Link from 'next/link';
import { fetchUsers } from '../rest-api/github';
import { User } from '../model/user';
import { Table } from '../components/users';

interface Props {
  users: User[];
}

- const Index: Next.NextStatelessComponent<Props> = (props) => (
+ const Index: Next.NextStatelessComponent<Props> = (props) => {
+   const [users] = React.useState(props.users);
+   console.log('Rendering users');

+   return (
      <div>
        <p>Hello Next.js</p>
-       <Table users={props.users} />
+       <Table users={users} />
        <Link href="/user-info">
          <a>Navigate to user info page</a>
        </Link>
      </div>
    );
+ }

Index.getInitialProps = async () => {
  const users = await fetchUsers();
- console.log(users);
+ console.log('Initial Props');
  
  return {
    users,
  }
}

export default Index;

```
