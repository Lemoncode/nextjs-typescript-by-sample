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

- Time to create an entity that will hold the user details.

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

- Let's create a new entry on the api to read the details of the selected user from the github api.

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

- Now that we have the data loaded is time to display it on the component, we will just implement something very simple.

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

- Let's give a try:

```bash
npm run dev
```
