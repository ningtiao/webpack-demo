// resolve 用来拼接绝对路径的方法
const { resolve } =  require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
  // webpack配置
  // 入口起点
  entry: './src/main.js',
  // 输出
  output: {
    filename: 'bundle.js', // 输出文件名
    // __dirname是node.js的变量,代表当前文件目录绝对路径
    path: resolve(__dirname, 'dist') // 输出路径
  },
  devServer: {
    contentBase: resolve(__dirname, 'dist'),
    compress: true, // 启动gzip压缩
    port: '3000', // 端口号,
    open: true, // 自动打开浏览器
  },
  // 详细loader配置
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // use数组中loader执行顺序,从下到上
          // 创建style标签,将js中的样式资源插入进行
          'style-loader',
          // 将css 文件变成commonjs模块加载到js中
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          // 将less文件编译成css文件
          'less-loader'
        ]
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        // 处理图片
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader',
        options: {
          // 图片大小小于10kb,就会被base64处理
          // 优点: 减少请求数量(减轻服务器压力)
          // 缺点: 图片体积会更大(文件请求速度更慢)
          limit: 10 * 1024,
          esModule: false,
          // [hash:10] 取图片前10位
          name: '[hash:10].[ext]',
          outputPath: 'image'
        }
      },
      {
        test: /\.html$/,
        // 处理html文件img图片
        loader: 'html-loader'
      },
      {
        test: /\.(eot|woff2?|ttf|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name]-[hash:5].min.[ext]",
              limit: 3000,
              outputPath: 'font',
            }
          }
        ]
      }
    ]
  },
  // plugins的配置
  plugins: [
    // 默认创建一个空HTML,自动打包输出的所有资源,这里对应index.html文件
    new HtmlWebpackPlugin({
      // 复制 './index.html'文件,并自动打包引入输出所有资源
      template: './index.html'
    }),
    new CleanWebpackPlugin()
  ],
  // 模式
  mode: 'development', // 开发模式
  // mode: 'production',
}