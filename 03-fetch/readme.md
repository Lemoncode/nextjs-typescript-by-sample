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

const baseRoot = 'https://api.github.com/orgs/lemoncode';
const userCollectionURL = `${baseRoot}/members`

const getUserCollection =  async () => {
  const res = await fetch(userCollectionURL)
  const data = await res.json();

  return data.map(
    ({id, login, avatar_url,}) => ({ id, login, avatar_url, } as UserEntity)
  );
}

export default getUserCollection;
```

- Let's consume it in our _index_ page, first we will just console out the api call result.
One important thing to note down, we will make use of _getInitialProps_ this new hook
allows us to make a call from the server side or client side. We need to revamp 
the component to class one, on the other hand the console is not written because is
not executed in the client.

```diff
import * as React from 'react';
import Link from 'next/link';
+ import getUserCollection from '../rest-api/github';

- const myLanguage = "Typescript";

+ export class Index extends React.Component<{}, {}> {
  constructor(props) {
    super(props);
  }

+  static getInitialProps = async function () {
+    const data = await getUserCollection();    
+    console.log(data);
+  }

  render() {
    return (
    <div>
      <p>Hello Next.js</p>
      <p>From {myLanguage}</p>
      <Link href="/user-info">
        <a>Navigate to user info page</a>
      </Link>
    </div>
    )
  }
}

export default Index;
```

- Let's add a state entry and add the info to that

```diff
import * as React from 'react';
import Link from 'next/link';
import getUserCollection from '../rest-api/github';
+ import UserEntity from '../model/user'

- const myLanguage = "Typescript";

+ interface State {
+   userCollection : UserEntity[];
+ }

- export class Index extends React.Component<{}, {}> {
+ export class Index extends React.Component<{}, State> {  
  constructor(props) {
    super(props);
+   this.state = {userCollection: []};
  }

  getInitialProps = async function () {
    const data = await getUserCollection();    
-    console.log(data);
+   this.setState({userCollection : data});
  }

  render() {
    return (
    <div>
      <p>Hello Next.js</p>
-      <p>From {myLanguage}</p>
+      <p>{this.state.userCollection}</p>
      <Link href="/user-info">
        <a>Navigate to user info page</a>
      </Link>
    </div>
    )
  }
}

export default Index;
```

## Appendix

What if we want to store the list of users in the component State instead of Properties, we could do it in this way:

```typescript
import * as React from 'react';
import Link from 'next/link';
import getUserCollection from '../rest-api/github';
import {UserEntity} from '../model/user'
import { UserHeader } from './components/user-info/header';
import { UserRow } from './components/user-info/row';


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

        <table>
          <thead>
              <UserHeader />
          </thead>
          <tbody>
            {
              this.state.myStateCollection.map((user: UserEntity) =>
                <UserRow user={user} key={user.id} />
              )
            }
          </tbody>
        </table>

        <Link href="/user-info">
          <a>Navigate to user info page</a>
        </Link>
      </div>
    )
  }
}


export default Index;
```