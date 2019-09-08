/**
 * 每一个 chunk 一般情况下会产生一个文件
 * chunk 只要有一个模块变化了 就会改变 
 * chunksSortMode 对引入的模块的顺序进行控制
 * entry 和 chunk 的关系是一对多的关系
 *
 */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const glob = require("glob")
// 压缩
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
  mode: "development",
  // entry: './src/index.js', // 如果是单人口 则 chunk 名字是 main
  entry: {
    index: './src/index.js',
    // vendor: glob.sync('./node_modules/**/*.js')
    // login: './src/lodin.js'
  },
  optimization: {
    minimizer: [ // 放压缩的插件
      // 压缩 js
      new TerserPlugin({
        parallel: true,
        cache: true
      }),

      // 压缩 css 资源
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        //cssnano是PostCSS的CSS优化和分解插件。cssnano采用格式很好的CSS，并通过许多优化，以确保最终的生产环境尽可能小。
        cssProcessor: require("cssnano")
      })
    ]
  },
  // 因为开发环境下的 webpack 配置和生产环境下的配置有很多不一样的地方
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash:8].js',
    publicPath: '/' // 根路径  在浏览器里面访问的时候要以什么路径进行访问
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
      test: /\.html?$/,
      loader: ['html-withimg-loader']
    },{
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
          limit: 10* 1024,
          name: "[name].[ext]",
          outputPath: "images"
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
       root: path.resolve(__dirname, "dist"),
       verbose: true,
       dry: false
     }),

    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css', // 代码块文件名， 在异步加载的时候用的 在 异步加载的时候用
    })
  ]
}