import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import Notices from './';

const formatMessage = ({ id }) => id;

/**
 * @jest-environment jsdom
 */
test('should render no notices', () => {
  render(
    <Notices notices={[]} setNotices={() => {}} formatMessage={formatMessage} />
  );
  expect(screen.getByRole('rowgroup').children).toHaveLength(1);
});

test('should render single notices', () => {
  render(
    <Notices
      notices={[{ text: 'This a notice' }]}
      setNotices={() => {}}
      formatMessage={formatMessage}
    />
  );
  expect(screen.getByRole('rowgroup').children).toHaveLength(2);
  expect(screen.getAllByDisplayValue('This a notice')).toHaveLength(1);
});

test('should render multiple notices', () => {
  render(
    <Notices
      notices={[{ text: 'This a notice' }, { text: 'This is another notice' }]}
      setNotices={() => {}}
      formatMessage={formatMessage}
    />
  );
  expect(screen.getByRole('rowgroup').children).toHaveLength(3);
  expect(screen.getAllByDisplayValue('This a notice')).toHaveLength(1);
  expect(screen.getAllByDisplayValue('This is another notice')).toHaveLength(1);
});
