import { createHeading, add } from './heading';
import './css/index.css';
import './font/iconfont.css';
import './css/index.less';

const heading = createHeading();
document.body.append(heading);
console.log(add(2, 3));

if (module.hot) {
  // 一旦module.hot 为true 说明开启了HMR功能
  // 让HMR功能代码生效
  module.hot.accept('./heading', () => {
    console.log('文件更新了');
  });
}
