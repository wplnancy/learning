/**
 * 每一个 chunk 一般情况下会产生一个文件
 */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: "development",
  // entry: './src/index.js', // 如果是单人口 则 chunk 名字是 main
  entry: {
    index: './src/index.js',
    login: './src/lodin.js'
  },
  // 因为开发环境下的 webpack 配置和生产环境下的配置有很多不一样的地方
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash:8].js',
    publicPath: '/'
  },
  devServer: {
    port: 8080,
    contentBase: path.join(__dirname, 'dist'),
    open: true,
    host: "localhost",
    compress: true
  },

  devtool: "eval",

  module: {
    rules: [{
        test: /.js$/,
        use: []
      }, {
        test: /\.css$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
        // use: [{
        //   loader: 'style-loader'
        // }, "css-loader"]
        //  use: ["style-loader", "css-loader"]
        //  loader: ["style-loader", "css-loader"]
      },
      // {
      //   test: /\.(png|jpg|jpeg|gif|svg)$/,
      //   loader: ['file-loader']
      // },

      // url-loader 内置了 file-loader
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          // 如果要加载的图片大小小于 10k 的话， 就把这张图片转换为 base64 内嵌到 html中
          limit: 10* 1024
        }
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', //指定模板文件
      filename: 'index.html', //产出后的文件名
      inject: true,
      hash: true, //为了避免缓存，可以在产出的资源后面添加hash值
      chunks: ['index'],
      chunksSortMode: 'manual' //对引入代码块进行排序的模式
    }),
    new CleanWebpackPlugin({
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css', // 代码块文件名， 在异步加载的时候用的
    })
  ]
}