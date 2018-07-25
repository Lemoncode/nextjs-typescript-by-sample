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
export interface UserEntity {
  login: string;
  id: number;
  avatar_url: string;
}
```

- Vamos a crear una rest-api simple
_./rest-api/github.ts_

```typescript
import {UserEntity} from '../model/user';
import fetch from 'isomorphic-unfetch';

const baseRoot = 'https://api.github.com/orgs/lemoncode';
const userCollectionURL = `${baseRoot}/members`

export const getUserCollection =  async () => {
  const res = await fetch(userCollectionURL)
  const data = await res.json();

  return data.map(
    ({id, login, avatar_url,}) => ({ id, login, avatar_url, } as UserEntity)
  );
}
```
- Vamos a consumir los datos en nuestra página principal, primero simplemente mostraremos por consola el resultado de la llamada a la api. Una cosa importante a remarcar, vamos a hacer uso de getInitialProps que nos permite realizar una llamada desde el lado del servidor o del cliente.

```diff
+ import * as React from 'react';
import Link from 'next/link';
+ import * as Next from 'next';
+ import { getUserCollection } from '../rest-api/github';
+ import { UserEntity } from '../model/user';

- const myLanguage = "Typescript";

+ interface Props {
+  userCollection: UserEntity[],
+ }

- const Index = () => (
+ const Index : Next.NextSFC<Props> = (props) => (
  <div>
    <p>Hello Next.js</p>
-    <p>From {myLanguage}</p>
    <Link href="/user-info">
      <a>Navigate to user info page</a>
    </Link>

  </div>
);

+ Index.getInitialProps = async () =>  {
+ const data = await getUserCollection();
+
+  return {
+    userCollection: data,
+  }
+ }

export default Index;
```

- Ahora si colocamos un  _console.log(data);_ justo después de 
_const data = await getUserCollection();_ aunque no se vea en el navegador el
resultado se mostrará en la consola del servidor.

- Ahora que tenemos la parte del consumo de datos vamos a comenzar con la parte
UI.

_./components/user-collection/header.tsx_

```typescript
import * as React from 'react';

export const UserHeader = () =>
    <tr>
        <th>
            Avatar
        </th>
        <th>
            Id
        </th>
        <th>
            Name
        </th>
    </tr>
```

_./components/user-collection/row.tsx_

```typescript
import * as React from 'react';
import { UserEntity } from 'model/user';

interface Props {
  user: UserEntity;
}

export const UserRow = (props: Props) =>
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
```

_./components/user-collection/user-table.tsx_

```typescript
import { UserEntity } from "model/user";
import { UserHeader } from "./header";
import { UserRow } from "./row";

interface Props {
  userCollection: UserEntity[],
}

export const UserTable = (props : Props) => 
<table>
<thead>
  <UserHeader />
</thead>
<tbody>
  {
    props.userCollection.map((user: UserEntity) =>
      <UserRow user={user} key={user.id} />
    )
  }
</tbody>
</table>
```

_./components/user-collection/index.ts_

```typescript
export {UserTable} from './user-table';
```

- Let's update the page.

_./pages/index.tsx_

```diff
import * as React from 'react';
import * as Next from 'next';
import Link from 'next/link';
import getUserCollection from '../rest-api/github';
import { UserEntity } from 'model/user';
+ import {UserTable} from '../components/user-collection';


interface Props {
  userCollection: UserEntity[],
}

const Index : Next.NextSFC<Props> = (props) => (
  <div>
  <p>Hello Next.js</p>

+  <UserTable userCollection={props.userCollection}/>

  <Link href="/user-info">
    <a>Navigate to user info page</a>
  </Link>
</div>
)

Index.getInitialProps = async () =>  {
  const data = await getUserCollection();

  return {
    userCollection: data,
  }
}
```

## Apendice

Si preferimos mantener la lista de usuarios en el estado del componente en lugar de en las propiedades, podemos hacerlo de la siguiente manera:


```typescript
import * as React from 'react';
import Link from 'next/link';
import getUserCollection from '../rest-api/github';
import {UserEntity} from '../model/user'
import { UserTable } from './components/user-collection';


interface Props {
  userCollection: UserEntity[],  
}

interface State {
  myStateCollection : UserEntity[];
}

export class Index extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {myStateCollection: []}
    console.log("test ****************************");
  }

  static async getInitialProps() {
    console.log("getInitialProps ****************************");
    const data = await getUserCollection();
  
    return {
      userCollection: data,  
    }
    
  }

  static getDerivedStateFromProps(nextProps : Props, prevState : State) : State {    
    if(nextProps.userCollection !== prevState.myStateCollection) {
      return ({
        myStateCollection: nextProps.userCollection,
      })
    } else {
      return null;
    }
  }

  render() {
    return (
      <div>
        <p>Hello Next.js</p>

        <UserTable userCollection={this.state.myStateCollection}/>

        <Link href="/user-info">
          <a>Navigate to user info page</a>
        </Link>
      </div>
    )
  }
}


export default Index;
```
