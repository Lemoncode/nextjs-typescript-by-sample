# Hello nextjs

Let's get started with the very basics let's create a very basic 'Hello World' sample using next.

In this example we will use javascript as base language, in our next sample we will move to typescript.

This sample is quite similar to the basic one pointed in nextjs tutorial: https://nextjs.org/learn/basics/getting-started/setup

# Steps

- Let's create our project (ensure that your folder container does not contain spaces or capital letters).

```bash
npm init -y
```

- Let's start by installing some basic packages:

```bash
npm install react react-dom next --save
```

- Let's open _package.json_ and add the following npm script:

_package.json_

```diff
"scripts": {
- "test": "echo \"Error: no test specified\" && exit 1"
+ "dev": "next"
},
```

- Let's create our first page (by convention it should fall under the pages subfolder).

_./pages/index.js_

```javascript
const Index = () => (
  <div>
    <p>Hello Next.js</p>
  </div>
);

export default Index;
```

- Let's run the sample:

```bash
npm run dev
```

- Now we can open a browser and point to: http://localhost:3000 and see the results.
