

> 该文将使用Webpack 版本4.43.0, node.js 版本 10.21,将从以下二个部分来使用webpack进行深入使用
- 从简单的使用Webpack到深入
- Webpack的原理
### 一、Webpack 是什么
Webpack 是一种前端构建工具, 一个静态模块打包器(module bunder).
在Webpack看来, 前端所有的资源文件(js/json/css/img/less/...)都会作为模块处理
它将根据模块的依赖关系进行静态分析,打包生成对应的静态资源(bundle)。
### 二、Webpack的优点
- 专注处理模块化的项目,能做到开箱即用,一步到位
- 可通过Plugin扩展,完整好用又不失灵活
- 使用场景不限于web开发
- 社区庞大活跃, 经常引入紧跟时代的新特性,能为大多数场景找到已有的开源扩展
- 良好的开发体验
### 三 、Webpack 的五大核心概念
####  1、入口 Entry
入口 Entry 指示Webpack以那个文件为入口起点开始打包,分析构建内部依赖图
```
module.exports = {
  entry: './src/index.js'
};
```
####  2、输出 (Output)
output 属性告诉 webpack 在哪里输出它所创建的bundles，以及如何命名这些文件，默认值为`./dist`基本上，整个应用程序结构，都会被编译到你指定的输出路径的文件夹中。你可以通过在配置中指定一个 `output` 字段，来配置这些处理过程
```
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
loader 让Webpack能够去处理那些非JavaScript文件（webpack 自身只理解 JavaScript）loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理

```
module: {
  rules: [
    {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    },
  ]
}
```
#### 4、Plugin
Plugin用于扩展Webpack的功能,各种各样的Plugin几乎可以让Webpack做任何与构建相关的事情,Plugin的配置很简单,Plugins配置项接收一个数组,数组里面的每一项都是一个要使用Plugin的实例。
```javascript
// yarn add html-webpack-plugin --dev
const HtmlWebpackPlugin = require('html-webpack-plugin')

plugins: [
  new HtmlWebpackPlugin({
    template: './index.html'
  })
]
```
#### 5、模式 (mode) 告诉Webpack使用相应模式的内置优化
- development 能让代码把本地调试运行环境
- production 能让代码运行优化上线运行的环境
```
module.exports = {
  mode: 'production',
  <!--mode: 'development'-->
};
```
### 四、初始化项目
现在我们来开始新建一个项目
1. 新建文件夹,文件名称随意,编辑器打开该文件夹或通过cmd切换到该该文件夹
2. 初始化pageage.json文件
3. 安装yarn webpack webpack-cli --dev 到开发环境
4. 目录, 这里的内容可以随便填写
```javascript
mkdir  webpack-demo
cd webpack-demo
// 目录
// 初始化package.json
yarn init --yes
// 安装webpack, webpack-cli 到devDependencies 开发环境依赖中
yarn webpack webpack-cli --dev
```
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
5. 执行 `yarn webpack` 命令, 接着我们的根目录下就有一个为dist文件,里面有个main.js,然后我们将index.html中的属性修改为dist文件,打开就可以直接看到我们创建的一个h1标签了
6. 为了每次打包使用方便,我们还可以在package.json中配置scripts,这样我们就后面就可以直接执行`yarn build`就行了
```
<script src="./dist/main.js"></script>
"scripts": {
   "build": "webpack"
},
```
### 五、处理样式文件
处理样式文件我们需要借助loader, 一般常用的loader 有 css-loader less-loader sass-loader

在根目录下创建 `webpack.config.js`在`src` 目录下创建css文件夹, `index.css, index.less`样式可以随便写
![](https://user-gold-cdn.xitu.io/2020/6/26/172f0bfdc17dd912?w=900&h=110&f=png&s=6196)
安装依赖 
```javascript
yarn add style-loader css-loader less-loader --dev
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
        test: /\.(css|less)$/, // 匹配css 文件
        use: [
          'style-loader',
          'css-loader',
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
**这几个loader的作用**
- style-loader 动态创建style标签,将js中的样式资源插入进行
- css-loader  将css 文件变成commonjs模块加载到js中
- less-loader 将less文件编译成css文件

**注意:**
- 这里需要注意use数组中loader执行顺序,它是从下到上, 或者说从右到左
- loader 还有一个参数pre,可以修优先级
- 
**接着我们可以去执行打包**

 执行yarn build命令, 再次运行index.html 可以看到样式资源也被打包到了`bundle.js`, 不过这里我们还是要去手动修改一下index.html的js文件。后面我们会将html一起打包就不需要手动引入了
![](https://user-gold-cdn.xitu.io/2020/6/26/172f0c5ee85d9bdf?w=848&h=233&f=png&s=9640)


### 6、处理HTML资源
- 安装依赖 yarn add html-webpack-plugin --dev
    ```javascript
    // webpack.config.js 头部引入
    const HtmlWebpackPlugin = require('html-webpack-plugin')
    
    // 在plugin中使用
    module.exports = {
      plugins: [
        // 默认创建一个空HTML,自动打包输出的所有资源,这里对应index.html文件
        new HtmlWebpackPlugin({
          // 复制 './index.html'文件,并自动打包引入输出所有资源
          template: './index.html'
        })
      ]
    }
    ```
- 执行 yarn build 打包完成后dist目录此时会多出一个index.html文件

### 7、处理图片资源
 我们在项目开发中,肯定少不了引入本地图片资源,那如何处理图片资源呢,我们还需要用loader去处理它
 可以用 url-loader 或者 file-loader 来处理本地的资源文件
 
```
yarn add url-loader html-loader --dev
```
```javascript
  {
    test: /\.(jpg|png|gif)$/,
    loader: 'url-loader',
    options: {
      // 图片大小小于10kb,就会被base64处理
      // 优点: 减少请求数量(减轻服务器压力)
      // 缺点: 图片体积会更大(文件请求速度更慢)
      limit: 10 * 1024,
      esModule: false,
      name: '[hash:10].[ext]',
      outputPath: 'image'
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
**url-loader的配置**
- limit: 10*1024 即图片大小小于10kb的时候,就会被base64处理,超过10kb的就会被拷贝到dist目录,这里这么做优点是可以减少请求数量(减轻服务器的压力),缺点图片的体积会更大(文件请求速度更慢)
- esmMoule: false 这里是为了解决`<img src="./image/xxx.png" />` 会出现`<img src=[Module Object] />`的问题
- name: '[hash:10].[ext] 给图片重命名,  [hash:10] 取图片前10位
- outputPath: 输出目录

- 执行 yarn build

###  8、处理其他资源(字体图标)
对于字体图片文件我们可以使用url-loader或者file-loader
这里我是在阿里矢量图标库下了几个字体图标文件
```
 yarn add file-loader --dev
```
[阿里矢量图标库](https://www.iconfont.cn/)
```javascript
// src 目录创建font
// index.js 导入iconfont.css
import './font/iconfont.css'

// index.html添加图标
<span class="iconfont icon-caihong"></span>
<span class="iconfont icon-qiwen-diwen"></span>
<span class="iconfont icon-ganzao"></span>
<span class="iconfont icon-rishi-riquanshi"></span
```
![](https://user-gold-cdn.xitu.io/2020/6/26/172f0ea27c117247?w=769&h=164&f=png&s=9392)
### 9、Webpack 与 ES 2015
用来处理ES6语法，将其编译为浏览器可以执行的js语法

由于Webkpack默认就能处理我们的代码中的export 和import,但是并不能转换其他的ES6等新特性,我们需要为js文件配置一个额外的编一些型loader,那最常见最常见的就是babel-loader,由于babael-loader需要额外的依赖于babel核心模块,所以我们需要安装多个模块,以及用于去完成具体 的特性转换插件的集合叫babel/preset-env
 ```
 yarn add babel-loader @babel/core @babel/preset-env --dev
 ```
```javascript
{
  test: /\.js$/,
  exclude: /node_modules/, // 排除 node_modules 目录
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env']
    }
  }
},
```
执行yarn build  此时箭头函数等属性被转换es5

### 10、自动清除dist目录
在之前打包每次都会留下原来的文件,需要手动删除,那么如何能自动删除呢,我们需要加入了这个插件后在打包前每次都会自动清除了
```
yarn add clean-webpack-plugin --dev
```
```javascript
// webpack.config.js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// 使用
plugins: [
  new CleanWebpackPlugin()
],
```
### 11、搭建开发环境

#### Source Map
- Source Map 是一种提供源代码到构建后代码映射技术,如果构建后代码出错了,构建后的代码和源代码千差万别,找代码出错位置难,可读性非常差,
- 而选择了对应的sourc-map之后, 构建后的代码出错了可以追踪源代码的错误,利于我们调试,找出代码出错的原因。
- 解决了源代码和运行代码不一致所所产生的问题
- Webpack支持转换生成的代码输出对应Source Map文件,以方便在浏览器中调试,控制Source Map输出的Webpack配置选项是devtool,他有很多选项
具体可以看这里https://www.webpackjs.com/configuration/devtool/

![image](https://user-gold-cdn.xitu.io/2020/6/28/172fa555f67a3221?w=875&h=790&f=png&s=109005)

#### 选择Source Map
> 对于开发环境
以下选项非常适合开发环境

![image](https://user-gold-cdn.xitu.io/2020/6/28/172fa56cae8c49d7?w=1077&h=374&f=png&s=82467)
> 对于生产环境

![image](https://user-gold-cdn.xitu.io/2020/6/28/172fa5f9f173cea0?w=1212&h=333&f=png&s=57022)

> 开发环境推荐
cheap-module-eval-source-map
- 能够定位到错误代码的准确信息和源代码错误位置, 综合构建速度
> 生产环境推荐
- 源代码要不要隐藏
使用 none 或者 source Map, 不暴露源代码

#### 开发环境完整代码

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
        test: /\.(css|less)$/,
        use: [
          // use数组中loader执行顺序,从下到上
          // 创建style标签,将js中的样式资源插入进行
          'style-loader',
          // 将css 文件变成commonjs模块加载到js中
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
### 12、Webpack devServer
```javascript
yarn add webpack-dev-server --dev
```
- 在webpack.config.js中配置devServer
```javascript
devServer: {
  contentBase: resolve(__dirname, 'dist'),
  compress: true, // 启动gzip压缩
  port: '3000', // 端口号,
  open: true, // 自动打开浏览器
},
```
- package.json添加
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

### 13、 优化  提取css成单独文件
- css 在打包过程在js文件中, 会导致js文件体积变大, 影响加载速度,同时因为是先加载js,才能通过style标签插入到页面中, 会出现闪屏现象,体验不好,所以我们需要优化将css 从js 提取出来,还要对css代码进行压缩
- 样式部分和js代码兼容问题
- 处理好这些可以让我们的代码更快更好更强的运行, 性能会更好,可以保证在各个浏览器平稳运行
首先我们需要抽离CSS所用到的loader
```javascript
yarn add mini-css-extract-plugin --dev
```
```javascript
// 这里我们为了构建生产环境 新建一个文件webpack.prod.js
// 同时在package.json 可以加入
"scripts": {
  "serve": "webpack-dev-server --open --config webpack.config.js",
  "build:prod": "webpack --open --config webpack.prod.js",
  "build": "webpack"
},


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

### 14、 CSS兼容性处理
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

### 15、压缩CSS

```javascript
yarn add optimize-css-assets-webpack-plugin --dev
const  OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

// 使用很简单,只需调用new
plugins: [
  // 压缩css
  new OptimizeCssAssetsWebpackPlugin()
]
```

### 16、HTML压缩
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

### 17、JS语法检查ESlint
- ESLint 可以统一 js 的开发规范与风格，一个团队内部的每个人的代码风格都不一样，比如有的人还在用 es5，有的人用 es6+,当查阅或修改别人代码的时候会很难下手，效率不高，最后造成项目难维护，ESLint 则会解决这个痛点
- JS 是松散类型的语言，没有编译的过程。只有运行时才能找到问题，开发时很容易出错
- ESLint 有自己的一套规范，当然，我们也可以自定义规则
- https://eslint.bootcss.com/docs/rules/
- 安装依赖yarn add eslint eslint-loader babel-eslint --dev
```javascript

// parser（指定解析器）
// babel-eslint 解析器是一种使用频率很高的解析器，因为现在很多公司的很多项目目前都使用了es6,
// 为了兼容性考虑基本都使用babel插件对代码进行编译。而用babel编译后的代码使用 babel-eslint 这款解析器可以避免不必要的麻烦
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
- 接下来我们在webpack.config.js配置loader
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
- 执行 yarn serve 然后会提示一系列的ESlint 语法检查, 我们只需将有问题的再次修改就行了

![](https://user-gold-cdn.xitu.io/2020/6/28/172f987a25d04a21?w=904&h=170&f=png&s=27450)

### 18、Webpack HMR
- 极大的提高了开发者的工作效率
- 全称 Hot Module Replacement
- 自动刷新会导致整个页面状态丢失
- HMR 模块热替换
- 热替换只将修改的模块实时替换至应用中
- 在devServe中配置hot: true 就默认开启热更新了
- 样式文件: 可以开启HMR,在style-loader内部实现了
- js文件: 默认不能使用HMR功能
- 开启HMR webpack-dev-server --hot 也可通过配置文件开启
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
### 19、Code Split 文件分割
1 多入口
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

### 20、不同环境配置
- 配置文件根据环境不同导出不同配置

```javascript
// webpack.common.js
// webpack.dev.js
// webapack.prod.js

// 安装 yarn add wenpack-merge --dev
// yarn webpack --config webpack.prod.js // 生产环境

const common = require('./webpack.common)
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { CopyWebpackPlugin } = require('copy-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  plugins: [

  ]
})
```