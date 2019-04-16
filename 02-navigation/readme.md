# Navigation

So far we have created a simple porject including a single page, let's create a second page and add navigation between the first
and the second one.

# Steps

- To get started copy the files from sample _01-hello-typescript_ and execute:

```bash
npm install
```

- Let's create a page called 'user-info'.

_./pages/user-info.tsx_

```typescript
const UserInfoPage = () => (
  <div>
    <h2>I'm the user infopage</h2>
  </div>
)

export default UserInfoPage;

```

- Now in order to add some useful navigation in both client and server side we can wrap a navigation ancho with a nextjs hoc to handle navigatin in an universal way.

_./pages/index.tsx_

```diff
+ import Link from 'next/link';

const myLanguage: string = "Typescript";

const Index = () => (
  <div>
    <p>Hello Next.js</p>
    <p>From {myLanguage}</p>
+   <Link href="/user-info">
+     <a>Navigate to user info page</a>
+   </Link>    
  </div>
);

export default Index;
```

> If we don't use this _Link_ HOC when clicking on the link it would navigate to the server rather than making client side 
navigation.

- Let's run the sample:

```bash
npm run dev
```

> Now you can notice, navigation is done client side, plus browser history is informed on each navigation.
> See differences using `a` element.
