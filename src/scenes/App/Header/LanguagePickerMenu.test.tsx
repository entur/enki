import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from 'utils/test-utils';
import LanguagePickerMenu from './LanguagePickerMenu';

// Mock FlagIcon to avoid SVG import issues in tests
vi.mock('components/FlagIcon', () => ({
  default: ({ locale }: any) => (
    <span data-testid={`flag-${locale}`}>{locale}</span>
  ),
}));

// Mock useConfig to provide supportedLocales
vi.mock('config/ConfigContext', () => ({
  useConfig: () => ({
    supportedLocales: ['nb', 'en', 'sv'],
  }),
}));

describe('LanguagePickerMenu', () => {
  it('renders the language picker button', () => {
    render(<LanguagePickerMenu />);
    expect(screen.getByLabelText('Choose language')).toBeInTheDocument();
  });

  it('opens the menu when clicking the button', async () => {
    const user = userEvent.setup();
    render(<LanguagePickerMenu />);
    await user.click(screen.getByLabelText('Choose language'));

    expect(screen.getByText('Norsk')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Svenska')).toBeInTheDocument();
  });

  it('shows a check mark next to the selected locale', async () => {
    const user = userEvent.setup();
    // Default locale in tests is 'en'
    render(<LanguagePickerMenu />);
    await user.click(screen.getByLabelText('Choose language'));

    // The English menu item should be selected
    const englishMenuItem = screen.getByText('English').closest('li');
    expect(englishMenuItem).toHaveClass('Mui-selected');
  });

  it('renders flag icons for each locale', async () => {
    const user = userEvent.setup();
    render(<LanguagePickerMenu />);
    await user.click(screen.getByLabelText('Choose language'));

    expect(screen.getByTestId('flag-nb')).toBeInTheDocument();
    expect(screen.getByTestId('flag-en')).toBeInTheDocument();
    expect(screen.getByTestId('flag-sv')).toBeInTheDocument();
  });

  it('closes the menu when clicking a language option', async () => {
    const user = userEvent.setup();
    render(<LanguagePickerMenu />);
    await user.click(screen.getByLabelText('Choose language'));

    expect(screen.getByText('Norsk')).toBeVisible();
    await user.click(screen.getByText('Norsk'));

    // Menu should close (MUI animates out, so the role=menu should be removed)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
