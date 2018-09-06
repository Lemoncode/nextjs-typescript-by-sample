# Material-UI

This example we will introduce Material-UI to show a more modern look to the main page. We will replace the table that currently shows users with a list of cards.

# Steps

- We will take as starting point sample _06-detail-page_.

- Let´s install the dependencies.

```bash
npm install
```

- Now we install Material-UI

```bash
npm install @material-ui/core --save
```

- We create the card component that will show the user´s data.

_./pages/components/user-collection/card.tsx_

```typescript
import * as React from 'react';
import Link from 'next/link';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography';

import { UserEntity } from 'model/user';

interface Props {
    user: UserEntity;
}

export const UserCard = (props: Props) =>
    <div>
        <Card>
            <CardMedia style={{ height: 0, paddingTop: '56.25%' }} image={props.user.avatar_url} />
            <CardContent>
                <Typography gutterBottom variant="headline" component="h2">
                    {props.user.login}
                </Typography>
                <Typography component="p">
                    Id: {props.user.id}
                </Typography>
            </CardContent>
            <CardActions>
                <Link as={`user-info/id/${props.user.login}`} href={`/user-info?id=${props.user.login}`}>
                    <Button size="small" color="primary">
                        User info
                    </Button>
                </Link>
            </CardActions>
        </Card>
    </div>
```

- Now we create the component that will contain the list of users.

_./pages/components/user-collection/user-list.tsx_

```typescript
import * as React from 'react';

import Grid from '@material-ui/core/Grid'

import { UserEntity } from "model/user";
import { UserCard } from "./card";

interface Props {
  userCollection: UserEntity[],
}

export const UserList = (props: Props) =>
  <div>
    <Grid container spacing={24} style={{ padding: 24 }}>
      {
        props.userCollection.map((user: UserEntity) =>
          <Grid item xs={12} sm={6} lg={4} xl={3}>
            <UserCard user={user} key={user.id} />
          </Grid>
        )
      }
    </Grid>
  </div>
```

- We export the new control.

_./pages/components/user-collection/index.ts_

```diff
- export { UserTable } from './user-table';
+ export { UserList } from './user-list';
```

- In the main page we use the new component to show the list of users.

_./pages/index.tsx_

```diff
import * as React from 'react';
import * as Next from 'next';
- import Link from 'next/link';
+ import Typography from '@material-ui/core/Typography';
import { getUserCollection } from '../rest-api/github';
- import { UserTable } from '../components/user-collection';
+ import { UserList } from '../components/user-collection';
import { UserEntity } from 'model/user';

interface Props {
  userCollection: UserEntity[],
}

const Index: Next.NextSFC<Props> = (props) => (
  <div>
-    <p>Hello Next.js</p>
+    <Typography variant="display1" gutterBottom>
+      Hello Next.js
+    </Typography>

-    <UserTable userCollection={props.userCollection}/>
+    <UserList userCollection={props.userCollection} />

-    <Link href="/user-info">
-        <a>Navigate to user info page</a>
-    </Link>
  </div>
)

Index.getInitialProps = async () => {
  const data = await getUserCollection();

  return {
    userCollection: data,
  }
}

export default Index;
```

- Delete the previous components.

_./pages/components/user-collection/header.tsx_

_./pages/components/user-collection/row.tsx_

_./pages/components/user-collection/user-table.tsx_


- Let´s give a try:

```bash
npm run dev
```

We can see that for a few milliseconds the page is not displayed correctly, this is because we have not indicated to the server how to render the page. It's important to provide the page with the required CSS, otherwise the page will render with just the HTML then wait for the CSS to be injected by the client.

To inject the style down to the client, we need to:

  1. Create a fresh, new sheetsRegistry and theme instance on every request.
  2. Render the React tree with the server-side API and the instance.
  3. Pull the CSS out of the sheetsRegistry.
  4. Pass the CSS along to the client.

On the client side, the CSS will be injected a second time before removing the server side injected CSS.

The first thing that we need to do on every request is create a new sheetsRegistry and theme instance.

- We install JSS

```bash
npm install jss --save
```

- We created the theme and sheetsRegistry instances.

_./material-ui/mui-theme.js_

```javascript
import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
    
})

export default theme;
```

_./material-ui/getPageContext.js_

```javascript
import { SheetsRegistry } from 'jss';
import { createGenerateClassName } from '@material-ui/core/styles';
import theme from './mui-theme';

function createPageContext() {
    return {
        theme,
        // This is needed in order to deduplicate the injection of CSS in the page.
        sheetsManager: new Map(),
        // This is needed in order to inject the critical CSS.
        sheetsRegistry: new SheetsRegistry(),
        // The standard class name generator.
        generateClassName: createGenerateClassName(),
    };
}

export default function getPageContext() {
    // Make sure to create a new context for every server-side request so that data
    // isn't shared between connections (which would be bad).
    if (!process.browser) {
        return createPageContext();
    }

    // Reuse context on the client-side.
    if (!global.__INIT_MATERIAL_UI__) {
        global.__INIT_MATERIAL_UI__ = createPageContext();
    }

    return global.__INIT_MATERIAL_UI__;
}
```

When rendering, we will wrap App, our root component, inside a JssProvider and MuiThemeProvider to make the sheetsRegistry and the theme available to all components in the component tree.

- We install react-jss

```bash
npm install react-jss --save
```

- We create the wrap _app.js (care with the preceding underscore!).

_./pages/_app.js_

```javascript
import * as React from 'react';
import App, { Container } from 'next/app';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import JssProvider from 'react-jss/lib/JssProvider';
import getPageContext from '../material-ui/getPageContext';

class MyApp extends App {
    constructor(props) {
        super(props);
        this.pageContext = getPageContext();
    }

    pageContext = null;

    componentDidMount() {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
    }

    render() {
        const { Component, pageProps } = this.props;
        return (
            <Container>
                {/* Wrap every page in Jss and Theme providers */}
                <JssProvider registry={this.pageContext.sheetsRegistry}
                        generateClassName={this.pageContext.generateClassName}>
                    <MuiThemeProvider theme={this.pageContext.theme}
                            sheetsManager={this.pageContext.sheetsManager}>
                        <CssBaseline />
                        {/* Pass pageContext to the _document though the renderPage enhancer to render collected styles on server side. */}
                        <Component pageContext={this.pageContext} {...pageProps} />
                    </MuiThemeProvider>
                </JssProvider>
            </Container>
        );
    }
}

export default MyApp;
```

The key step in server processing is to represent the initial HTML of our component before sending it to the client side, by injecting on the server side our initial component, HTML and CSS, into a template that will be represented on the client side.

- We install prop-types

```bash
npm install prop-types --save
```

- We create the template _document.js (care with the preceding underscore!).

_./pages/_document.js_

```javascript
import * as React from 'react';
import PropTypes from 'prop-types';
import Document, { Head, Main, NextScript } from 'next/document';
import flush from 'styled-jsx/server';

class MyDocument extends Document {
    render() {
        const { pageContext } = this.props;

        return (
            <html lang="en" dir="ltr">
                <Head>
                    <title>Hello Next.js</title>
                    <meta charSet="utf-8" />
                    {/* Use minimum-scale=1 to enable GPU rasterization */}
                    <meta
                        name="viewport"
                        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
                    />
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}

MyDocument.getInitialProps = ctx => {
    // Render app and page and get the context of the page with collected side effects.
    let pageContext;
    const page = ctx.renderPage(Component => {
        const WrappedComponent = props => {
            pageContext = props.pageContext;
            return <Component {...props} />;
        };

        WrappedComponent.propTypes = {
            pageContext: PropTypes.object.isRequired,
        };

        return WrappedComponent;
    });

    return {
        ...page,
        pageContext,
        // Styles fragment is rendered after the app and page rendering finish.
        styles: (
            <React.Fragment>
                <style
                    id="jss-server-side"
                    dangerouslySetInnerHTML={{ __html: pageContext.sheetsRegistry.toString() }}
                />
                {flush() || null}
            </React.Fragment>
        ),
    };
};

export default MyDocument;
```

- Let´s give a try:

```bash
npm run dev
```