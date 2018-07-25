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
export interface UserEntity {
  login: string;
  id: number;
  avatar_url: string;
}
```

- Let's create a simple _rest-api_ entry.

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

- Let's consume it in our _index_ page, first we will just console out the api call result.
One important thing to note down, we will make use of _getInitialProps_ this new hook
allows us to make a call from the server side or client side.

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

- Now if we place a _console.log(data);_ right after
_const data = await getUserCollection();_ we can check 
that the output is displayed not in the browser but in your server console.

- Now that we have the data let's add the UI part.

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

## Appendix

What if we want to store the list of users in the component State instead of Properties, we could do it in this way:

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
