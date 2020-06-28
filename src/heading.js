const createHeading = function createHeading() {
  const element = document.createElement('h1');
  element.textContent = 'Hello Webpack';
  element.className = 'title';
  return element;
};

const noCamelCased = () => {
  console.log('大白55菜');
};
noCamelCased();

const doSomething = () => {
  // ...
};

doSomething();
const add = function add(a, b) {
  return a + b;
};

export { createHeading, add };
