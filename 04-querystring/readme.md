# Query string navigation

We have created a page to display a list of users, what about displaying info of a given user in a detail page? 
(use case: user click on a user in the given list, navigate to detail page to display the details of that user).

# Steps

- We will start form sample _03-fetch_, let's copy the content into a new folder (we will work from there).

- Let's install the dependencies.

```bash
npm install
```

- Let's update _row.tsx_ and add a link that will let us navigate to the detail page.

- Let's first add a _link_ import.

_./pages/components/user-collection/row.tsx_

```diff
import * as React from 'react';
import { UserEntity } from 'model/user';
+ import Link from 'next/link';
```

- Now lets add the link:

_./pages/components/user-collection/row.tsx_

```diff
    <td>
+     <Link href={`/user-info?id=${props.user.id}`}>
-      <span>{props.user.login}</span>
+      <a>{props.user.login}</a>
+     </Link>        
    </td>
```

- Now let's read the query string param from the _user-info_ page, in order to do that we will
make use of _nextjs_ _withRouter_ HOC.

_./pages/user-info-tsx_

```diff
+ import {withRouter} from 'next/router';

- const Index = () => (
+ const UserInfoPage = withRouter((props) => (
  <div>
    <h2>I'm the user info page</h2>    
+   <h3>{props.router.query.id}</h3>    
  </div>
-);
+));

export default UserInfoPage;
``` 

- Let's run the sample.

```bash
npm run dev
```

If you want to play a little bit more with query string just add

_./pages/components/user-collection/row.tsx_

```diff
    <td>
+ <Link href={`/user-info?id=${props.user.id}&name=${props.user.login}`}>
- <Link href={`/user-info?id=${props.user.id}`}>     
+     <a>{props.user.login}</a>
+ </Link>        
    </td>
```
And later to see other parameter captured from the query string add this:

_./pages/user-info-tsx_

```diff
 import {withRouter} from 'next/router';


const UserInfoPage = withRouter((props) => (
  <div>
    <h2>I'm the user info page</h2>    
   <h3>{props.router.query.id}</h3>
+  <h3>{props.router.query.name}</h3>      
  </div>

));

export default UserInfoPage;
``` 
- Let's run the sample again.

```bash
npm run dev
```