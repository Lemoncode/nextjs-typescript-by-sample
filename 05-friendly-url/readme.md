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