module.exports = {
  "extends": "airbnb-base",
  root: true,
  parserOptions: {
    sourceType: 'module',
  },
  parser: 'babel-eslint', // 指定eslint的解析器
  env: {
    browser: true,
    es6: true
  },
  rules: {
    "indent": ["error", 2],  // 代码缩进
    "semi": [1, "always"], // 要求在语句末尾使用分号
    "camelcase": [2, {"properties": "always"}], // 强制属性名称为驼峰风格
    "object-curly-spacing": 2, // 不允许花括号中有空格
    "no-console": "off",
    "no-alert": 0, // 禁止使用alert
  }
};
