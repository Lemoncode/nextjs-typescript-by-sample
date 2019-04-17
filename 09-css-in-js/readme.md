# CSS in JS

In this example we are going to add necessary config for create an app with css-in-js.

# Steps

- Let's start by copying the content of _08-serverless_ in our working folder.

- Let's install the needed packages.

```bash
npm install
```

- In order to get ready with `emotion` we will install:

```bash
npm install @emotion/core @emotion/styled babel-plugin-emotion --save 
```

- Configure `babel-plugin-emotion`:

_./.babelrc_

```diff
{
  "presets": [
    "next/babel",
    "@zeit/next-typescript/babel"
- ]
+ ],
+ "plugins": [
+   "emotion"
+ ]
}

```

- And that is, we will update our components. Rename `header.css` by `header.styles.tsx`:

_./components/users/header.styles.tsx_

```diff
+ import styled from '@emotion/styled';

- .purple-box {
+ export const Avatar = styled.th`
    border: 2px dotted purple;
- }
+ `;

- .blue-box {
+ export const Id = styled.th`
    border: 3px solid blue;
- }
+ `;

```

- Update `header` component:

_./components/users/header.tsx_

```diff
- const styles = require('./header.css');
+ import * as s from './header.styles';

export const Header = () => (
  <tr>
-   <th className={styles.blueBox}>Avatar</th>
+   <s.Avatar>Avatar</s.Avatar>
-   <th className={styles.purpleBox}>Id</th>
+   <s.Id>Id</s.Id>
    <th>Name</th>
  </tr>
);

```

> NOTE: we could load detail page as first page and then navigate to main page without any issue.
