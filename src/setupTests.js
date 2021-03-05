import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
window.scrollTo = (x, y) => {
  document.documentElement.scrollTop = y;
};
