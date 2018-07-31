# Material-UI

Este ejemplo introducirá el uso de Material-UI para mostrar un aspecto más moderno en la página principal. Para ello sustituiremos la tabla que actualmente muestra a los usuarios por una lista de tarjetas.

# Pasos

- Tomaremos como punto de partida el ejemplo _06-detail-page_.

- Instalamos las dependencias.

```bash
npm install
```

- Instalamos Material-UI

```bash
npm install @material-ui/core --save
```

- Creamos el componente tarjeta que mostrará los datos del usuario.

_./pages/components/user-collection/card.tsx_

```typescript
import * as React from 'react';
import Link from 'next/link';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography';

import { UserEntity } from 'model/user';

interface Props {
    user: UserEntity;
}

export const UserCard = (props: Props) =>
    <div>
        <Card>
            <CardMedia style={{ height: 0, paddingTop: '56.25%' }} image={props.user.avatar_url} />
            <CardContent>
                <Typography gutterBottom variant="headline" component="h2">
                    {props.user.login}
                </Typography>
                <Typography component="p">
                    Id: {props.user.id}
                </Typography>
            </CardContent>
            <CardActions>
                <Link as={`user-info/id/${props.user.login}`} href={`/user-info?id=${props.user.login}`}>
                    <Button size="small" color="primary">
                        User info
                    </Button>
                </Link>
            </CardActions>
        </Card>
    </div>
```

- Ahora creamos el componente que contendrá el listado de usuarios.

_./pages/components/user-collection/user-list.tsx_

```typescript
import * as React from 'react';

import Grid from '@material-ui/core/Grid'

import { UserEntity } from "model/user";
import { UserCard } from "./card";

interface Props {
  userCollection: UserEntity[],
}

export const UserList = (props: Props) =>
  <div>
    <Grid container spacing={24} style={{ padding: 24 }}>
      {
        props.userCollection.map((user: UserEntity) =>
          <Grid item xs={12} sm={6} lg={4} xl={3}>
            <UserCard user={user} key={user.id} />
          </Grid>
        )
      }
    </Grid>
  </div>
```

- Exportamos el nuevo componente.

_./pages/components/user-collection/index.ts_

```diff
- export { UserTable } from './user-table';
+ export { UserList } from './user-list';
```

- En la página principal usamos el nuevo componente para mostrar el listado de usuarios.

_./pages/index.tsx_

```diff
import * as React from 'react';
import * as Next from 'next';
- import Link from 'next/link';
+ import Typography from '@material-ui/core/Typography';
import { getUserCollection } from '../rest-api/github';
- import { UserTable } from '../components/user-collection';
+ import { UserList } from '../components/user-collection';
import { UserEntity } from 'model/user';

interface Props {
  userCollection: UserEntity[],
}

const Index: Next.NextSFC<Props> = (props) => (
  <div>
-    <p>Hello Next.js</p>
+    <Typography variant="display1" gutterBottom>
+      Hello Next.js
+    </Typography>

-    <UserTable userCollection={props.userCollection}/>
+    <UserList userCollection={props.userCollection} />

-    <Link href="/user-info">
-        <a>Navigate to user info page</a>
-    </Link>
  </div>
)

Index.getInitialProps = async () => {
  const data = await getUserCollection();

  return {
    userCollection: data,
  }
}

export default Index;
```

- Eliminamos los anteriores componentes.

_./pages/components/user-collection/header.tsx_

_./pages/components/user-collection/row.tsx_

_./pages/components/user-collection/user-table.tsx_


- Vamos a probarlo:

```bash
npm run dev
```