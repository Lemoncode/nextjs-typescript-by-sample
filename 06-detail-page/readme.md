# Detail page

Let's complete the sample by implementing the details page.

This sample won't introduce any new concept, just grab the right id from the query string,
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
+ const userDetailsURL = `${baseRoot}/users`

- const getUserCollection =  async () => {
+ export  const getUserCollection =  async () => {
  const res = await fetch(userCollectionURL)
  const data = await res.json();

  return data.map(
    ({id, login, avatar_url,}) => ({ id, login, avatar_url, } as UserEntity)
  );
}

+ export const getUserDetail =  async (login : string) => {
+  const fullUserDetailURL = `${userDetailsURL}/${login}`;

+  const res = await fetch(fullUserDetailURL)
+  const data = await res.json();
+
+  return data.map(
+    ({id, login, avatar_url, name, company, followers}) => ({ id, login, avatar_url, name, company, followers} as UserDetailEntity)
+  );
+ }


- export default getUserCollection;
```

- Let's update the _index_ page import.

```diff
- import getUserCollection from '../rest-api/github';
+ import {getUserCollection} from '../rest-api/github';
import {UserTable} from './components/user-collection';
import { UserEntity } from 'model/user';
```

- Next step let's add _getInitialProps_ to the _user-info.tsx_ page.

_./pages/user-info.tsx_

```diff
+ import * as Next from 'next';
import {withRouter} from 'next/router';
+ import { getUserDetail } from '../rest-api/github';
+ import { UserDetailEntity } from 'model/user-details';

- const Index =withRouter((props) => (
+ const Index =withRouter((props) : Next.NextSFC<Props> => (
  <div>
    <h2>I'm the user info page</h2> 
    <h3>{props.router.query.id}</h3>          
  </div>
));

+ Index.getInitialProps = async (props) =>  {
+   const data = await getUserDetail();
+
  return {
    userCollection: data,
  }
}

export default Index;
```


- Now that we have the data loaded is time to display it on the component, we will just implement something very simple.

_./pages/user-info.tsx_

```diff
```

  login: string;
  id: number;
  avatar_url: string;
  name : string;
  company : string;
  followers : string;



- Let's give a try:

```bash
npm run dev
```