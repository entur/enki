import { useEffect, useState } from 'react';
import { getLanguagePickerFlagIcon, type Locale } from 'i18n';

interface FlagIconProps {
  locale: Locale;
  className?: string;
}

const FlagIcon: React.FC<FlagIconProps> = ({ locale, className }) => {
  const [IconComponent, setIconComponent] = useState<React.ComponentType<{
    className?: string;
  }> | null>(null);

  useEffect(() => {
    const loadIcon = async () => {
      try {
        const icon = await getLanguagePickerFlagIcon(locale);
        setIconComponent(() => icon);
      } catch (error) {
        console.warn(`Failed to load flag icon for locale: ${locale}`, error);
      }
    };

    loadIcon();
  }, [locale]);

  if (!IconComponent) {
    return <div className={className} style={{ width: 20, height: 15 }} />;
  }

  return <IconComponent className={className} />;
};

export default FlagIcon;
