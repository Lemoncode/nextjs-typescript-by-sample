# Friendly URL's

One of the goals of supporting server side rendering is to obtain good SEO results. One of the basic pilars of SEO consists on generating
friendly URL's, right now in the user detail page we are generating something like:

http://localhost:3000/user-info?login=brauliodiez

It would be better to rewrite the URL and display it in the following way:

http://localhost:3000/user-info/login/brauliodiez

We will do that in two steps:
  - Support this friendly url on the client side.
  - Support this friendly url on the server side.

# Steps

- Let's start by copying the content of _04-querystring_ in our working folder.

- Let's install the needed packages.

```bash
npm install
```

- Let's update our _row.tsx_ component to use a link alias.

_./pages/components/users/row.tsx_

```diff
    <td>
-     <Link href={`/user-info?login=${props.user.login}`}>
+     <Link as={`user-info/login/${props.user.login}`} href={`/user-info?login=${props.user.login}`}>
        <a>{props.user.login}</a>
      </Link>    
    </td>
...

```

- Let's run the sample and check how it works:

```bash
npm run dev
```

- Are we ready? The answer is no, if we click on refresh it won't perform the server side rendering properly (we get a 404).

- To get the server behaving in the same way as the client we need to do some extra plumbing.

- Let's install _express_

```bash
npm install express --save
```

- Let's create a file called _server.js_ 

_./server.js_

```javascript
const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handler = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.get('*', (req, res) => {
      return handler(req, res);
    });

    server.listen(3000, err => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000');
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });

```

> in this file we just create a next app and listen to any request, this request will just be handled by the next app.

- Let's update our _package.json_ entry.

_./package.json_

```diff
  "scripts": {
-    "dev": "next"
+    "dev": "node server.js"
  },
```

- Let's double check that the server is working (no server side clean url yet).

```bash
npm run dev
```

- Now let's add a get case for the new friendly url we have created.

_./server.js_

```diff
...

app
  .prepare()
  .then(() => {
    const server = express();

+   server.get('/user-info/login/:login', (req, res) => {
+     return app.render(req, res, '/user-info', { login: req.params.login });
+   });

    server.get('*', (req, res) => {
      return handler(req, res);
    });
...

```

> NOTE: Important, you have to declare this route before `*`.

- If we run the code now, we're going to get the right behavior after we refresh the page.

```bash
npm run dev
```
