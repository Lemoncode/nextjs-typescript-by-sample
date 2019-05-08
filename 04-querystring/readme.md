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

_./pages/components/users/row.tsx_

```diff
import * as Next from 'next';
+ import Link from 'next/link';
import { User } from '../../model/user';
...

```

- Now lets add the link:

_./pages/components/users/row.tsx_

```diff
    <td>
+     <Link href={`/user-info?login=${props.user.login}`}>
-       <span>{props.user.login}</span>
+       <a>{props.user.login}</a>
+     </Link>        
    </td>
...

```

- Now let's read the query string param from the _user-info_ page, in order to do that we will
make use of _nextjs_ _withRouter_ HOC.

_./pages/user-info.tsx_

```diff
+ import { withRouter } from 'next/router';

- const UserInfoPage = () => (
+ const UserInfoPage = withRouter((props) => (
  <div>
    <h2>I'm the user info page</h2>    
+   <h3>{props.router.query.login}</h3>    
  </div>
-);
+));

export default UserInfoPage;
```

- Let's run the sample.

```bash
npm run dev
```

- Add debugging:

### ./.vscode/launch.json

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Next",
      "runtimeExecutable": "${workspaceFolder}\\node_modules\\.bin\\next",
      "port": 9229,
      "env": {
        "NODE_OPTIONS": "--inspect"
      }
    }
  ]
}

```

- If you want to play a little bit more with query string just add:

_./pages/components/users/row.tsx_

```diff
    <td>
-     <Link href={`/user-info?login=${props.user.login}`}>     
+     <Link href={`/user-info?id=${props.user.id}&login=${props.user.login}`}>
        <a>{props.user.login}</a>
      </Link>        
    </td>
```

- And later to see other parameter captured from the query string add this:

_./pages/user-info.tsx_

```diff
import { withRouter } from 'next/router';

const UserInfoPage = withRouter((props) => (
  <div>
    <h2>I'm the user infopage</h2>
+   <h3>{props.router.query.id}</h3>
    <h3>{props.router.query.login}</h3>
  </div>
));

export default UserInfoPage;
```

- Let's run the sample again.

```bash
npm run dev
```
