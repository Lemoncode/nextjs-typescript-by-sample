# Serverless

In this example we are going to add necessary config for create a serverless app.

# Steps

- Let's start by copying the content of _07-styles_ in our working folder.

- Let's install the needed packages.

```bash
npm install
```

- Create a new repository in [github](https://github.com) or [gitlab](https://gitlab.com).

- Create a free account in [zeit.co/now](https://zeit.co/now).

- Upload our app to repository.

- In order to enable `serverless` mode, we need to update our `next.config.js` file:

_./next.config.js_

```diff
const withTypescript = require('@zeit/next-typescript');
const withCSS = require('@zeit/next-css');

module.exports = withTypescript(
  withCSS({
    cssModules: true,
    cssLoaderOptions: {
      camelCase: true,
      importLoaders: 1,
      localIdentName: '[local]___[hash:base64:5]',
    },
+   target: 'serverless',
  })
);

```

- Add `now` configuration file, [more docs](https://zeit.co/docs/v2/deployments/configuration):

_./now.json_

```json
{
  "version": 2,
  "name": "test-now-deploy",
  "builds": [{ "src": "next.config.js", "use": "@now/next" }]
}

```

- Git commit to repository.

- Now, our app was deployed at `https://test-now-deploy-59lyhaf1v.now.sh/` or similar url.

- Notice that it's not working the `friendly-url` due to we are not using `server.js` file when build app. We need to configure `now.json` to resolve routes:

_./now.json_

```diff
{
  "version": 2,
  "name": "test-now-deploy",
- "builds": [{ "src": "next.config.js", "use": "@now/next" }]
+ "builds": [{ "src": "next.config.js", "use": "@now/next" }],
+ "routes": [{ "src": "/user-info/login/(?<login>[^/]+)", "dest": "/user-info?login=$login" }]
}

```

> NOTE: Previous configuration only works for `now` cloud, not in local mode.

- Commit changes to repository and it will be auto deployed to `now` cloud.
