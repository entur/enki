import { JSX } from 'react';

export interface Shortcut {
  label: string;
  icon?: JSX.Element;
  to: string;
  onClick?: () => void;
  description: string;
}
