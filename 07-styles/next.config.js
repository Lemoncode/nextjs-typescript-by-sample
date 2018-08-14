// next.config.js
const withTypescript = require('@zeit/next-typescript');
const withCSS = require('@zeit/next-css');
module.exports = withCSS(withTypescript({
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[local]___[hash:base64:5]",
  },
  webpack(config, options) {
    return config;
  }
}));