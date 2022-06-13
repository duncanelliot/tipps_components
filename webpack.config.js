const config = {
  name: "production",
  mode: "production",
  entry: {
    index: './src/js/index.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'tipps_components.js',
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
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
  },
};