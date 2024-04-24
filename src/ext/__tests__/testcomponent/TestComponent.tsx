import { FC } from 'react';
import { TestComponentProps } from '../index';

export const TestComponent: FC<TestComponentProps> = () => {
  return <h1 data-testid="TestComponentHeader">Hello world</h1>;
};
