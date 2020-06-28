
> 该文将使用Webpack 版本4.43.0, node.js 版本 10.21,将从以下三个部分来使用webpack进行项目的打包构建
- 从简单的使用Webpack到深入
- 从零开始配置 vue3.0 项目进行构建
- Webpack的原理
### Webpack 是什么
Webpack 是一种前端构建工具, 一个静态模块打包器(module bunder).
在Webpack看来, 前端所有的资源文件(js/json/css/img/less/...)都会作为模块处理
它将根据模块的依赖关系进行静态分析,打包生成对应的静态资源(bundle)。
### Webpack的优点
- 专注处理模块化的项目,能做到开箱即用,一步到位
- 可通过Plugin扩展,完整好用又不失灵活
- 使用场景不限于web开发
- 社区庞大活跃, 经常引入紧跟时代的新特性,能为大多数场景找到已有的开源扩展
- 良好的开发体验
### 在开始前,我们需要了解Webpack 的五大核心概念
####  1、入口 `entry` 
- 入口 `entry` 指示Webpack以那个文件为入口起点开始打包,分析构建内部依赖图
```javascript
module.exports = {
  entry: './src/index.js'
};
```
####  2、输出 (output)
- output 属性告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，默认值为`./dist`
```javascript
const path = require('path');
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};
```
#### 3、Loader
- loader 让Webpack能够去处理那些非JavaScript文件（webpack 自身只理解 JavaScript）loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理
#### 4、Plugin
- 插件(Plugin) 可以用于执行范围更广的任务, 插件的范围包括,从打包优化和压缩,一直到重新定义环境中的变量等
#### 5、模式 (mode) 告诉Webpack使用相应的配置
- development  | 会将process.env.NODE_ENV的值设为development | 能让代码把本地调试运行环境
- production 能让代码运行优化上线运行的环境
```javascript
module.exports = {
  mode: 'production',
  <!--mode: 'development'-->
};

```
### 快速上手
现在我们来开始新建一个项目

```javascript
mkdir  webpack-demo
cd webpack-demo

// 目录
// 初始化package.json
yarn init --yes
// 安装webpack, webpack-cli 到devDependencies 开发环境依赖中
yarn webpack webpack-cli --dev
```
目录, 这里的内容可以随便填写


![](https://user-gold-cdn.xitu.io/2020/6/26/172f0840e6700f20?w=700&h=218&f=png&s=12338)
```javascript
// heading.js
export default () => {
  let element = document.createElement('h1');
  element.textContent = 'Hello Webpack';
  element.className = 'title';
  return element
}

// index.js
import createHeading from './heading.js'
const heading = createHeading()
document.body.append(heading)

// index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hello Webpack</title>
</head>
<body>
  <script src="./src/index.js"></script>
</body>
</html>

```
- 执行 `yarn webpack` 命令, 接着我们的根目录下就有一个为dist文件,里面有个`main.js`,然后我们将index.html中的script src属性修改为dist文件,打开就可以直接看到我们创建的一个H1标签了

- 为了每次打包不使用yarn webpack 我们还可以在package.json中配置scripts,这样我们就后面就可以直接执行yarn build就行了
```
<script src="./dist/main.js"></script>
"scripts": {
   "build": "webpack"
},
```
### 打包样式资源
在根目录下创建 `webpack.config.js`
在`src` 目录下创建css文件夹, `index.css, index.less`样式可以随便写

![](https://user-gold-cdn.xitu.io/2020/6/26/172f0bfdc17dd912?w=900&h=110&f=png&s=6196)
```
安装依赖 yarn add style-loader css-loader less-loader --dev`
```
```javascript
// webpack.config.js
// resolve 用来拼接绝对路径的方法
const { resolve } =  require('path')
module.exports = {
  // webpack配置
  // 入口起点
  entry: './src/index.js',
  // 输出
  output: {
    filename: 'bundle.js', // 输出文件名
    // __dirname是node.js的变量,代表当前文件目录绝对路径
    path: resolve(__dirname, 'dist') // 输出路径
  },
  // 详细loader配置
  module: {
    rules: [
      {
        test: /\.css$/, // 匹配css 文件
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
      }
    ]
  },
  // plugins的配置
  plugins: [],
  // 模式
  mode: 'development', // 开发模式
  // mode: 'production',
}
```
执行yarn build命令, 再次运行index.html 可以看到样式资源也被打包到了`bundle.js`, 不过这里我们还是要去手动修改一下index.html的js文件。后面我们会将html一起打包就不需要手动引入了

![](https://user-gold-cdn.xitu.io/2020/6/26/172f0c5ee85d9bdf?w=848&h=233&f=png&s=9640)

### 打包html资源
```javascript
yarn add html-webpack-plugin --dev

// webpack.config.js 头部引入
const HtmlWebpackPlugin = require('html-webpack-plugin')

// 在plugin中使用
plugins: [
  // 默认创建一个空HTML,自动打包输出的所有资源,这里对应index.html文件
  new HtmlWebpackPlugin({
    // 复制 './index.html'文件,并自动打包引入输出所有资源
    template: './index.html'
  })
],
```
执行 yarn build 打包完成后dist目录此时会多出一个index.html文件

### 打包图片资源
```javascript
yarn add url-loader html-loader --dev

// 在src 目录下新建image图片目录

// 添加新的loader在module中
  {
    // 处理图片
    test: /\.(jpg|png|gif)$/,
    loader: 'url-loader',
    options: {
      // 图片大小小于8kb,就会被base64处理
      // 优点: 减少请求数量(减轻服务器压力)
      // 缺点: 图片体积会更大(文件请求速度更慢)
      limit: 10 * 1024,
      esModule: false,
      // 给图片进行命名
      // [hash:10] 取图片前10位
      name: '[hash:10].[ext]',
      outputPath: 'image' // 输出目录
    }
  },
  {
    test: /\.html$/,
    // 处理html文件img图片
    loader: 'html-loader',
  },
  
// 因为url-loader默认是使用es6模块化解析的,而html-loader引入图片是commonjs,
// 解析会出现问题:[object Module],使用commonjs解析
// 关闭url-loader的es6 module esModule: false
```
执行 yarn build

###  打包其他资源(字体图标)
这里我是在阿里矢量图标库下了几个字体图标文件

[阿里矢量图标库](https://www.iconfont.cn/)

```javascript
// src 目录创建font
yarn add file-loader --dev

// index.js 导入iconfont.css
import './font/iconfont.css'

// index.html添加图标
<span class="iconfont icon-caihong"></span>
<span class="iconfont icon-qiwen-diwen"></span>
<span class="iconfont icon-ganzao"></span>
<span class="iconfont icon-rishi-riquanshi"></span
```
![](https://user-gold-cdn.xitu.io/2020/6/26/172f0ea27c117247?w=769&h=164&f=png&s=9392)

执行 yarn build

### Webpack 与ES 2015
 新特性没有被webpack处理,es6转换
 ```javascript
 yarn add babel-loader @babel/core @babel/preset-env --dev
 
  {
    test: /\.js$/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env']
      }
    }
  },
 ```
 执行yarn build  此时箭头函数, const 等属性被转换es5

### 自动清除输出目录插件
在之前打包每次都会留下原来的文件,需要手动删除,加入了这个插件后在打包前每次都会自动清除了
```javascript
yarn add clean-webpack-plugin --dev

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// 使用
plugins: [
  new CleanWebpackPlugin()
],
```
执行yarn build2

### webpack devServer 开发服务器 自动打包
```
yarn add webpack-dev-server --dev
```
#### 在webpack.config.js中配置devServer
```javascript
devServer: {
  contentBase: resolve(__dirname, 'dist'),
  compress: true, // 启动gzip压缩
  port: '3000', // 端口号,
  open: true, // 自动打开浏览器
},
```
####  package.json添加
```javascript
"scripts": {
  "serve": "webpack-dev-server --open --config webpack.config.js",
}
```
#### devServer详细配置
```javascript
devServer: {
  contentBase: resolve(__dirname, 'dist'),
  watchContentBase: true, // 监视contentBase目录下的所有文件,一旦文件变化就会reload
  wacthOptions: {
    ignored: /node_modules/
  },
  compress: true, // 启动gzip压缩
  port: 8020, // 端口
  host: 'loaclhost', 域名
  hot: HMR, // 开启HMR功能
  clientLogLevel: 'none', // 不要显示启动服务器日志信息
  quiet: true, // 除了一些基本期待能够信息以外,其他内容都不要显示
  overlay: false, // 如果出错了,不要全屏提示
  proxy: {}, // 服务器代码 ---> 解决开发环境跨域问题
}
```
> webpack-dev-server只会在内存中编译打包,不会有任何输出

执行 yarn serve 此时就会自动打开浏览器啦,并且会自动编译,自动刷新浏览器,提升开发体验。

### 开发环境配置完整代码
```javascript
// resolve 用来拼接绝对路径的方法
const { resolve } =  require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
  // webpack配置
  // 入口起点
  entry: './src/index.js',
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
  // mode: 'production', // 生产模式
}
```

### 生产环境优化  提取css成单独文件
- css 在打包过程在js文件中, 会导致js文件体积变大, 同时因为是先加载js,才能通过style标签插入到页面中, 会出现闪屏现象,体验不好,所以我们需要优化将css 从js 提取出来,还要对css代码进行压缩
- 样式部分和js代码兼容问题
- 处理好这些可以让我们的代码更快更好更强的运行, 性能会更好,可以保证在各个浏览器平稳运行

```javascript
// 这里我们为了构建生产环境 新建一个文件webpack.prod.js
// 同时在package.json 可以加入
"scripts": {
  "serve": "webpack-dev-server --open --config webpack.config.js",
  "build:prod": "webpack --open --config webpack.prod.js",
  "build": "webpack"
},

yarn add mini-css-extract-plugin --dev

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 我们需要将style-loader 替换成 MiniCssExtractPlugin.loader
rules: [
  {
    test: /\.(css)$/,
    // 使用哪些loader
    use: [
      // use 数组中loader 执行顺序, 从右到左,从下到上一次执行
      // MiniCssExtractPlugin取代style.loader
      // 提取js中的单css 成单独文件
      {
        loader: MiniCssExtractPlugin.loader
      },
      'css-loader', // 将css文件变成commonjs 模块加载到模块中,里面内容是字符串
    ]
  },
  {
    test: /\.(less)$/,
    // 使用哪些loader
    use: [
      // use 数组中loader 执行顺序, 从右到左,从下到上一次执行
      // MiniCssExtractPlugin取代style.loader
      // 提取js中的单css 成单独文件
      {
        loader: MiniCssExtractPlugin.loader
      },
      'css-loader', // 将css文件变成commonjs 模块加载到模块中,里面内容是字符串
      'less-loader'  // 将less文件编译成css 文件
    ]
  }
]

plugins: [
  new MiniCssExtractPlugin({
    filename: 'css/common.css'
  })
]

```

### CSS兼容性处理
- 使用loader 默认配置 postcss-loader
- 修改loader 配置
- 在 package.json 中的browserslist里面的配置,通过配置兼容指定的css 兼容性样式

```javascript
yarn add postcss-loader postcss-preset-env --dev

```
pageage.json加入配置
``` javascript
"borwserslist": {
  "development": [
    "last 1 chrome version",
    "last 1 firefox version",
    "last 1 safari version"
  ],
  "prodection": [
    ">0.2%",
    "not dead",
    "not op_min all"
  ]
},
```
- 修改css-loader配置
```javascript
{
  test: /\.css$/,
  use: [
    // use数组中loader执行顺序,从下到上
    // 创建style标签,将js中的样式资源插入进行
    //  MiniCssExtractPlugin取代style.loader
    {
      loader: MiniCssExtractPlugin.loader
    },
    // 将css 文件变成commonjs模块加载到js中
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins: () => [
          require('postcss-preset-env')()
        ]
      }
    }
  ]
}
```

测试一下,加入transition 打包之后 默认会给我们添加前缀--webkit

```javascript
.container img {
  width: 300px;
  height: 300px;
  transition: width 2s, height 2s, background-color 2s, transform 2s;
  border-radius: 20px;
}
.container img:hover{
  transform: rotate(180deg);
}

```

### 压缩CSS

```javascript
yarn add optimize-css-assets-webpack-plugin --dev
const  OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

// 使用很简单,只需调用new
plugins: [
  // 压缩css
  new OptimizeCssAssetsWebpackPlugin()
]
```

### HTML压缩
```javascript
new HtmlWebpackPlugin({
  template: './src/index.html',
  minify: {
    // 移除空格
    collapseWhitespace: true,
    removeComments: true // 移除注释
  }
}),
```

### JS语法检查ESlint
- ESLint 可以统一 js 的开发规范与风格，一个团队内部的每个人的代码风格都不一样，比如有的人还在用 es5，有的人用 es6+,当查阅或修改别人代码的时候会很难下手，效率不高，最后造成项目难维护，ESLint 则会解决这个痛点
- JS 是松散类型的语言，没有编译的过程。只有运行时才能找到问题，开发时很容易出错
- ESLint 有自己的一套规范，当然，我们也可以自定义规则
- https://eslint.bootcss.com/docs/rules/
```javascript
yarn add eslint eslint-loader --dev
#### parser（指定解析器）

// babel-eslint 解析器是一种使用频率很高的解析器，因为现在很多公司的很多项目目前都使用了es6，为了兼容性考虑基本都使用babel插件对代码进行编译。而用babel编译后的代码使用 babel-eslint 这款解析器可以避免不必要的麻烦

yarn add babel-eslint --dev


// 新建.eslintrc.js

module.exports = {
  "extends": "airbnb-base",
  root: true,
  parserOptions: {
    sourceType: 'module',
  },
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true
  },
  rules: {
    "indent": ["error", 2],  // 代码缩进
    "semi": [1, "always"], // 要求在语句末尾使用分号
    "camelcase": [2, {"properties": "always"}], // 强制属性名称为驼峰风格
    "object-curly-spacing": "never", // 不允许花括号中有空格
    "no-var": '',
    "no-alert": 0 // 禁止使用alert
  }
};

```
接下来我们在webpack.config.js配置loader
```javascript
{
  test: /\.js$/,
  exclude: resolve(__dirname, 'node_modules'),
  enforce: "pre", // 优先执行
  loader: 'eslint-loader',
  options: {
    // 自动修复
    fix: true
  }
}

// 测试一下,写入有问题的代码
var createHeading = function createHeading() {
  let element = document.createElement('h1');
  element.textContent = 'Hello Webpack';
  element.className = 'title';
  return element;
};

let obj = { a: 1}

var no_camelcased = () => {
  console.log('大白菜');
};

var dosomeing = () => {
  // ...
  alert(5)
};

const add = function add(a, b) {
  return a + b
}

export { createHeading, add }
// 

```
执行 yarn serve 然后会提示一系列的ESlint 语法检查, 我们只需将有问题的再次修改就行了
![](https://user-gold-cdn.xitu.io/2020/6/28/172f987a25d04a21?w=904&h=170&f=png&s=27450)

### 开发环境优化 热模块替换 HMR
- 在devServe中配置hot: true 就默认开启热更新了
- 样式文件: 可以开启HMR,在style-loader内部实现了
- js文件: 默认不能使用HMR功能
- 解决: 修改entry入口,将html文件引入
```javascript
// entry: ['./src/js/index.js', './src/index.html']

const webpack = require('webpack')

devServer: {
  hot: true
}

plugins: [
  new webpack.HotModuleReplacementPlugin()
]


// js
if (module.hot) {
  // 一旦module.hot 为true 说明开启了HMR功能
  // 让HMR功能代码生效
  module.hot.accept('./heading', () => {
    console.log('文件更新了');
  });
}
```

### source map
- 开发环境
- source map 是一种提供源代码到构建后代码映射技术 如果后代码出错了,构建后和源代码千差万别,找代码出错位置难, 构建后代码出错了可以追踪源代码的错误,利于我们调试找出出错的原因

```javascript
devtool: 'source-map'
- source-map
  错误代码准确信息和源代码错误位置
- inline-source-map
 错误代码准确信息和源代码错误位置
- hidden
 错误代码错误原因,但是没有错误位置
 不能追踪源代码错误,只能提示到构建够的代码错误位置

- eval-source-map
错误代码准确信息和源代码错误位置
- nosources-source-map
错误代码准确信息但是没有任何源代码信息
- cheap-source-map
错误代码准确信息和源代码错误位置
- cheap-module-source-map
错误代码准确信息和源代码错误位置
内联和外部的区别
1. 外部生成了文件,内联没有
2 内联构建速度极快
开发环境: 速度快,调试更友好
  速度快(eval> inline> cheap)
  eval-cheap-source-map
  eval-source-map
  调试更友好
  source-map 
  cheap-module-source-map
  cheap-source-map
  结论eval-source-map -> eval-cheap-module-source-map
生产环境: 源代码要不要隐藏
 nosources-source-map
 hidden-source-map
内联会让代码体积变大,所以生产不建议
1 source-map
3 hidden-source-map
2 source-map

```

### code split 文件分割
```javascript
entry: {
  // 多入口
  main: './src/js/index.js',
  test: './src/js/test.js'
}
// 输出
output: {
  filename: '[name].[contenthash:10].js', // 输出文件名
  // __dirname是node.js的变量,代表当前文件目录绝对路径
  path: resolve(__dirname, 'build') // 输出路径
},

// 重新打包
// main.67a94b6142.js
// test.9fd198e20a.js
// 缺点 不灵活

```
2 optimization 可以将node_modules中的代码单独打包一个chunk最终输出 自动分析多入口chunk中,有没有公共的文件,如果有会打包成单独一个chunk

```javascript
// 会输出多个js 文件代码
optimization: {
  splitChunks: {
    chunks: 'all'
  }
}


```

