import { shallow } from 'enzyme';

import Notices from './';

const formatMessage = (id) => id;

describe('Notices', () => {
  it('should render no notices', () => {
    const wrapper = shallow(
      <Notices
        notices={[]}
        setNotices={() => {}}
        formatMessage={formatMessage}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render single notices', () => {
    const wrapper = shallow(
      <Notices
        notices={[{ text: 'This a notice' }]}
        setNotices={() => {}}
        formatMessage={formatMessage}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render multiple notices', () => {
    const wrapper = shallow(
      <Notices
        notices={[
          { text: 'This a notice' },
          { text: 'This is another notice' },
        ]}
        setNotices={() => {}}
        formatMessage={formatMessage}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
