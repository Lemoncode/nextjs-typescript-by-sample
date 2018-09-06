# Material-UI

Este ejemplo introducirá el uso de Material-UI para mostrar un aspecto más moderno en la página principal. Para ello sustituiremos la tabla que actualmente muestra a los usuarios por una lista de tarjetas.

# Pasos

- Tomaremos como punto de partida el ejemplo _06-detail-page_.

- Instalamos las dependencias.

```bash
npm install
```

- Instalamos Material-UI

```bash
npm install @material-ui/core --save
```

- Creamos el componente tarjeta que mostrará los datos del usuario.

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

- Ahora creamos el componente que contendrá el listado de usuarios.

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

- Exportamos el nuevo componente.

_./pages/components/user-collection/index.ts_

```diff
- export { UserTable } from './user-table';
+ export { UserList } from './user-list';
```

- En la página principal usamos el nuevo componente para mostrar el listado de usuarios.

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

- Eliminamos los anteriores componentes.

_./pages/components/user-collection/header.tsx_

_./pages/components/user-collection/row.tsx_

_./pages/components/user-collection/user-table.tsx_


- Vamos a probarlo:

```bash
npm run dev
```

Podemos observar que durante unos milisegundos la página no se muestra correctamente, esto es debido a que no hemos indicado al servidor como renderizar la página. Es importante proporcionar a la página el CSS requerido, de lo contrario, la página se procesará solo con el HTML y luego esperará a que el cliente inyecte el CSS.

Para inyectar el estilo al cliente, necesitamos:

  1. Crear una nueva instacia de sheetsRegistry y theme en cada solicitud.
  2. Renderizar el árbol de React y la instancia en el lado del servidor.
  3. Sacar el CSS de sheetsRegistry.
  4. Pasar el CSS al cliente.

En el lado del cliente, el CSS se inyectará por segunda vez antes de eliminar el CSS inyectado del lado del servidor.

Lo primero que tenemos que hacer en cada solicitud es crear una nueva instancia de sheetsRegistry y theme.

- Instalamos JSS

```bash
npm install jss --save
```

- Creamos las instancias de theme and sheetsRegistry.

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

Al renderizar, envolveremos la aplicación, nuestro componente raíz, dentro de JssProvider y MuiThemeProvider para que el sheetsRegistry y el theme estén disponibles para todos los componentes en el árbol de componentes.

- Instalamos react-jss

```bash
npm install react-jss --save
```

- Creamos el envoltorio _app.js (¡cuidado con el guión bajo precedente!).

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

El paso clave en el procesamiento del servidor es representar el HTML inicial de nuestro componente antes de enviarlo al lado del cliente, insertando en el lado del servidor nuestro componente inicial, HTML y CSS, en una plantilla que se representará en el lado del cliente.

- Instalamos prop-types

```bash
npm install prop-types --save
```

- Creamos la plantilla _document.js (¡cuidado con el guión bajo precedente!).

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

- Vamos a probarlo:

```bash
npm run dev
```