const createHeading = () => {
  let element = document.createElement('h1');
  element.textContent = 'Hello Webpack';
  element.className = 'title';
  return element
}

const add = (a, b) => {
  return a + b
}

export {
  createHeading,
  add
}