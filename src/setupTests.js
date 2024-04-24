import '@testing-library/jest-dom';

window.scrollTo = (x, y) => {
  document.documentElement.scrollTop = y;
};
