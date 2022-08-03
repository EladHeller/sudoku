/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import * as webpack from 'webpack';
import * as webpackDevServer from 'webpack-dev-server';

export default (): webpack.Configuration & webpackDevServer.Configuration => ({
  mode: 'production',
  entry: './src/index.ts',
  resolve: { extensions: ['.ts', '.js'] },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(t|j)s$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        exclude: /\.component\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 8081,
  },
});
