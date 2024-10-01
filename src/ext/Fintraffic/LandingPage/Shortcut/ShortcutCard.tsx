import { Shortcut } from './types';
import { Link } from 'react-router-dom';

interface ShortcutCardProps {
  item: Shortcut;
}

const ShortcutCard = ({ item }: ShortcutCardProps) => {
  return (
    <Link
      to={item.to}
      onClick={(event) => {
        if (item.onClick) {
          event.preventDefault();
          item.onClick();
        }
      }}
    >
      <div className={'shortcut-card'}>
        <div className={'shortcut-card__icon'}>{item.icon}</div>
        <div>
          <div className={'shortcut-card__label'}>{item.label}</div>
          <div className={'shortcut-card__description'}>{item.description}</div>
        </div>
      </div>
    </Link>
  );
};

export default ShortcutCard;
