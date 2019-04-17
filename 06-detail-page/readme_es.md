# Página detalle

Vamos a completar el ejemplo implementando la página de detalles.

Este ejemplo no introducirá ningún concepto nuevo, sólo toma el id correcto de la query string, busca los datos detallados del usuario y los muestra.

# Pasos

- Tomaremos como punto de partida el ejemplo _05-friendly-url_.

- Instalamos las dependencias.

```bash
npm install
```

- Es hora de crear una entidad que contenga los detalles del usuario.

_./model/user-detail.ts_

```typescript
export interface UserDetail {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  company: string;
  followers: string;
}

```

- Vamos a crear una nueva entrada en la API para leer los detalles del usuario seleccionado desde la api de github.

_./rest-api/github.ts_

```diff
import { User } from '../model/user';
+ import { UserDetail } from '../model/user-detail';
import fetch from 'isomorphic-unfetch';

- const baseRoot = 'https://api.github.com/orgs/lemoncode';
+ const baseRoot = 'https://api.github.com';
- const userCollectionURL = `${baseRoot}/members`
+ const userCollectionURL = `${baseRoot}/orgs/lemoncode/members`;
+ const userDetailURL = `${baseRoot}/users`;

export const fetchUsers = async () => {
  const res = await fetch(userCollectionURL)
  const data = await res.json();

  return data.map(
    ({ id, login, avatar_url, }) => ({ id, login, avatar_url, } as User)
  );
}

+ export const fetchUserDetail = async (user: string): Promise<UserDetail> => {
+   const res = await fetch(`${userDetailURL}/${user}`);
+   const { id, login, avatar_url, name, company, followers } = await res.json();

+   return {
+     id,
+     login,
+     avatar_url,
+     name,
+     company,
+     followers,
+   };
+ };

```

- Ahora que tenemos los datos cargados es hora de mostrarlos en el componente, implementaremos algo muy simple.

_./pages/user-info.tsx_

```diff
- import { withRouter } from 'next/router';
+ import * as Next from 'next';
+ import { fetchUserDetail } from '../rest-api/github';
+ import { UserDetail } from '../model/user-detail';

- const UserInfoPage = withRouter((props) => (
-   <div>
-     <h2>I'm the user infopage</h2>
-     <h3>{props.router.query.login}</h3>
-   </div>
- ));

+ interface Props {
+   login: string;
+   userDetail: UserDetail;
+ }

+ const UserInfoPage: Next.NextStatelessComponent<Props> = props => (
+   <div>
+     <h2>I'm the user infopage</h2>
+     <p>User ID: {props.userDetail.id}</p>
+     <img src={props.userDetail.avatar_url} style={{ maxWidth: '10rem' }} />
+     <p>User name: {props.login}</p>
+     <p>Company: {props.userDetail.company}</p>
+     <p>Followers: {props.userDetail.followers}</p>
+   </div>
+ );

+ UserInfoPage.getInitialProps = async props => {
+   const login = props.query.login as string;
+   const userDetail = await fetchUserDetail(login);

+   return {
+     login,
+     userDetail,
+   };
+ };

export default UserInfoPage;

```

- Vamos a probarlo:

```bash
npm run dev
```
