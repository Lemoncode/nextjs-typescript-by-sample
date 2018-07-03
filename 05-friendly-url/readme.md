# Friendly URL's

One of the goals of supporting server side rendering is to obtain good SEO results. One of the basic pilars of SEO consists on generating
friendly URL's, right now in the user detail page we are generating something like:

http://localhost:3000/user-info?id=1457912

It would be better to rewrite the URL and display it in the following way:

http://localhost:3000/user-info/id/1457912

We will that in two steps:
  - Support this friendly url on the client side.
  - Support this friendly url on the server side.

# Steps

- Let's start by copying the content of _04-querystring_ into our working folder.

- Let's install the needed packages.

```bash
npm install
```
- Let's update our _row.tsx_ component to use a link alias.

_./pages/components/user-collection/row.tsx_

```diff
    <td>
-      <Link href={`/user-info?id=${props.user.id}`}>
+      <Link as={`user-info/id/${props.user.id}`} href={`/user-info?id=${props.user.id}`}>
        <a>{props.user.login}</a>
      </Link>    
    </td>
```

- Let's run the sample and check how this work:

```bash
npm run dev
```

- Are we ready? the answer is no, if we click on refresh it won't perform the server side rendering properly (we get a 404).

- To get the server behaving in the same way as the client we need to do some extra plumbing.

- Let's install _express_

```bash
npm install express --save
```

- Let's create a file called _server.js_ 

_./server.js_

```javascript
const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
.then(() => {
  const server = express()

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
```

> in this file we just create a next app and listen to any request, this request will be just handled by the next app.

- Let's update our _package.json_ entry.

_./package.json_

```diff
  "scripts": {
-    "dev": "next",
+    "dev": "node server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

- Let's double check that the server is working (no server side clean url yet).

```bash
npm run dev
```

- Now let's add a get case for the new friendly url we have created.

```diff
const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
.then(() => {
  const server = express()

+ server.get('/user-info/id/:id', (req, res) => {
+   const actualPage = '/user-info';
+   const queryParams = {id: req.params.id};
+   app.render(req, res, actualPage, queryParams);
+ })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
```

- If we run the code now we get the righ the behavior when refreshing the page.

```bash
npm run dev
```