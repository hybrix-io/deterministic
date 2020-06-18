const webpack = require("webpack");
const path = require('path');

const plugins = [];

plugins.push(
  new webpack.ProvidePlugin({
    BigInt: "big-integer"
  }),
);

plugins.push(
new webpack.NormalModuleReplacementPlugin(
                        /node_modules\/bcrypto\/lib\/node\/bn\.js/,
                        "../js/bn.js"
                )
);
module.exports = {
  //entry: ['core-js/stable/promise', './deterministic.js'],
 entry: ['./deterministic.js'],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  mode: "development",
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    path: path.resolve(__dirname, '.'),
    filename: 'bundle.js',
    library: 'test' // added to create a library file
  },
  plugins,
  target: "web",
  node: {
    fs: "empty"
  }
};
