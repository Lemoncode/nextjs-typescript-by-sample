# Adding styles with Next.js and CSS

In this sample, we are going to give a brief overview on the steps needed to add CSS support to our Next.js based project.

# Steps to add standard global CSS

- We will take sample 06-detail-page as our starting point

- As usual, let's start with the installation of the dependencies in the package.json file.

```bash
npm install
```

- In order to use external CSS files in our application, we actually need to add a new dependency to our project. Concretely, we should run the code below to add the ```next-css``` package to our app:
```bash
npm install --save @zeit/next-css
```

- This new dependency provides us with a ```withCSS``` function that we can invoke in our _./next.config.js_ file to extend our current configuration with CSS-handling capabilities. Thus, should refactor our _./next.config.js_ as follows:
```javascript
// next.config.js
const withTypescript = require('@zeit/next-typescript');
const withCSS = require('@zeit/next-css');
module.exports = withCSS(withTypescript({
  webpack(config, options) {
    return config
  }
}));
```

- And that's it, we can now handle CSS files. So, let's go an create a global CSS styles file for our app. For the time being, let's create a ```global-styles.css``` inside a new folder called ```styles```. The contents for this CSS file _./styles/global-styles.css_ can be found below:
```
.blue-box {
  border: 3px solid blue;
}
```

- And now let's add this new style to our user collection. For example, let's go to our user-collection header component and apply this new CSS rule on the 'Avatar' header. Like this:
```diff
+import '../../styles/global-styles.css';
export const UserHeader = () =>
    <tr>
        <th>
+            <div className="blue-box">
                Avatar
+            </div>
        </th>
```

- If we run our app now... we should actually see no changes at all. How's that? The problem is that we have not yet told Next.js how we should be loading our global CSS file in our webapp. By default, ```next-css``` is compiling our CSS files to _.next/static/style.css_, and the contents of this file are being served from the URL below
```
/_next/static/style.css
```

- Thus, we need to tell our app that the CSS should be read from that entry point. In order to do this, we need to somehow tell Next.js to use a custom document structure, so that we can provide a suitable ```link``` inside the HTML document's header that points to our CSS serving point. We can do this by adding a filed named ```_document.js``` (care with the preceding underscore!) into our ```pages``` folder. The contents of such a file would be as read below:
```diff
+import Document, { Head, Main, NextScript } from 'next/document'
+
+export default class MyDocument extends Document {
+  render() {
+    return (
+      <html>
+        <Head>
+          <link rel="stylesheet" href="/_next/static/style.css" />
+        </Head>
+        <body>
+          <Main />
+          <NextScript />
+        </body>
+      </html>
+    )
+  }
+}
```

- After adding this custom document specification, we can now run ```npm run dev```, and we shall see that the 'Avatar' block of our user collection header is indeed wrapped in a blue box.

# Steps to add CSS using the CSS-Modules approach

- If we want to process the CSS files in our application following the pattern for CSS Modules, we need to enable the corresponding flag in our next.js config file.
```diff
module.exports = withCSS(withTypescript({
+  cssModules: true,
  webpack(config, options) {
    return config;
  }
}));
```

- By adding this, we can now go to our user-collection folder and create a new _./components/user-collection/header.css_ file with some extra styling rules for our table's header. For instance,
```
.purple-box {
  border: 2px dotted purple;
}
```

- Now we can import this file into our header component code and use the class we have just defined to modify, for example, the styles for Id header. Notice that since we used kebab case notation for our naming convention, we need to index the corresponding class using computed properties.
```diff
+const classNames = require('./header.css');

export const UserHeader = () =>
    <tr>
        <th>
            <div className={classNames.bluebox}>
                Avatar
            </div>
        </th>
        <th>
+            <div className={classNames['purple-box']}>
                Id
+            </div>
        </th>
```

- Let's re-run our app. We can see that the Id header is in fact wrapped in a dotted purple box. Moreover, the blue-box around the Avatar header has gone the way of the dodos! This is because every CSS is being compiled now as if using the CSS-Modules pattern, so we cannot add them to our component classes by just adding the corresponding import and the literal name of the class. In fact, if we check the Sources in the browser's console, we can check that the contents for the ```_next/static/style.css``` file do indeed include both of our CSS rules. However, the blue box is not being indexed properly and thus not rendered.

- Let's refactor our code a little further to fully follow CSS-Modules pattern. Delete the previously created _./styles_ folder and move the CSS rules for the blue box into our _./components/user-collection/header.css_ file. Let's also remove the dash in the name for the CSS class.
´´´diff
.purple-box {
  border: 2px dotted purple;
}

+.bluebox {
+  border: 3px solid blue;
+}
´´´

- And finally, let's refactor the way we are referring to the blue box class in our header component
```diff
import * as React from 'react';
-import '../../styles/global-styles.css';

const classNames = require('./header.css');

export const UserHeader = () =>
    <tr>
        <th>
-            <div className="blue-box">
+            <div className={classNames.bluebox}>
                Avatar
            </div>
        </th>
        <th>
            <div className={classNames['purple-box']}>
                Id
            </div>
        </th>
```

- We should now be able to see both styles being applied correctly

- Just to finish, the ```withCSS``` function is actually a compositional interface to provide syntactic sugar over your regular webpack configuration. In fact, it is using a ```css-loader``` behind the scenes. We can provide additional configuration options as per [webpack's css loader options](https://github.com/webpack-contrib/css-loader#options). Let's add, for example, local scope to our CSS rules. If we modify the _./next.config.js_ file as follows:
```diff
module.exports = withCSS(withTypescript({
  cssModules: true,
+  cssLoaderOptions: {
+    importLoaders: 1,
+    localIdentName: "[local]___[hash:base64:5]",
+  },
  webpack(config, options) {
    return config;
  }
}));
```

- ...we would be naming our CSS rules using the local names in the CSS file alongside a hash. If we go now to the browser's console and check the names for the CSS rules previously stored in ```_next/static/styles.css```, we can see that they are no longer named after just a rather long hash, but instead they now follow the pattern established by ```cssLoaderOptions.localIdentName``` configuration property.

- To finish this sample, let's use CSS rules to provide some actually good looking styles to the user-collection table, shall we? First of all, we are going to change the contents of the _./components/user-collection/header.css_ file as follows:
```diff
-.purple-box {
-  border: 2px dotted purple;
-}
-
-.bluebox {
-  border: 3px solid blue;
-}
+.header th{
+  background-color: #DDEFEF;
+  border: solid 1px #DDEEEE;
+  color: #336B6B;
+  padding: 10px;
+  text-align: left;
+  text-shadow: 1px 1px 1px #fff;
+}
```

- Then, we are going to create two new files inside _./components/user-collection/_ folder, _./components/user-collection/row.css_ and _./components/user-collection/user-table.css_, with the respective contents below:
- _./components/user-collection/row.css_
```diff
+.row td {
+  border: solid 1px #DDEEEE;
+  color: #333;
+  padding: 10px;
+  text-shadow: 1px 1px 1px #fff;
+}
```
- _./components/user-collection/header.css_
```diff
+.user-table {
+  border: solid 1px #DDEEEE;
+  border-collapse: collapse;
+  border-spacing: 0;
+  font: normal 13px Arial, sans-serif;
+}
```

- And finally, we modify the corresponding components to add the new styling rules:
- _./components/user-collection/header.tsx_
```diff
export const UserHeader = () =>
-    <tr>
+    <tr className={classNames.header}>
        <th>
-            <div className={classNames.bluebox}>
                Avatar
-            </div>
        </th>
        <th>
-            <div className={classNames['purple-box']}>
                Id
-            </div>
        </th>
```

- _./components/user-collection/row.tsx_
```diff
import Link from 'next/link';

+const classNames = require('./row.css');

interface Props {
  user: UserEntity;
}

export const UserRow = (props: Props) =>
-  <tr>
+  <tr className={classNames.row}>
    <td>
      <img src={props.user.avatar_url} style={{ maxWidth: '10rem' }} />
    </td>
    <td>
```

- _./components/user-collection/user-table.tsx_
```diff
import { UserRow } from "./row";

+const classNames = require('./user-table.css');

interface Props {
  userCollection: UserEntity[],
}

export const UserTable = (props : Props) =>
-<table>
+<table className={classNames['user-table']}>
  <thead>
    <UserHeader />
  </thead>
  <tbody>
```

