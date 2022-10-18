var path = require("path");
const webpack = require('webpack');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const devMode = process.env.NODE_ENV !== 'production' 

module.exports = { 
  output: {
    path: path.resolve(__dirname, "../shiptimize-for-woocommerce/assets/js"),
    filename: "[name].js",
    publicPath: "/shiptimize-for-woocommerce/assets/js"
  }, 
  mode: devMode ? 'development' : 'production',
  entry: {
    'shiptimize':  './shiptmize.js',
    'shiptimize-admin':'./shiptimize-admin.js',
    'shiptimize-wcfm': './js/shiptimize-wcfm.js',
    'shiptimize-dokan': './js/shiptimize-dokan.js'
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '../css/[name].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    })
  ],
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: { presets: ["es2015"] }
        }
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        test: /(\.scss|\.css)$/, //css is necessary if we import libs that use it. 
        use: [
           MiniCssExtractPlugin.loader, 
          { loader: 'css-loader', options: { url: false, sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } }            
        ],
      },
      {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [{
              loader: 'file-loader',
              options: {
                  name: '[name].[ext]',
                  outputPath: 'fonts/'
              }
          }]
      }
    ]
  }
};