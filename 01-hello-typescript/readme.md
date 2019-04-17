# Hello typescript

In this example we will add Typescript support to our project, we will start from sample _00-hello-next_.

At the moment of the writing of this sample Babel 7 was on beta (Babel 7 will have typescript support), we will use
a plugin based on Babel 7: https://github.com/zeit/next-plugins/tree/master/packages/next-typescript

This is the official typescript plugin for next.

# Steps

- To get started copy the files from sample _00-hello-next_ and execute:

```bash
npm install
```

- Let's install Typescript plus _next-typescript_ plugin.

```
npm install @zeit/next-typescript --save
```

- And the typings.

```
npm install typescript @types/next @types/react --save-dev
```

- We need to add a typescript configuration.

_./tsconfig.json_

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "jsx": "preserve",
    "allowJs": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "removeComments": false,
    "preserveConstEnums": true,
    "sourceMap": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "lib": [
      "dom",
      "es2016"
    ]
  }
}
```

- Next allow us to extend it's default webpack configuration,
let's create a _next.config.js_ file and include the Typescript configuration.

_./next.config.js_

```javascript
const withTypescript = require('@zeit/next-typescript');

module.exports = withTypescript();

```

- Babel needs to be configured to work. We create ./.babelrc in the root folder. In this example, we use this .babelrc:

_[./.babelrc](./.babelrc)_

```json
{
  "presets": [
    "next/babel",
    "@zeit/next-typescript/babel"
  ]
}

```

- Let's rename our _index.js_ to _index.tsx_.

- Let's add some simple typescript code to check that 
transpilation is working as expected.

```diff 
+ const myLanguage : string = "Typescript";

const Index = () => (
  <div>
    <p>Hello Next.js</p>
+   <p>From {myLanguage}</p>
  </div>
);

export default Index;
```

- Let's try the sample

```bash
npm run dev
```



