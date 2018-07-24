# Página detalle

Vamos a completar el ejemplo implementando la página de detalles.

Este ejemplo no introducirá ningún concepto nuevo, sólo toma el id correcto de la query string, busca los datos detallados del usuario y los muestra.

# Pasos

- Tomaremos como punto de partida el ejemplo _05-friendly-url_.

- Instalamos las dependencias.

```bash
npm install
```

- Ahora haremos una actualización para pasar a la url de user-info el nombre del usuario en lugar del id.

_./pages/components/user-collection/row.tsx_

```diff
-  <Link as={`user-info/id/${props.user.id}`} href={`/user-info?id=${props.user.id}`}>
+   <Link as={`user-info/id/${props.user.login}`} href={`/user-info?id=${props.user.login}`}>
    <a>{props.user.login}</a>
  </Link>
```

- Es hora de crear una entidad que contenga los detalles del usuario.

_./model/user-detail.ts_

```typescript
export interface UserDetailEntity {
  login: string;
  id: number;
  avatar_url: string;
  name : string;
  company : string;
  followers : string;
}
```

- Vamos a crear una nueva entrada en la API para leer los detalles del usuario seleccionado desde la api de github.

_./rest-api/github.ts_

```diff
import { UserEntity } from '../model/user';
+ import { UserDetailEntity } from '../model/user-detail';
import fetch from 'isomorphic-unfetch';

const baseRoot = 'https://api.github.com';
const userCollectionURL = `${baseRoot}/orgs/lemoncode/members`;
+ const userDetailsURL = `${baseRoot}/users`;

export const getUserCollection = async () => {
  const res = await fetch(userCollectionURL)
  const data = await res.json();

  return data.map(
    ({id, login, avatar_url,}) => ({ id, login, avatar_url, } as UserEntity)
  );
}

+ export const getUserDetail = async (userlogin: string) : Promise<UserDetailEntity> => {
+   const fullUserDetailURL = `${userDetailsURL}/${userlogin}`;
+    
+   const res = await fetch(fullUserDetailURL)
+   const data = await res.json();
+   console.log(data);
+   const { id, login, avatar_url, name, company, followers } = data;
+   return { id, login, avatar_url, name, company, followers };  
+ }
```

- Ahora que tenemos los datos cargados es hora de mostrarlos en el componente, implementaremos algo muy simple.

_./pages/user-info.tsx_

```diff
+ import * as React from 'react';
+ import * as Next from 'next';
import { withRouter } from 'next/router';
+ import { getUserDetail } from '../rest-api/github';
+ import { UserDetailEntity } from '../model/user-detail';

+ interface Props {
+   userId : string;
+   userDetail : UserDetailEntity;
+ }
+ 
+ const InnerUserInfoPage : Next.NextSFC<Props> = (props)  => (
+   <div>
+     <h2>I'm the user info page</h2>      
+     <p>User ID Selected: {props.userId}</p> 
+     <img src={props.userDetail.avatar_url} style={{ maxWidth: '10rem' }} />
+     <p>User name: {props.userDetail.name}</p>  
+     <p>Company: {props.userDetail.company}</p>  
+     <p>Followers: {props.userDetail.followers}</p>  
+   </div>
+ );
+ 
+ InnerUserInfoPage.getInitialProps = async (props) =>  {
+   const query = props.query;
+   const id = query.id as string;
+ 
+   const userDetail = await getUserDetail(id);  
+ 
+   return {    
+     userId: id,
+     userDetail
+   }
+ }
+ 
+ const UserInfoPage = withRouter(InnerUserInfoPage);
+ 
+ export default UserInfoPage;

- const Index = withRouter((props) => (
-   <div>
-     <h2>I'm the user info page</h2> 
-     <h3>{props.router.query.id}</h3>     
-   </div>
- ));

- export default Index;
```

- Vamos a probarlo:

```bash
npm run dev
```