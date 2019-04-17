# Fetching data

It's time to fetch data from a remote source, let consume a Github api end point to retrieve a list 
of members that belong to a group.

# Steps

- We will take as starting point _02-navigation_ (let's copy that sample into a new subfolder).

- Let's install the dependencies.

```bash
npm install
```

- In order to perform a fetch call on both server and client side we will install the package
_isomorphic-unfetch_.

```bash
npm install isomorphic-unfetch --save
```

- let's create a model.

_./model/user.ts_

```typescript
export interface User {
  login: string;
  id: number;
  avatar_url: string;
}

```

- Let's create a simple _rest-api_ entry:

_./rest-api/github.ts_

```typescript
import { User } from '../model/user';
import fetch from 'isomorphic-unfetch';

const baseRoot = 'https://api.github.com/orgs/lemoncode';
const userCollectionURL = `${baseRoot}/members`

export const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch(userCollectionURL)
  const data = await res.json();

  return data.map(
    ({ id, login, avatar_url, }) => ({ id, login, avatar_url, } as User)
  );
}

```

- Let's consume it in our _index_ page, first we will just console out the api call result.
One important thing to note down, we will make use of _getInitialProps_ this new hook
allows us to make a call from the server side or client side.

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

> Now if we place a _console.log(data);_ right after
> _fetch_ we can check that the output is displayed not in the browser but in your server console.
> But if we navigate to `user-info` and back to index page, it will execute in client side.

- Now that we have the data let's add the UI part.

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

- Let's update the page.

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

## Appendix

What if we want to store the list of users in the component State instead of Properties, we could do it in this way:

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
