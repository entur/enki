import './styles.scss';
import ShortcutCard from './ShortcutCard';
import { Shortcut } from './types';

interface ShortcutPanelProps {
  items: Shortcut[];
}

const ShortcutPanel = ({ items }: ShortcutPanelProps) => {
  return (
    <div className={'shortcut-panel'}>
      {items.map((item) => (
        <ShortcutCard key={item.label} item={item} />
      ))}
    </div>
  );
};

export default ShortcutPanel;
