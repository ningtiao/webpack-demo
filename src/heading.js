export default () => {
  let element = document.createElement('h1');
  element.textContent = 'Hello Webpack';
  element.className = 'title';
  return element
}
