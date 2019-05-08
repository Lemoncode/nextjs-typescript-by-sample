# Production mode

In this example we are going to add necessary config for create an app in prod mode.

# Steps

- Let's start by copying the content of _09-css-in-js_ in our working folder.

- Let's install the needed packages.

```bash
npm install
```

- Add build step:

### ./package.json

```diff
...
 "scripts": {
    "dev": "node server.js"
+   "dev": "node server.js",
+   "build": "next build"
  }, 
```

- Install `dotenv`:

```bash
npm install dotenv --save
```

- Add `.env` file:

### ./.env

```
NODE_ENV=production
```

- Update `server`:

### ./server.js

```diff
const express = require('express');
const next = require('next');
+ require('dotenv').config();
```

- Update npm script:

### ./package.json

```diff
...
 "scripts": {
-   "dev": "node server.js",
+   "start": "node server.js",
    "build": "next build"
  }, 
```

- Update to `target: server`:

### ./next.config.js

```diff
...
-   target: 'serverless',
+   target: 'server',
```
