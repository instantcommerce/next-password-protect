const path = require('path');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');

const hasNextBabelLoader = (r) => {
  if (Array.isArray(r.use)) {
    return r.use.find((l) => l && l.loader === 'next-babel-loader');
  }

  return r.use && r.use.loader === 'next-babel-loader';
};

module.exports = {
  webpack(config, options) {
    config.module.rules.forEach((rule) => {
      if (/(ts|tsx)/.test(String(rule.test)) && hasNextBabelLoader(rule)) {
        rule.include = [...rule.include, path.join(__dirname, '..', 'src')];

        return rule;
      }
    });

    config.module.rules.push({
      test: /\.svg$/,
      use: [{ loader: '@svgr/webpack', options: { icon: true, svgo: false } }],
    });

    config.resolve.plugins = [
      new TsconfigPathsPlugin({ extensions: config.resolve.extensions }),
    ];

    config.resolve.alias = {
      ...config.resolve.alias,
      next: path.resolve('./node_modules/next'),
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    };

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.PASSWORD_PROTECT': JSON.stringify(
          process.env.ENVIRONMENT === 'staging',
        ),
      }),
    );

    return config;
  },
};
