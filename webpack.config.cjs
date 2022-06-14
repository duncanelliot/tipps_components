const path = require("path");
const webpack = require('webpack')
require("dotenv").config();

console.log(path.resolve(__dirname,'src/js/Show/'))

module.exports = [
  {
    name: "production",
    mode: "production",
    entry: {
      index: './src/js/index.js',
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'tipps_components.js',
      library: {
        name: "tipps_components",
        type: 'umd'
      },
      publicPath: '',
    },
    module: {
      rules: [
        {
          test: /\.s?css$/,
          exclude: /node_modules/,
          use: [
            'style-loader',
            'css-loader',
            // 'postcss-loader',
            // {
            //   loader: 'sass-loader',
            //   options: { implementation: require('sass') },
            // },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.js'],
      restrictions: [''],
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        ENV: "production",
        ENDPOINT: "http://localhost:8080",
      }),
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
      }),
    ],
  },
  {
    name: "development",
    mode: "development",
    devtool: "inline-cheap-module-source-map",
    entry: {
      index: './src/js/index.js',
    },
    output: {
      path: path.resolve(__dirname, './test'),
      filename: 'tipps_components.js',
      library: {
        name: "tipps_components",
        type: 'umd'
      },
      publicPath: '',
    },
    module: {
      rules: [
        {
          test: /\.s?css$/,
          exclude: /node_modules/,
          use: [
            'style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.js$/,
          exclude: [/node_modules/,path.resolve(__dirname,'src/js/Show/')]
        }
      ],
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        ENV: "development",
        ENDPOINT: "http://tipps.co.uk.eu.ngrok.io",
      }),
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
      }),
    ],
  },
];