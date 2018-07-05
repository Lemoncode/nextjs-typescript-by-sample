# Detail page

Let's complete the sample by implementing the details page.

This example won't introduce any new concept, just grab the right id from the query string,
fetch the user detailed data and display it.

# Steps

- We will take as starting point sample _05-friendly-url_.

- Let's install the dependencies.

```bash
npm install
```

- Now we will make an update to pass to the user-info url the name of the user instead of the id.

_./pages/components/user-collection/row.tsx_

```diff
-  <Link as={`user-info/id/${props.user.id}`} href={`/user-info?id=${props.user.id}`}>
+   <Link as={`user-info/id/${props.user.login}`} href={`/user-info?id=${props.user.login}`}>
    <a>{props.user.login}</a>
  </Link>
```

- Time to create an entity that will hold the user details.

__./model/user-detail.ts_

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

- Let's create a new entry on the api to read the details of the selected user from the github api.

_./rest-api/github.tsx_

```diff
import {UserEntity} from '../model/user';
+ import {UserDetailEntity} from '../model/user-detail';
import fetch from 'isomorphic-unfetch';

-const baseRoot = 'https://api.github.com/orgs/lemoncode';
- const userCollectionURL = `${baseRoot}/members`
+ const baseRoot = 'https://api.github.com';
+ const userCollectionURL = `${baseRoot}/orgs/lemoncode/members`
+ const userDetailsURL = `${baseRoot}/user`

- const getUserCollection =  async () => {
+ export  const getUserCollection =  async () => {
  const res = await fetch(userCollectionURL)
  const data = await res.json();

  return data.map(
    ({id, login, avatar_url,}) => ({ id, login, avatar_url, } as UserEntity)
  );
}

+ export const getUserDetail = async (userlogin: string) : Promise<UserDetailEntity> => {
+  const fullUserDetailURL = `${userDetailsURL}/${userlogin}`;
  
+  const res = await fetch(fullUserDetailURL)
+  const data = await res.json();
+  console.log(data);
+  const { id, login, avatar_url, name, company, followers } = data;
+
+  return { id, login, avatar_url, name, company, followers };  
+ }

- export default getUserCollection;
```


- Now that we have the data loaded is time to display it on the component, we will just implement something very simple.

_./pages/user-info.tsx_

```diff
import * as React from 'react';
import * as Next from 'next';
import {withRouter} from 'next/router';
+ import {getUserDetail} from '../rest-api/github';
+ import {UserDetailEntity} from '../model/user-detail';

interface Props {
  userId : string;
+  userDetail : UserDetailEntity;
}
```

_./pages/user-info.tsx_

```diff
const InnerUserInfoPage : Next.NextSFC<Props> = (props)  => (
  <div>
    <h2>I'm the user info page</h2>      
    <p>User ID Selected: {props.userId}</p> 
+    <img src={props.userDetail.avatar_url} style={{ maxWidth: '10rem' }} />
+    <p>User name: {props.userDetail.name}</p>  
+    <p>Company: {props.userDetail.company}</p>  
+    <p>Followers: {props.userDetail.followers}</p>  
  </div>
);

InnerUserInfoPage.getInitialProps = async (props) =>  {
  const query = props.query;
  const id = query.id as string;

+  const userDetail = await getUserDetail(id);

  return {    
    userId: id,
+    userDetail
  }
}
```

- Let's give a try:

```bash
npm run dev
```