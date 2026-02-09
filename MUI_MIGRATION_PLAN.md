# Material-UI Migration Plan for Enki

**Project:** Enki (Nplan Timetable Editor)
**Design System Migration:** Entur Design System → Material-UI (MUI)
**Date Created:** 2026-02-05
**Status:** Planning Phase

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Prerequisites & Setup](#prerequisites--setup)
3. [Migration Strategy](#migration-strategy)
4. [Phase Breakdown](#phase-breakdown)
5. [Fintraffic Extension Strategy](#fintraffic-extension-strategy)
6. [Testing Strategy](#testing-strategy)
7. [Risk Mitigation](#risk-mitigation)
8. [Package Changes](#package-changes)
9. [Open Questions & Decisions](#open-questions--decisions)
10. [Timeline & Resource Estimates](#timeline--resource-estimates)

---

## Executive Summary

### Scope

This migration involves replacing all Entur Design System components with Material-UI (MUI) equivalents across the Enki codebase. The migration impacts:

- **102 files** using Entur components
- **70 test files** that may reference Entur DOM structure
- **62 SCSS files** using Entur design tokens
- **34 SCSS files** with heavy @entur/tokens usage
- **1,080-line Fintraffic extension** override file requiring theme conversion
- **Component usage breakdown:**
  - Buttons: 67 uses across 28 files
  - Typography: 58+ uses
  - Form inputs: 30+ uses (TextField, TextArea, Checkbox, Radio, Switch)
  - Dropdowns: 17 uses
  - Modals: 9 uses
  - Tables, Alerts, Icons, and other components

### Approach

**Incremental migration** (not big-bang):
- Run both design systems side-by-side during transition
- Migrate component-by-component in dependency order
- Use feature flags for gradual rollout
- Maintain visual consistency through custom MUI theme
- Create wrapper components for smoother migration

### Timeline Overview

**Conservative estimate:** 180-280 developer days (36-56 weeks for 1 developer, 9-14 weeks for 4 developers)

**Recommended approach:** 2-3 developers over 12-16 weeks

---

## Prerequisites & Setup

### 1. MUI Packages to Install

```bash
# Core MUI packages
npm install @mui/material @emotion/react @emotion/styled

# Icons
npm install @mui/icons-material

# Date/Time Pickers
npm install @mui/x-date-pickers

# Date utility library (choose one)
npm install date-fns  # Recommended - modern, tree-shakeable
# OR
npm install dayjs     # Alternative - smaller bundle size
# OR
npm install moment    # Not recommended - large bundle size, immutable issues

# Optional: Data Grid (if using complex tables)
npm install @mui/x-data-grid  # Free version
# OR
npm install @mui/x-data-grid-pro  # Commercial license required
```

### 2. Theme Configuration

Create a new theme file that maps Entur design tokens to MUI:

**Location:** `src/theme/muiTheme.ts`

```tsx
import { createTheme } from '@mui/material/styles';

// Extract Entur design tokens
const enturColors = {
  brandBlue: '#0B78D0',
  brandCoral: '#ED5935',
  brandLavender: '#8555C7',
  validationMint: '#2ECC71',
  validationCanary: '#F9C66B',
  validationSalmon: '#E84855',
  // Add other Entur colors as needed
};

const enturSpacing = 8; // Base spacing unit (8px)

export const theme = createTheme({
  palette: {
    primary: {
      main: enturColors.brandBlue,
      // Add light/dark variants if needed
    },
    secondary: {
      main: enturColors.brandCoral,
    },
    success: {
      main: enturColors.validationMint,
    },
    warning: {
      main: enturColors.validationCanary,
    },
    error: {
      main: enturColors.validationSalmon,
    },
    info: {
      main: enturColors.brandLavender,
    },
  },
  spacing: enturSpacing,
  typography: {
    fontFamily: '"Open Sans", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
    },
    // Map other Entur typography variants
  },
  components: {
    // Component-specific overrides to match Entur styling
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Disable uppercase (if Entur doesn't use it)
          borderRadius: 4,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined', // Standardize on outlined variant
      },
    },
    // Add more component overrides as needed
  },
});
```

### 3. ThemeProvider Setup

Update the main app entry point to include MUI ThemeProvider:

**Location:** `src/index.tsx`

```tsx
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme/muiTheme';

// Existing imports...

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* MUI CSS reset */}
        {/* Existing app structure */}
      </ThemeProvider>
    </React.StrictMode>
  );
}
```

### 4. CSS Baseline & Emotion Setup

**CssBaseline** provides a consistent CSS reset across browsers. It:
- Normalizes CSS across browsers (similar to normalize.css)
- Applies MUI theme defaults
- Removes default margins on body
- Sets box-sizing to border-box

**Emotion** (CSS-in-JS) is automatically set up with `@emotion/react` and `@emotion/styled` packages. No additional configuration needed.

### 5. Strategy for Running Both Design Systems

**Phase 0 Setup (Weeks 1-2):**

1. **Install MUI packages** (as listed above)
2. **Create MUI theme** matching Entur design
3. **Wrap app with ThemeProvider**
4. **Keep Entur packages installed** - don't remove yet
5. **Create wrapper components directory:**

```bash
mkdir -p src/components/mui-wrappers
```

**Example wrapper component** (`src/components/mui-wrappers/Button.tsx`):

```tsx
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

// Wrapper maintains Entur-like API during migration
export const PrimaryButton = (props: MuiButtonProps) => (
  <MuiButton variant="contained" color="primary" {...props} />
);

export const SecondaryButton = (props: MuiButtonProps) => (
  <MuiButton variant="outlined" {...props} />
);

export const SuccessButton = (props: MuiButtonProps) => (
  <MuiButton variant="contained" color="success" {...props} />
);

export const NegativeButton = (props: MuiButtonProps) => (
  <MuiButton variant="contained" color="error" {...props} />
);

export const TertiaryButton = (props: MuiButtonProps) => (
  <MuiButton variant="text" {...props} />
);

export const IconButton = MuiButton; // Re-export MUI IconButton
```

This approach allows:
- Gradual migration file-by-file
- Both design systems coexist during transition
- Wrapper components provide Entur-like API
- Easy rollback if issues arise
- Test both implementations side-by-side

---

## Migration Strategy

### Principles

1. **Incremental, not big-bang** - Migrate component-by-component
2. **Dependency-aware order** - Start with leaf components, move to complex composites
3. **Visual consistency first** - Maintain UI appearance throughout migration
4. **Test continuously** - Run tests after each phase
5. **Feature flag for rollout** - Use flags to gradually enable MUI in production
6. **Document decisions** - Keep team aligned on patterns

### Migration Workflow (Per Component)

1. **Identify** all files using the Entur component
2. **Create wrapper** component (if needed for API compatibility)
3. **Migrate** component usage to MUI
4. **Update tests** to work with MUI DOM structure
5. **Visual regression test** to ensure consistency
6. **Code review** and QA
7. **Deploy** behind feature flag (if applicable)
8. **Monitor** for issues
9. **Move to next component**

### Codemods & Automation Opportunities

**Create codemods for simple replacements:**

```bash
# Install jscodeshift
npm install -g jscodeshift

# Create codemod file: scripts/codemods/button-migration.js
```

**Example codemod for PrimaryButton → Button:**

```js
module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Replace import
  root
    .find(j.ImportDeclaration, {
      source: { value: '@entur/button' }
    })
    .forEach(path => {
      const specifiers = path.value.specifiers.filter(spec =>
        spec.imported.name !== 'PrimaryButton'
      );

      if (specifiers.length === 0) {
        j(path).remove();
      } else {
        path.value.specifiers = specifiers;
      }
    });

  // Add MUI import if needed
  const hasButtonImport = root.find(j.ImportDeclaration, {
    source: { value: '@mui/material' }
  }).length > 0;

  if (!hasButtonImport) {
    root
      .find(j.ImportDeclaration)
      .at(0)
      .insertBefore(
        j.importDeclaration(
          [j.importSpecifier(j.identifier('Button'))],
          j.literal('@mui/material')
        )
      );
  }

  // Replace JSX element
  root
    .find(j.JSXElement, {
      openingElement: { name: { name: 'PrimaryButton' } }
    })
    .forEach(path => {
      path.value.openingElement.name.name = 'Button';
      if (path.value.closingElement) {
        path.value.closingElement.name.name = 'Button';
      }

      // Add variant="contained" prop
      const variantAttr = j.jsxAttribute(
        j.jsxIdentifier('variant'),
        j.stringLiteral('contained')
      );
      path.value.openingElement.attributes.unshift(variantAttr);
    });

  return root.toSource();
};
```

**Run codemod:**

```bash
jscodeshift -t scripts/codemods/button-migration.js src/**/*.tsx
```

**Recommended codemods to create:**

1. `button-migration.js` - Migrate all button components
2. `typography-migration.js` - Migrate Heading/Paragraph to Typography
3. `icon-migration.js` - Update icon imports and names
4. `form-error-migration.js` - Replace `{...getErrorFeedback()}` with MUI props
5. `dropdown-migration.js` - Migrate Dropdown to Select/Autocomplete

**Note:** Codemods handle 70-80% of migration work. Manual review still required for:
- Complex props
- Custom styling
- Edge cases
- Nested component structures

### Search & Replace Patterns

**Useful grep commands for tracking progress:**

```bash
# Find all files with Entur imports
rg "from '@entur/" --type tsx --type ts | wc -l

# Find specific component usage
rg "import.*PrimaryButton.*from '@entur/button'" --count

# Find SCSS files with Entur tokens
rg "@import '@entur/tokens" --type scss

# Find inline error feedback pattern
rg "getErrorFeedback" --type tsx

# Find Dropdown onChange patterns (breaking change)
rg "onChange=.*item\s*=>" --type tsx
```

**Generate migration progress report:**

```bash
# Create script: scripts/migration-progress.sh
#!/bin/bash

echo "=== Entur Component Usage ==="
echo "Buttons: $(rg "from '@entur/button'" -c | awk '{s+=$1} END {print s}')"
echo "Form: $(rg "from '@entur/form'" -c | awk '{s+=$1} END {print s}')"
echo "Dropdown: $(rg "from '@entur/dropdown'" -c | awk '{s+=$1} END {print s}')"
echo "Typography: $(rg "from '@entur/typography'" -c | awk '{s+=$1} END {print s}')"
echo "Modal: $(rg "from '@entur/modal'" -c | awk '{s+=$1} END {print s}')"
echo "Table: $(rg "from '@entur/table'" -c | awk '{s+=$1} END {print s}')"
echo ""
echo "=== SCSS with Entur Tokens ==="
rg "@import '@entur/tokens" --type scss --files-with-matches | wc -l
echo ""
echo "=== Total Files with Entur Imports ==="
rg "from '@entur/" --files-with-matches | wc -l
```

Run after each phase to track progress.

---

## Phase Breakdown

### Phase 0: Foundation (Weeks 1-2)

**Objective:** Set up MUI infrastructure and create theme matching Entur design.

**Tasks:**

1. ✅ Install MUI packages
2. ✅ Create MUI theme with Entur color palette
3. ✅ Set up ThemeProvider in app root
4. ✅ Add CssBaseline for CSS reset
5. ✅ Create wrapper components directory structure
6. ✅ Document theme customization patterns
7. ✅ Set up storybook stories for theme verification (optional)

**Deliverables:**

- `src/theme/muiTheme.ts` - MUI theme configuration
- `src/components/mui-wrappers/` - Directory for wrapper components
- Updated `src/index.tsx` with ThemeProvider
- Documentation: "MUI Theme Guide for Enki"

**Files Affected:** 2-3 files

**Estimated Effort:** 3-5 days (1 developer)

**Risk Level:** LOW

**Acceptance Criteria:**

- MUI ThemeProvider wraps entire app
- Theme colors match Entur brand colors
- CssBaseline applied without visual regressions
- Both Entur and MUI design systems can coexist

---

### Phase 1: Simple Leaf Components (Weeks 3-4)

**Objective:** Migrate simple, standalone components with no dependencies.

#### 1.1 Typography (58+ uses)

**Components to migrate:**

- `Heading1` (14 uses) → `Typography variant="h1"`
- `Heading2` (8 uses) → `Typography variant="h2"`
- `Heading3` (7 uses) → `Typography variant="h3"`
- `Paragraph` (17 uses) → `Typography variant="body1"`
- `SubParagraph` (12 uses) → `Typography variant="body2"`
- `LeadParagraph` → `Typography variant="subtitle1"` or custom variant

**Migration approach:**

```tsx
// Before:
import { Heading1, Paragraph } from '@entur/typography';
<Heading1>Title</Heading1>
<Paragraph>Content</Paragraph>

// After:
import { Typography } from '@mui/material';
<Typography variant="h1">Title</Typography>
<Typography variant="body1">Content</Typography>
```

**Breaking changes:**

- Entur: Dedicated components per variant
- MUI: Single component with `variant` prop
- May need custom variants in theme for LeadParagraph

**Files affected:** ~20 files

**Estimated effort:** 2 days

**Risk level:** LOW

#### 1.2 Icons (20+ uses)

**Migration approach:**

```tsx
// Before:
import { AddIcon, DeleteIcon, EditIcon } from '@entur/icons';

// After:
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
```

**Breaking changes:**

- Icon names may differ (AddIcon → Add)
- Visual style differences
- Size prop syntax may differ

**Files affected:** ~15 files

**Estimated effort:** 1 day (mostly find-and-replace with manual verification)

**Risk level:** LOW

**Note:** Some icons may not have direct MUI equivalents. Use closest match or keep custom SVG icons.

#### 1.3 Alerts (8 uses)

**Components to migrate:**

- `SuccessAlert` → `Alert severity="success"`
- `InfoAlert` → `Alert severity="info"`
- `WarningAlert` → `Alert severity="warning"`
- `ErrorAlert` → `Alert severity="error"`

**Migration approach:**

```tsx
// Before:
import { SuccessAlert } from '@entur/alert';
<SuccessAlert onClose={handleClose}>Success message</SuccessAlert>

// After:
import { Alert } from '@mui/material';
<Alert severity="success" onClose={handleClose}>Success message</Alert>
```

**Files affected:** 5 files

**Estimated effort:** 1 day

**Risk level:** LOW

#### 1.4 Tooltips (4 uses)

**Migration approach:**

```tsx
// Before:
import { Tooltip } from '@entur/tooltip';
<Tooltip content="Tooltip text">
  <button>Hover me</button>
</Tooltip>

// After:
import { Tooltip } from '@mui/material';
<Tooltip title="Tooltip text">
  <button>Hover me</button>
</Tooltip>
```

**Breaking change:** `content` prop → `title` prop

**Files affected:** 3 files

**Estimated effort:** 0.5 day

**Risk level:** LOW

#### 1.5 Chips (6 uses)

**Migration approach:**

```tsx
// Before:
import { Chip } from '@entur/chip';
<Chip onDelete={handleDelete}>Label</Chip>

// After:
import { Chip } from '@mui/material';
<Chip label="Label" onDelete={handleDelete} />
```

**Breaking change:** Label as children → `label` prop

**Files affected:** 4 files

**Estimated effort:** 0.5 day

**Risk level:** LOW

---

**Phase 1 Summary:**

- **Total files affected:** ~47 files
- **Estimated effort:** 5 days (1 developer)
- **Risk level:** LOW
- **Acceptance criteria:**
  - All typography renders correctly with MUI Typography
  - Icons display correctly (visually verify)
  - Alerts function with proper severity colors
  - Tooltips appear on hover
  - Chips render with labels and delete functionality

---

### Phase 2: Form Primitives (Weeks 5-6)

**Objective:** Migrate form input components with validation handling.

#### 2.1 TextField (21 uses)

**Migration approach:**

```tsx
// Before:
import { TextField } from '@entur/form';
<TextField
  label="Name"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  {...getErrorFeedback(errorMsg, isValid, pristine)}
/>

// After:
import { TextField } from '@mui/material';
<TextField
  label="Name"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  error={!isValid && !pristine}
  helperText={!isValid && !pristine ? errorMsg : ''}
  variant="outlined"
/>
```

**Breaking changes:**

- Replace `{...getErrorFeedback()}` with `error` and `helperText` props
- Must specify `variant` prop (recommend "outlined")

**Helper function to ease migration:**

```tsx
// src/helpers/muiFormHelpers.ts
export const getMuiErrorProps = (
  errorMsg: string,
  isValid: boolean,
  pristine: boolean
) => ({
  error: !isValid && !pristine,
  helperText: !isValid && !pristine ? errorMsg : '',
});

// Usage:
<TextField
  label="Name"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  {...getMuiErrorProps(errorMsg, isValid, pristine)}
  variant="outlined"
/>
```

**Files affected:** 14 files

**Estimated effort:** 2 days

**Risk level:** MEDIUM (validation logic must be preserved)

#### 2.2 TextArea (6 uses)

**Migration approach:**

```tsx
// Before:
import { TextArea } from '@entur/form';
<TextArea label="Description" value={value} onChange={onChange} />

// After:
import { TextField } from '@mui/material';
<TextField
  label="Description"
  value={value}
  onChange={onChange}
  multiline
  rows={4}
  variant="outlined"
/>
```

**Note:** TextArea becomes TextField with `multiline` prop.

**Files affected:** 5 files

**Estimated effort:** 1 day

**Risk level:** LOW

#### 2.3 Checkbox (10 uses)

**Migration approach:**

```tsx
// Before:
import { Checkbox } from '@entur/form';
<Checkbox checked={checked} onChange={onChange}>
  Label text
</Checkbox>

// After:
import { Checkbox, FormControlLabel } from '@mui/material';
<FormControlLabel
  control={<Checkbox checked={checked} onChange={onChange} />}
  label="Label text"
/>
```

**Breaking changes:**

- Label as children → wrapped in FormControlLabel
- Must use FormControlLabel for label association

**Files affected:** 8 files

**Estimated effort:** 1 day

**Risk level:** LOW

#### 2.4 Radio (4 uses)

**Migration approach:**

```tsx
// Before:
import { RadioGroup, Radio } from '@entur/form';
<RadioGroup value={value} onChange={onChange}>
  <Radio value="option1">Option 1</Radio>
  <Radio value="option2">Option 2</Radio>
</RadioGroup>

// After:
import { RadioGroup, FormControlLabel, Radio } from '@mui/material';
<RadioGroup value={value} onChange={onChange}>
  <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
  <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
</RadioGroup>
```

**Files affected:** 3 files

**Estimated effort:** 1 day

**Risk level:** LOW

#### 2.5 Switch (5 uses)

**Migration approach:**

```tsx
// Before:
import { Switch } from '@entur/form';
<Switch checked={checked} onChange={onChange}>Label</Switch>

// After:
import { Switch, FormControlLabel } from '@mui/material';
<FormControlLabel
  control={<Switch checked={checked} onChange={onChange} />}
  label="Label"
/>
```

**Files affected:** 4 files

**Estimated effort:** 0.5 day

**Risk level:** LOW

---

**Phase 2 Summary:**

- **Total files affected:** ~34 files
- **Estimated effort:** 5.5 days (1 developer)
- **Risk level:** MEDIUM (validation logic critical)
- **Acceptance criteria:**
  - All form inputs render correctly
  - Validation errors display properly
  - Error messages appear in helperText
  - Labels correctly associated with inputs
  - Form submission works as before
  - Accessibility preserved (ARIA labels, keyboard navigation)

---

### Phase 3: Buttons and Navigation (Weeks 7-8)

**Objective:** Migrate all button variants and navigation components.

#### 3.1 Buttons (67 uses across 28 files)

**Components to migrate:**

- `PrimaryButton` (28 uses) → `Button variant="contained"`
- `SecondaryButton` (28 uses) → `Button variant="outlined"`
- `SuccessButton` (18 uses) → `Button variant="contained" color="success"`
- `NegativeButton` (5 uses) → `Button variant="contained" color="error"`
- `TertiaryButton` (6 uses) → `Button variant="text"`
- `IconButton` (3 uses) → `IconButton` (minimal changes)
- `FloatingButton` (2 uses) → `Fab` or styled `Button`
- `SecondarySquareButton` (2 uses) → `IconButton` with custom styling
- `TertiarySquareButton` (1 use) → `IconButton` with custom styling
- `ButtonGroup` (6 uses) → `ButtonGroup` (minimal changes)

**Migration strategy:**

1. **Create wrapper components** (recommended for smooth migration):

```tsx
// src/components/mui-wrappers/Button.tsx
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

export const PrimaryButton = (props: MuiButtonProps) => (
  <MuiButton variant="contained" color="primary" {...props} />
);

export const SecondaryButton = (props: MuiButtonProps) => (
  <MuiButton variant="outlined" {...props} />
);

export const SuccessButton = (props: MuiButtonProps) => (
  <MuiButton variant="contained" color="success" {...props} />
);

export const NegativeButton = (props: MuiButtonProps) => (
  <MuiButton variant="contained" color="error" {...props} />
);

export const TertiaryButton = (props: MuiButtonProps) => (
  <MuiButton variant="text" {...props} />
);
```

2. **Update imports:**

```tsx
// Before:
import { PrimaryButton, SecondaryButton } from '@entur/button';

// After (using wrappers):
import { PrimaryButton, SecondaryButton } from '@/components/mui-wrappers/Button';

// Or after full migration:
import { Button } from '@mui/material';
```

3. **Handle component polymorphism:**

```tsx
// Before:
<SecondaryButton as={Link} to="/path">Go</SecondaryButton>

// After:
import { Link } from 'react-router-dom';
<SecondaryButton component={Link} to="/path">Go</SecondaryButton>
```

**Breaking change:** `as={Component}` → `component={Component}`

**Special cases:**

- **FloatingButton** - Used for language picker, migrate to styled Button with elevation
- **Square buttons** - Use `sx={{ borderRadius: 1, minWidth: 'auto', aspectRatio: '1' }}`

**Files affected:** 28 files

**Estimated effort:** 4 days

**Risk level:** MEDIUM (high usage, visual consistency critical)

#### 3.2 Navigation (1 use)

**Components to migrate:**

- `NavigationCard` → Build with `Card` + `CardActionArea` + `CardContent`
- `SideNavigation` → Build with `Drawer` + `List` + `ListItem`

**Files affected:** 2 files

**Estimated effort:** 2 days

**Risk level:** MEDIUM (custom implementation required)

---

**Phase 3 Summary:**

- **Total files affected:** ~30 files
- **Estimated effort:** 6 days (1 developer)
- **Risk level:** MEDIUM
- **Acceptance criteria:**
  - All buttons render with correct variant and color
  - Button click handlers work as before
  - Navigation links work correctly (react-router integration)
  - Visual consistency maintained
  - Hover/focus states work correctly
  - NavigationCard and SideNavigation function as before

---

### Phase 4: Layout and Structural Components (Weeks 9-11)

**Objective:** Migrate modal, drawer, accordion, table, and stepper components.

#### 4.1 Modal (9 uses)

**Migration approach:**

```tsx
// Before:
import { Modal } from '@entur/modal';
<Modal
  open={open}
  onDismiss={handleClose}
  title="Modal Title"
  className="modal"
>
  <div>Content</div>
</Modal>

// After:
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
<Dialog open={open} onClose={handleClose} className="modal">
  <DialogTitle>Modal Title</DialogTitle>
  <DialogContent>
    <div>Content</div>
  </DialogContent>
  <DialogActions>
    {/* Action buttons */}
  </DialogActions>
</Dialog>
```

**Breaking changes:**

- Single component → compositional (Dialog + DialogTitle + DialogContent + DialogActions)
- `onDismiss` → `onClose`
- `title` prop → `<DialogTitle>` component

**Files affected:** 7 files

**Estimated effort:** 2 days

**Risk level:** MEDIUM-HIGH (used in critical flows, API change significant)

#### 4.2 Drawer (1 use)

**Migration approach:**

```tsx
// Before:
import { Drawer } from '@entur/drawer';
<Drawer open={open} onClose={handleClose} side="right">
  <div>Drawer content</div>
</Drawer>

// After:
import { Drawer } from '@mui/material';
<Drawer open={open} onClose={handleClose} anchor="right">
  <div>Drawer content</div>
</Drawer>
```

**Breaking change:** `side` prop → `anchor` prop

**Files affected:** 1 file

**Estimated effort:** 0.5 day

**Risk level:** LOW

#### 4.3 Accordion (1 use)

**Migration approach:**

```tsx
// Before:
import { Accordion } from '@entur/accordion';
<Accordion title="Section Title">
  <div>Content</div>
</Accordion>

// After:
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
<Accordion>
  <AccordionSummary expandIcon={<ExpandMore />}>
    Section Title
  </AccordionSummary>
  <AccordionDetails>
    <div>Content</div>
  </AccordionDetails>
</Accordion>
```

**Breaking change:** Single component → compositional

**Files affected:** 1 file

**Estimated effort:** 0.5 day

**Risk level:** LOW

#### 4.4 Tables (15 uses)

**Migration approach:**

```tsx
// Before:
import { Table, HeaderCell, DataCell } from '@entur/table';
<Table>
  <thead>
    <tr>
      <HeaderCell>Header</HeaderCell>
    </tr>
  </thead>
  <tbody>
    <tr>
      <DataCell>Data</DataCell>
    </tr>
  </tbody>
</Table>

// After:
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
<Table>
  <TableHead>
    <TableRow>
      <TableCell>Header</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>Data</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**Breaking changes:**

- `HeaderCell` and `DataCell` → single `TableCell` component
- Use semantic HTML tags (thead/tbody) → MUI wrapper components
- May need custom styling for expanded rows

**Decision needed:** Use MUI Table or MUI DataGrid?

- **MUI Table:** Free, simple, good for basic tables (RECOMMENDED)
- **MUI DataGrid:** Commercial license, advanced features (sorting, filtering, virtualization)

**Recommendation:** Start with MUI Table. If performance issues or advanced features needed, migrate to DataGrid later.

**Files affected:** 10 files

**Estimated effort:** 3 days

**Risk level:** MEDIUM

#### 4.5 Stepper (used in LineEditor, FlexibleLineEditor)

**Critical component** - used in multi-step line editors.

**Migration approach:**

```tsx
// Before:
import { Stepper, Step } from '@entur/stepper';
<Stepper activeStep={activeStep}>
  <Step label="Step 1" />
  <Step label="Step 2" />
  <Step label="Step 3" />
</Stepper>

// After:
import { Stepper, Step, StepLabel } from '@mui/material';
<Stepper activeStep={activeStep}>
  <Step>
    <StepLabel>Step 1</StepLabel>
  </Step>
  <Step>
    <StepLabel>Step 2</StepLabel>
  </Step>
  <Step>
    <StepLabel>Step 3</StepLabel>
  </Step>
</Stepper>
```

**Breaking change:** `label` prop → `<StepLabel>` component

**Files affected:** 2 files (LineEditor, FlexibleLineEditor)

**Estimated effort:** 2 days

**Risk level:** HIGH (critical user flow, extensive testing needed)

---

**Phase 4 Summary:**

- **Total files affected:** ~21 files
- **Estimated effort:** 8 days (1 developer)
- **Risk level:** MEDIUM-HIGH
- **Acceptance criteria:**
  - Modals open/close correctly with proper content
  - Drawer slides in from correct side
  - Accordion expands/collapses correctly
  - Tables render with correct data and styling
  - Stepper navigation works in line editors
  - All interactions (click, keyboard) preserved
  - Visual consistency maintained

---

### Phase 5: Dropdowns and Complex Form Components (Weeks 12-14)

**Objective:** Migrate dropdown components with complex state management.

#### 5.1 Dropdown (17 uses)

**Migration approach:**

```tsx
// Before:
import { Dropdown } from '@entur/dropdown';
<Dropdown
  label="Select option"
  value={selectedItem}
  onChange={(item) => setSelectedItem(item)}
  items={items}
  itemLabel={(item) => item.name}
/>

// After:
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
<FormControl fullWidth>
  <InputLabel>Select option</InputLabel>
  <Select
    value={selectedItem}
    onChange={(event, value) => setSelectedItem(value)}
    label="Select option"
  >
    {items.map((item) => (
      <MenuItem key={item.id} value={item}>
        {item.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>
```

**Breaking changes:**

- `onChange` signature: `onChange(item)` → `onChange(event, value)`
- Must wrap in `FormControl` for label
- Must map items to `MenuItem` components manually
- No `itemLabel` prop - must render in MenuItem

**Files affected:** 12 files

**Estimated effort:** 3 days

**Risk level:** HIGH (API change significant, 17 uses)

#### 5.2 SearchableDropdown (2 uses)

**Migration approach:**

```tsx
// Before:
import { SearchableDropdown } from '@entur/dropdown';
<SearchableDropdown
  label="Search and select"
  value={selectedItem}
  onChange={(item) => setSelectedItem(item)}
  items={items}
  itemLabel={(item) => item.name}
/>

// After:
import { Autocomplete, TextField } from '@mui/material';
<Autocomplete
  value={selectedItem}
  onChange={(event, value) => setSelectedItem(value)}
  options={items}
  getOptionLabel={(item) => item.name}
  renderInput={(params) => <TextField {...params} label="Search and select" />}
/>
```

**Breaking changes:**

- Different component (Autocomplete)
- `items` → `options`
- `itemLabel` → `getOptionLabel`
- Must provide `renderInput` render prop

**Files affected:** 2 files

**Estimated effort:** 1 day

**Risk level:** MEDIUM

#### 5.3 MultiSelectDropdown (if present)

**Migration approach:**

```tsx
// After:
import { Autocomplete, TextField, Checkbox } from '@mui/material';
<Autocomplete
  multiple
  value={selectedItems}
  onChange={(event, value) => setSelectedItems(value)}
  options={items}
  getOptionLabel={(item) => item.name}
  renderOption={(props, option, { selected }) => (
    <li {...props}>
      <Checkbox checked={selected} />
      {option.name}
    </li>
  )}
  renderInput={(params) => <TextField {...params} label="Select multiple" />}
/>
```

**Files affected:** TBD (search codebase for usage)

**Estimated effort:** 1 day

**Risk level:** MEDIUM

---

**Phase 5 Summary:**

- **Total files affected:** ~14 files
- **Estimated effort:** 5 days (1 developer)
- **Risk level:** HIGH (onChange API change significant)
- **Acceptance criteria:**
  - Dropdowns populate with correct items
  - Selection works correctly
  - onChange handlers receive correct value
  - Search functionality works in Autocomplete
  - Multi-select works correctly (if present)
  - Validation errors display correctly
  - Keyboard navigation works (arrow keys, enter, escape)

---

### Phase 6: Complex Editors and Composite Components (Weeks 15-18)

**Objective:** Migrate complex, composite components with multiple dependencies.

**Risk:** HIGH - These are critical business components with complex state and interactions.

#### 6.1 JourneyPatternEditor

**Location:** `src/components/JourneyPatternEditor/`

**Dependencies:**
- Map integration (likely third-party map library)
- Multiple form inputs
- Tables
- Buttons
- Modals

**Complexity:** HIGH - Composite component with map

**Estimated effort:** 5 days

**Risk level:** HIGH

**Migration approach:**

1. Migrate child components first (buttons, inputs, tables)
2. Update layout using MUI Grid or Box
3. Test map integration with MUI theme
4. Verify all interactions (add/remove stops, reorder, etc.)

#### 6.2 StopPointsEditor (3 variants)

**Location:** `src/components/StopPointsEditor/`

**Variants:**
- Generic
- MixedFlexible
- FlexibleAreasOnly

**Dependencies:**
- Form inputs
- Dropdowns
- Tables
- Buttons

**Complexity:** HIGH - Business logic complexity

**Estimated effort:** 4 days

**Risk level:** HIGH

**Migration approach:**

1. Migrate shared base component
2. Migrate each variant
3. Test each variant independently
4. Integration test all variants

#### 6.3 BookingArrangementEditor

**Location:** `src/components/BookingArrangementEditor/`

**Dependencies:**
- Modal
- Contrast HOC wrapper (custom implementation)
- Form inputs

**Complexity:** MEDIUM-HIGH

**Estimated effort:** 2 days

**Risk level:** MEDIUM-HIGH

**Migration approach:**

1. Migrate Modal to Dialog
2. Handle Contrast wrapper (may need custom MUI theme mode)
3. Migrate form inputs
4. Test booking flow end-to-end

#### 6.4 DayTypesEditor

**Location:** `src/components/DayTypesEditor/`

**Dependencies:**
- Date pickers
- Checkboxes
- Tables

**Complexity:** MEDIUM-HIGH

**Estimated effort:** 3 days

**Risk level:** MEDIUM-HIGH

**Migration approach:**

1. Migrate date pickers (MUI X DatePicker)
2. Migrate checkboxes and tables
3. Test day type selection logic
4. Test date range selection

#### 6.5 PassingTimesEditor

**Location:** `src/components/PassingTimesEditor/`

**Dependencies:**
- Time pickers
- Tables
- Form inputs

**Complexity:** MEDIUM

**Estimated effort:** 2 days

**Risk level:** MEDIUM

**Migration approach:**

1. Migrate time pickers (MUI X TimePicker)
2. Migrate tables
3. Test time input and validation
4. Test passing time calculations

#### 6.6 LineEditor (Multi-step form)

**Location:** `src/scenes/LineEditor/`

**Dependencies:**
- Stepper (already migrated in Phase 4)
- All form components
- JourneyPatternEditor
- DayTypesEditor
- PassingTimesEditor

**Complexity:** HIGH - Orchestrates multiple editors

**Estimated effort:** 3 days

**Risk level:** HIGH

**Migration approach:**

1. Verify Stepper migration (from Phase 4)
2. Verify all child editor migrations
3. Test multi-step navigation
4. Test form state persistence between steps
5. Test validation across steps
6. Test final submission

#### 6.7 FlexibleLineEditor (Multi-step form)

**Location:** `src/scenes/FlexibleLineEditor/`

**Dependencies:**
- Stepper
- FlexibleLine-specific components
- BookingArrangementEditor

**Complexity:** HIGH

**Estimated effort:** 3 days

**Risk level:** HIGH

**Migration approach:**

1. Follow same approach as LineEditor
2. Test flexible line-specific features
3. Test booking arrangement integration

---

**Phase 6 Summary:**

- **Total files affected:** ~25 files
- **Estimated effort:** 22 days (1 developer) or 11 days (2 developers)
- **Risk level:** HIGH
- **Acceptance criteria:**
  - All editors render correctly
  - All interactions work (add, edit, delete, reorder)
  - Form validation works
  - Multi-step navigation works
  - Data persistence works
  - Map integration works (JourneyPatternEditor)
  - Date/time pickers work correctly
  - End-to-end editor flows complete successfully
  - No regressions in business logic

**Recommendation:** Dedicate 2 developers to this phase due to complexity and risk.

---

### Phase 7: Date/Time Pickers (Week 19)

**Objective:** Migrate date and time picker components.

**Components to migrate:**

- `DatePicker` (1 use) → `@mui/x-date-pickers/DatePicker`
- `TimePicker` (1 use) → `@mui/x-date-pickers/TimePicker`

**Migration approach:**

```tsx
// Before:
import { DatePicker } from '@entur/datepicker';
<DatePicker
  label="Select date"
  value={selectedDate}
  onChange={handleDateChange}
/>

// After:
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

<LocalizationProvider dateAdapter={AdapterDateFns}>
  <DatePicker
    label="Select date"
    value={selectedDate}
    onChange={handleDateChange}
  />
</LocalizationProvider>
```

**Breaking changes:**

- Must wrap with `LocalizationProvider`
- Must choose date library adapter (DateFns, DayJS, Moment, Luxon)
- Date object handling may differ (Entur CalendarDate vs native Date)

**Recommendation:** Use `date-fns` (modern, tree-shakeable, TypeScript-friendly)

**Files affected:** 2 files (DatePicker and TimePicker likely in DayTypesEditor and PassingTimesEditor, already counted in Phase 6)

**Estimated effort:** 1 day

**Risk level:** LOW (only 1-2 uses)

**Note:** If date/time pickers are only used in editors migrated in Phase 6, this may already be complete. Otherwise, handle separately.

---

**Phase 7 Summary:**

- **Total files affected:** ~2 files
- **Estimated effort:** 1 day (1 developer)
- **Risk level:** LOW
- **Acceptance criteria:**
  - Date picker opens calendar correctly
  - Time picker allows time selection
  - Selected date/time updates state correctly
  - Date/time format matches expected format
  - Localization works (if applicable)

---

### Phase 8: SCSS to MUI Theme Migration (Weeks 20-23)

**Objective:** Convert all SCSS files using Entur tokens to MUI styled-components or sx prop.

**Scope:**

- **62 SCSS files total**
- **34 files** use `@entur/tokens`
- **1 custom SCSS variable** (`$inputHeight: 45px`)
- **No custom mixins**

**Migration strategy:**

1. **Identify token usage patterns:**

```bash
# Extract all token references
rg '\$colors-' src/**/*.scss > token-usage.txt
rg '\$space-' src/**/*.scss >> token-usage.txt
```

2. **Create token mapping reference:**

```tsx
// src/theme/enturTokenMapping.ts
export const enturToMuiTokens = {
  // Colors
  '$colors-brand-blue': 'primary.main',
  '$colors-brand-coral': 'secondary.main',
  '$colors-brand-lavender': 'info.main',
  '$colors-validation-mint': 'success.main',
  '$colors-validation-canary': 'warning.main',
  '$colors-validation-salmon': 'error.main',

  // Spacing (Entur uses 8px base)
  '$space-small': 1, // 8px
  '$space-medium': 2, // 16px
  '$space-large': 3, // 24px
  '$space-extra-large': 4, // 32px
  '$space-extra-large4': 4, // 32px
  '$space-extra-large9': 9, // 72px

  // Custom variables
  '$inputHeight': '45px',
};
```

3. **Choose styling approach:**

**Option A: sx prop (recommended for simplicity)**

```tsx
// Before (SCSS):
.button {
  background-color: $colors-brand-blue;
  padding: $space-extra-large4;
  margin: $space-medium;
}

// After (sx prop):
<Button
  sx={{
    backgroundColor: 'primary.main',
    p: 4,
    m: 2,
  }}
>
  Click me
</Button>
```

**Option B: styled() API (recommended for reusable components)**

```tsx
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(4),
  margin: theme.spacing(2),
}));

<StyledButton>Click me</StyledButton>
```

**Option C: Keep SCSS temporarily and use CSS variables from MUI theme**

```tsx
// In theme:
const theme = createTheme({
  // ... other config
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        :root {
          --mui-primary: ${palette.primary.main};
          --mui-spacing-4: ${spacing(4)};
        }
      `,
    },
  },
});

// In SCSS:
.button {
  background-color: var(--mui-primary);
  padding: var(--mui-spacing-4);
}
```

**Recommendation:** Use **sx prop** for one-off styles, **styled()** for reusable component styles. Avoid Option C (keeping SCSS) for long-term maintainability.

4. **Migration workflow per SCSS file:**

   a. Identify all Entur token references
   b. Map to MUI theme equivalents
   c. Convert SCSS to styled() or sx prop
   d. Remove SCSS file
   e. Update component imports
   f. Visual regression test
   g. Move to next file

5. **Prioritize files by impact:**

   - **High priority:** Global styles, layout styles
   - **Medium priority:** Component-specific styles
   - **Low priority:** One-off custom styles

**Files affected:** 62 SCSS files (34 with tokens)

**Estimated effort:** 15 days (1 developer) - ~4 files per day

**Risk level:** MEDIUM-HIGH (visual regressions possible)

**Acceptance criteria:**

- All SCSS files converted to MUI styling
- Visual consistency maintained
- No broken styles
- Theme tokens used consistently
- Code is maintainable (no hardcoded values)

---

**Phase 8 Summary:**

- **Total files affected:** 62 SCSS files
- **Estimated effort:** 15 days (1 developer)
- **Risk level:** MEDIUM-HIGH
- **Recommendation:** Pair with designer for visual QA

---

### Phase 9: Fintraffic Extension Migration (Weeks 24-25)

**Objective:** Convert Fintraffic 1,080-line CSS override into a MUI theme.

**Background:**

Fintraffic uses a custom extension file (`src/ext/Fintraffic/CustomStyle/styles.scss`) that overrides Entur styles with `--fds-*` CSS variables to rebrand the entire application.

**Migration strategy:**

See [Fintraffic Extension Strategy](#fintraffic-extension-strategy) section below for detailed approach.

**Files affected:** 1 large file + theme configuration

**Estimated effort:** 5 days (1 developer)

**Risk level:** MEDIUM-HIGH (critical for Fintraffic deployment)

**Acceptance criteria:**

- Fintraffic branding maintained
- All color overrides work
- Theme switching works (if multi-tenant)
- Visual consistency verified by Fintraffic stakeholders

---

### Phase 10: Testing & Cleanup (Weeks 26-28)

**Objective:** Comprehensive testing, bug fixes, and removal of Entur packages.

#### 10.1 Test Suite Updates (70 test files)

**Challenge:** Tests may reference Entur DOM structure, class names, or test IDs.

**Migration approach:**

1. **Run test suite:**

```bash
npm test
```

2. **Identify failing tests:**

   - Tests querying by Entur class names (e.g., `.entur-button`)
   - Tests querying by Entur component structure
   - Tests asserting on Entur-specific props

3. **Update test queries:**

```tsx
// Before:
const button = screen.getByRole('button', { name: /submit/i });
expect(button).toHaveClass('entur-button--primary');

// After:
const button = screen.getByRole('button', { name: /submit/i });
expect(button).toHaveClass('MuiButton-containedPrimary'); // Or remove class assertion
```

4. **Update assertions:**

```tsx
// Before:
expect(getByText('Error message')).toBeInTheDocument();

// After:
expect(screen.getByText('Error message')).toBeInTheDocument();
// (May need to query helperText specifically if in FormHelperText)
```

**Files affected:** 70 test files

**Estimated effort:** 8 days (1 developer) - ~9 files per day

**Risk level:** MEDIUM

#### 10.2 Visual Regression Testing

**Approach:**

1. **Capture baseline screenshots** (before migration or from Entur version)
2. **Capture MUI screenshots**
3. **Compare side-by-side**
4. **Fix visual differences**

**Tools:**

- **Storybook + Chromatic** (recommended)
- **Percy** (commercial)
- **BackstopJS** (open source)
- **Manual visual QA**

**Estimated effort:** 3 days (1 developer + designer)

**Risk level:** HIGH (critical for visual consistency)

#### 10.3 End-to-End Testing

**Test critical user flows:**

1. Create new flexible line (full flow)
2. Edit existing flexible line
3. Create service journey
4. Create day types
5. Create export
6. Navigate between pages
7. Form validation
8. Error handling

**Tools:**

- **Playwright** (recommended - already set up if present)
- **Cypress**
- **Manual QA**

**Estimated effort:** 2 days (1 developer + QA)

**Risk level:** HIGH (critical for business logic)

#### 10.4 Accessibility Audit

**Approach:**

1. **Automated testing:**

```bash
npm install --save-dev @axe-core/react
# Or use browser extensions (axe DevTools, Lighthouse)
```

2. **Manual keyboard testing:**

   - Tab through all forms
   - Test all dropdowns with keyboard
   - Test modal focus trap
   - Test navigation with keyboard only

3. **Screen reader testing:**

   - Test with VoiceOver (Mac), NVDA (Windows), or JAWS
   - Verify all interactive elements announced correctly

**Estimated effort:** 2 days (1 developer)

**Risk level:** MEDIUM

#### 10.5 Browser Compatibility Testing

**Test browsers:**

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Estimated effort:** 1 day

**Risk level:** LOW (MUI has good browser support)

#### 10.6 Remove Entur Packages

**After all tests pass:**

```bash
# Remove Entur packages
npm uninstall @entur/button
npm uninstall @entur/form
npm uninstall @entur/dropdown
npm uninstall @entur/typography
npm uninstall @entur/modal
npm uninstall @entur/table
npm uninstall @entur/alert
npm uninstall @entur/tooltip
npm uninstall @entur/chip
npm uninstall @entur/icons
npm uninstall @entur/datepicker
npm uninstall @entur/tokens

# Keep @entur/react-component-toggle (not tied to design system)
# Do NOT remove: @entur/react-component-toggle
```

**Verify no imports remain:**

```bash
rg "from '@entur/(button|form|dropdown|typography|modal|table|alert|tooltip|chip|icons|datepicker|tokens)'" --type tsx --type ts
```

**Files affected:** package.json, package-lock.json

**Estimated effort:** 0.5 day

**Risk level:** LOW

#### 10.7 Bundle Size Analysis

**Compare bundle sizes before/after:**

```bash
npm run build
npm run analyze
```

**Expected:** MUI may have larger bundle size initially, but tree-shaking should help.

**Estimated effort:** 0.5 day

**Risk level:** LOW

#### 10.8 Documentation

**Create migration documentation:**

1. "MUI Component Usage Guide" - team reference
2. "Migration Lessons Learned" - retrospective
3. "MUI Theme Customization Guide" - for future customizations
4. Update AGENTS.md with MUI references

**Estimated effort:** 2 days

**Risk level:** LOW

---

**Phase 10 Summary:**

- **Total files affected:** 70+ test files + documentation
- **Estimated effort:** 19 days (1 developer + QA + designer)
- **Risk level:** HIGH (comprehensive testing critical)
- **Acceptance criteria:**
  - All tests pass
  - Visual consistency verified
  - E2E flows work correctly
  - Accessibility standards met
  - Browser compatibility verified
  - Entur packages removed
  - Bundle size acceptable
  - Documentation complete

---

## Fintraffic Extension Strategy

### Background

Fintraffic uses a 1,080-line SCSS override file (`src/ext/Fintraffic/CustomStyle/styles.scss`) that completely rebrands Enki using CSS variables (`--fds-*`). This overrides every Entur component color, spacing, and style.

### Challenge

The extension system (`@entur/react-component-toggle`) is NOT tied to the design system and will remain. However, the CSS overrides need to be converted to MUI theme overrides.

### Approach

**Convert Fintraffic CSS overrides to a custom MUI theme:**

1. **Extract Fintraffic design tokens:**

   - Parse the 1,080-line SCSS file
   - Extract all `--fds-*` CSS variables
   - Map to color, spacing, typography values

2. **Create Fintraffic MUI theme:**

**Location:** `src/ext/Fintraffic/theme/fintrafficTheme.ts`

```tsx
import { createTheme } from '@mui/material/styles';
import { theme as baseTheme } from '../../../theme/muiTheme'; // Base Entur theme

// Fintraffic color palette
const fintrafficColors = {
  primary: '#003D7A', // Fintraffic blue
  secondary: '#00A1D1', // Fintraffic cyan
  error: '#E30613', // Fintraffic red
  // ... extract all Fintraffic colors
};

export const fintrafficTheme = createTheme({
  ...baseTheme, // Extend base theme
  palette: {
    primary: {
      main: fintrafficColors.primary,
    },
    secondary: {
      main: fintrafficColors.secondary,
    },
    error: {
      main: fintrafficColors.error,
    },
    // Override all palette colors
  },
  typography: {
    // Override typography if Fintraffic uses different fonts
    fontFamily: '"Fintraffic Font", "Open Sans", Arial, sans-serif',
  },
  components: {
    // Component-specific overrides for Fintraffic
    MuiButton: {
      styleOverrides: {
        root: {
          // Fintraffic button overrides
        },
      },
    },
    // ... other component overrides
  },
});
```

3. **Conditional theme application:**

**Update ThemeProvider to select theme based on extension:**

```tsx
// src/index.tsx
import { theme as baseTheme } from './theme/muiTheme';
import { fintrafficTheme } from './ext/Fintraffic/theme/fintrafficTheme';
import config from './config/config';

const getTheme = () => {
  if (config.extPath === 'Fintraffic') {
    return fintrafficTheme;
  }
  return baseTheme;
};

const selectedTheme = getTheme();

// ... in render:
<ThemeProvider theme={selectedTheme}>
  <App />
</ThemeProvider>
```

4. **Remove Fintraffic SCSS file:**

   - After theme is working, delete `src/ext/Fintraffic/CustomStyle/styles.scss`
   - Remove SCSS import from app

5. **Test Fintraffic branding:**

   - Deploy with `extPath: "Fintraffic"` in bootstrap.json
   - Verify all colors match Fintraffic brand
   - Get approval from Fintraffic stakeholders

### Multi-Tenant Theming (If Multiple Extensions)

If there are other extensions beyond Fintraffic:

```tsx
// src/theme/themeRegistry.ts
import { theme as baseTheme } from './muiTheme';
import { fintrafficTheme } from '../ext/Fintraffic/theme/fintrafficTheme';
// Import other extension themes

const themeRegistry = {
  default: baseTheme,
  Fintraffic: fintrafficTheme,
  // Other extensions...
};

export const getTheme = (extPath?: string) => {
  return themeRegistry[extPath || 'default'] || baseTheme;
};
```

### Acceptance Criteria

- Fintraffic deployment uses custom theme
- All Fintraffic colors applied correctly
- No SCSS overrides needed
- Theme switching works (if multi-tenant)
- Fintraffic stakeholders approve visual appearance

---

## Testing Strategy

### Testing Philosophy

**Test continuously, not at the end.** Each phase should include:

1. Unit tests updated
2. Visual regression checks
3. Manual QA of migrated components

### Testing Approach by Phase

#### Phase 0-3 (Foundation & Simple Components)

- **Unit tests:** Update component tests to use MUI components
- **Visual:** Screenshot comparison (before/after)
- **Manual:** Smoke test each component

#### Phase 4-5 (Layout & Forms)

- **Unit tests:** Update tests for new DOM structure (Dialog composition, FormControlLabel wrapping)
- **Integration tests:** Test form submission flows
- **Visual:** Detailed screenshot comparison
- **Manual:** Test all form interactions (keyboard, mouse, validation)

#### Phase 6 (Complex Editors)

- **Unit tests:** Update tests for editor components
- **Integration tests:** Test full editor flows (create, edit, delete)
- **E2E tests:** Test multi-step forms end-to-end
- **Visual:** Extensive screenshot comparison
- **Manual:** Full QA of all editor features

#### Phase 8-9 (Styling & Extensions)

- **Visual regression:** Critical - compare all pages
- **Manual:** Designer review for visual consistency
- **Extension-specific:** Fintraffic stakeholder approval

#### Phase 10 (Final Testing)

- **All tests pass**
- **Visual regression suite**
- **E2E tests for critical flows**
- **Accessibility audit**
- **Browser compatibility**
- **Performance testing**

### Specific Testing Challenges

#### 1. Tests Referencing Entur DOM Structure

**Challenge:** Tests query by Entur class names or component structure.

**Example failing test:**

```tsx
// Before:
const button = container.querySelector('.entur-button--primary');
expect(button).toBeInTheDocument();
```

**Fix:**

```tsx
// After:
const button = screen.getByRole('button', { name: /submit/i });
expect(button).toBeInTheDocument();
// Avoid class name assertions, use role/text queries
```

**Best practice:** Use Testing Library queries by role, label, or text - not by class name.

#### 2. Tests Asserting on Props

**Challenge:** MUI components may expose different props.

**Example:**

```tsx
// Before:
expect(modal).toHaveProp('onDismiss', mockFn);

// After:
expect(dialog).toHaveProp('onClose', mockFn);
```

**Fix:** Update prop names to match MUI API.

#### 3. Tests with Shallow Rendering

**Challenge:** Shallow rendering may not work with MUI composition.

**Example:** Modal → Dialog + DialogTitle + DialogContent requires full render.

**Fix:** Use full render (`render()` instead of `shallow()`).

#### 4. Tests for Dropdown onChange

**Challenge:** onChange signature changed.

**Before:**

```tsx
const mockOnChange = jest.fn();
const dropdown = render(<Dropdown onChange={mockOnChange} items={items} />);
// Select item
expect(mockOnChange).toHaveBeenCalledWith(selectedItem);
```

**After:**

```tsx
const mockOnChange = jest.fn();
const select = render(<Select onChange={mockOnChange}>...</Select>);
// Select item
expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object), selectedItem); // event + value
```

**Fix:** Update assertions to expect (event, value) instead of just value.

### Visual Regression Testing

**Recommended tool:** Storybook + Chromatic

**Setup:**

1. **Install Storybook:**

```bash
npx storybook@latest init
```

2. **Create stories for key components:**

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@mui/material';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'contained',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'outlined',
    children: 'Secondary Button',
  },
};
```

3. **Capture baseline:**

```bash
npm run storybook
# Take screenshots of all stories (or use Chromatic)
```

4. **After migration, compare:**

```bash
npm run storybook
# Compare against baseline
```

**Alternative:** Percy, BackstopJS, or manual screenshots.

### E2E Testing

**Test critical flows:**

1. **Create flexible line flow:**
   - Navigate to flexible lines
   - Click "Create new"
   - Fill in line details (step 1)
   - Add journey pattern (step 2)
   - Add service journeys (step 3)
   - Add day types (step 4)
   - Submit
   - Verify line created

2. **Edit existing line flow:**
   - Navigate to line
   - Click "Edit"
   - Modify details
   - Save
   - Verify changes saved

3. **Create export flow:**
   - Navigate to exports
   - Click "Create export"
   - Select lines
   - Configure options
   - Submit
   - Verify export created

**Tool:** Playwright (if already set up) or Cypress

**Example Playwright test:**

```tsx
import { test, expect } from '@playwright/test';

test('create flexible line', async ({ page }) => {
  await page.goto('/flexible-lines');
  await page.click('button:has-text("Create new")');

  // Step 1: Line details
  await page.fill('input[name="name"]', 'Test Line');
  await page.click('button:has-text("Next")');

  // Step 2: Journey pattern
  // ... fill in journey pattern
  await page.click('button:has-text("Next")');

  // Step 3: Service journeys
  // ... add service journey
  await page.click('button:has-text("Next")');

  // Step 4: Day types
  // ... add day type
  await page.click('button:has-text("Submit")');

  // Verify
  await expect(page.locator('text=Test Line')).toBeVisible();
});
```

### Accessibility Testing

**Automated:**

```bash
npm install --save-dev @axe-core/react

# Or use browser extension: axe DevTools
```

**Manual keyboard testing checklist:**

- [ ] Tab through all form inputs
- [ ] Shift+Tab backwards
- [ ] Enter to submit forms
- [ ] Escape to close modals/dropdowns
- [ ] Arrow keys in dropdowns
- [ ] Space to toggle checkboxes/switches
- [ ] Focus indicators visible

**Screen reader testing checklist:**

- [ ] All buttons have accessible names
- [ ] Form inputs have associated labels
- [ ] Error messages announced
- [ ] Modal focus trap works
- [ ] Dynamic content changes announced

### Rollback Plan

If critical issues arise during migration:

1. **Keep Entur packages installed** during migration (don't uninstall until Phase 10)
2. **Use feature flags** to toggle between Entur/MUI:

```tsx
// Example feature flag approach
const useNewDesignSystem = config.sandboxFeatures?.useMuiComponents ?? false;

const MyComponent = () => {
  if (useNewDesignSystem) {
    return <MuiButton>Click me</MuiButton>;
  }
  return <EnturButton>Click me</EnturButton>;
};
```

3. **Keep wrapper components** that can switch implementation:

```tsx
// src/components/mui-wrappers/Button.tsx
import { Button as MuiButton } from '@mui/material';
import { PrimaryButton as EnturButton } from '@entur/button';
import config from '@/config/config';

export const PrimaryButton = (props: any) => {
  if (config.sandboxFeatures?.useMuiComponents) {
    return <MuiButton variant="contained" color="primary" {...props} />;
  }
  return <EnturButton {...props} />;
};
```

4. **Git strategy:**
   - Each phase in a separate branch
   - Merge to main only after thorough testing
   - Tag releases for easy rollback

5. **Deployment strategy:**
   - Deploy to staging first
   - Test thoroughly in staging
   - Gradual rollout to production (canary deployment)
   - Monitor for errors
   - Rollback if critical issues

---

## Risk Mitigation

### High-Risk Areas

1. **Multi-step line editors (LineEditor, FlexibleLineEditor)**
   - **Mitigation:** Extensive E2E testing, dedicated QA time
   - **Fallback:** Keep Entur Stepper as backup if MUI Stepper has issues

2. **JourneyPatternEditor with map integration**
   - **Mitigation:** Test map library compatibility with MUI early
   - **Fallback:** Isolate map component from MUI theme if conflicts arise

3. **Dropdown onChange API change (17 uses)**
   - **Mitigation:** Create helper function to normalize onChange signature
   - **Fallback:** Wrapper component that converts API

4. **70 test files potentially breaking**
   - **Mitigation:** Update tests incrementally with each phase
   - **Fallback:** Prioritize critical test coverage, mark others as TODO

5. **Visual consistency (especially Fintraffic)**
   - **Mitigation:** Designer review, stakeholder approval checkpoints
   - **Fallback:** CSS-in-JS overrides for specific components

6. **Bundle size increase**
   - **Mitigation:** Tree-shaking, analyze bundle, lazy load MUI components
   - **Fallback:** Code splitting, dynamic imports

### Feature Flags for Gradual Rollout

**Add feature flag to bootstrap.json:**

```json
{
  "sandboxFeatures": {
    "useMuiComponents": false
  }
}
```

**Use in code:**

```tsx
import config from '@/config/config';

const useMui = config.sandboxFeatures?.useMuiComponents ?? false;

const MyComponent = () => {
  if (useMui) {
    return <MuiImplementation />;
  }
  return <EnturImplementation />;
};
```

**Rollout plan:**

1. **Week 1-2:** Dev environment only (`useMuiComponents: true`)
2. **Week 3-4:** Staging environment
3. **Week 5:** Production for internal users (admin feature flag)
4. **Week 6:** Production for all users

### Visual Regression Prevention

**Strategies:**

1. **Baseline screenshots** before migration (Storybook/Chromatic)
2. **Screenshot comparison** after each phase
3. **Designer review** before merging each phase
4. **Stakeholder demos** for major milestones (Phase 4, 6, 9)
5. **Production monitoring** for visual bugs post-deployment

### Performance Monitoring

**Track bundle size:**

```bash
# Before migration:
npm run build
npm run analyze
# Note bundle sizes

# After migration:
npm run build
npm run analyze
# Compare bundle sizes
```

**Acceptable increase:** <20% (MUI is heavier than Entur, but tree-shaking helps)

**Monitor runtime performance:**

- Lighthouse performance score
- First Contentful Paint (FCP)
- Time to Interactive (TTI)
- React DevTools profiler

---

## Package Changes

### Packages to Add

```json
{
  "dependencies": {
    "@mui/material": "^6.3.0",
    "@mui/icons-material": "^6.3.0",
    "@emotion/react": "^11.13.5",
    "@emotion/styled": "^11.13.5",
    "@mui/x-date-pickers": "^7.23.2",
    "date-fns": "^4.1.0"
  }
}
```

**Optional packages:**

```json
{
  "dependencies": {
    "@mui/x-data-grid": "^7.23.2"  // If using DataGrid instead of Table
  }
}
```

### Packages to Remove (After migration complete)

**Remove all Entur UI packages:**

```bash
npm uninstall @entur/button
npm uninstall @entur/form
npm uninstall @entur/dropdown
npm uninstall @entur/typography
npm uninstall @entur/modal
npm uninstall @entur/table
npm uninstall @entur/alert
npm uninstall @entur/tooltip
npm uninstall @entur/chip
npm uninstall @entur/icons
npm uninstall @entur/datepicker
npm uninstall @entur/tokens
npm uninstall @entur/menu
npm uninstall @entur/layout
```

**IMPORTANT: Do NOT remove:**

```json
{
  "dependencies": {
    "@entur/react-component-toggle": "^X.X.X"  // Keep - feature flag system, not design system
  }
}
```

**Explanation:** The `@entur/react-component-toggle` package is a generic feature flag system, NOT tied to the Entur Design System. It works with any React components (Entur, MUI, or custom). Keep this package and continue using it for feature flags.

### Before/After package.json Diff

**Before:**

```json
{
  "dependencies": {
    "@entur/button": "^X.X.X",
    "@entur/form": "^X.X.X",
    "@entur/dropdown": "^X.X.X",
    "@entur/typography": "^X.X.X",
    "@entur/modal": "^X.X.X",
    "@entur/table": "^X.X.X",
    "@entur/alert": "^X.X.X",
    "@entur/tooltip": "^X.X.X",
    "@entur/chip": "^X.X.X",
    "@entur/icons": "^X.X.X",
    "@entur/datepicker": "^X.X.X",
    "@entur/tokens": "^X.X.X",
    "@entur/react-component-toggle": "^X.X.X"
  }
}
```

**After:**

```json
{
  "dependencies": {
    "@mui/material": "^6.3.0",
    "@mui/icons-material": "^6.3.0",
    "@emotion/react": "^11.13.5",
    "@emotion/styled": "^11.13.5",
    "@mui/x-date-pickers": "^7.23.2",
    "date-fns": "^4.1.0",
    "@entur/react-component-toggle": "^X.X.X"  // KEPT - not tied to design system
  }
}
```

---

## Open Questions & Decisions

### Decision 1: Styling Approach

**Question:** Should we use `sx` prop, `styled()` API, or keep SCSS?

**Options:**

1. **sx prop** (inline styling)
   - ✅ Simple, quick to write
   - ✅ Theme-aware
   - ❌ Not reusable across components
   - ❌ Can be verbose for complex styles

2. **styled() API** (CSS-in-JS)
   - ✅ Reusable components
   - ✅ Theme-aware
   - ✅ Co-located with component
   - ✅ Type-safe
   - ❌ More setup

3. **Keep SCSS** (with CSS variables from theme)
   - ✅ Familiar to team
   - ✅ Global styles easy
   - ❌ Not theme-aware
   - ❌ Not co-located
   - ❌ Harder to maintain

**Recommendation:** **Use `sx` prop for one-off styles, `styled()` API for reusable component styles.** Avoid keeping SCSS for component styles (global styles OK).

---

### Decision 2: Table vs DataGrid

**Question:** Should we use MUI Table or MUI DataGrid?

**Options:**

1. **MUI Table** (free)
   - ✅ Free
   - ✅ Simple API
   - ✅ Good for basic tables
   - ❌ No built-in sorting/filtering/pagination
   - ❌ No virtualization
   - ❌ Performance issues with large datasets

2. **MUI DataGrid** (commercial license required for Pro features)
   - ✅ Rich features (sorting, filtering, pagination, virtualization)
   - ✅ Excellent performance
   - ✅ Built-in editing
   - ❌ Commercial license required for Pro/Premium features
   - ❌ Heavier bundle size
   - ❌ Learning curve

**Recommendation:** **Start with MUI Table.** If performance issues or feature requirements arise, migrate to DataGrid later. Most Enki tables are small and don't need DataGrid features.

---

### Decision 3: Date Library for MUI X Date Pickers

**Question:** Which date library should we use with MUI X Date Pickers?

**Options:**

1. **date-fns** (recommended)
   - ✅ Modern, functional API
   - ✅ Tree-shakeable (small bundle size)
   - ✅ TypeScript support
   - ✅ Immutable
   - ✅ Active development

2. **Day.js**
   - ✅ Smallest bundle size
   - ✅ Moment.js-like API
   - ✅ Immutable
   - ❌ Smaller ecosystem

3. **Moment.js**
   - ❌ Large bundle size
   - ❌ Mutable (harder to reason about)
   - ❌ Not tree-shakeable
   - ❌ Maintenance mode

4. **Luxon**
   - ✅ Modern, immutable
   - ✅ Timezone support
   - ❌ Larger bundle than date-fns/dayjs

**Recommendation:** **Use date-fns.** It's modern, tree-shakeable, and TypeScript-friendly.

**Implementation:**

```bash
npm install date-fns @mui/x-date-pickers
```

```tsx
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

<LocalizationProvider dateAdapter={AdapterDateFns}>
  <DatePicker label="Select date" />
</LocalizationProvider>
```

---

### Decision 4: Component Wrapper Strategy

**Question:** Should we create wrapper components to maintain Entur-like API, or migrate directly to MUI API?

**Options:**

1. **Create wrappers** (e.g., `PrimaryButton` wrapping MUI Button)
   - ✅ Easier migration (fewer file changes)
   - ✅ Can switch implementation if needed
   - ✅ Maintains Entur-like API
   - ❌ Extra abstraction layer
   - ❌ Need to maintain wrappers
   - ❌ May obscure MUI capabilities

2. **Migrate directly to MUI API**
   - ✅ No extra abstraction
   - ✅ Full MUI capabilities exposed
   - ✅ Team learns MUI API
   - ❌ More file changes
   - ❌ Harder rollback

**Recommendation:** **Create wrappers during migration, remove after migration complete.** This allows incremental migration and easier rollback if needed. Once migration is stable and team is comfortable with MUI, gradually remove wrappers.

**Phased approach:**

- **Weeks 1-20:** Use wrappers for smooth migration
- **Weeks 21-28:** Remove wrappers, migrate to direct MUI API

---

### Decision 5: Feature Flag Approach

**Question:** Should we use feature flags for gradual MUI rollout?

**Options:**

1. **Use feature flags** (recommended for low-risk rollout)
   - ✅ Gradual rollout
   - ✅ Easy rollback
   - ✅ Can test both implementations
   - ❌ Extra code complexity
   - ❌ Need to maintain both implementations temporarily

2. **No feature flags** (big-bang migration)
   - ✅ Simpler code
   - ✅ Faster migration
   - ❌ Higher risk
   - ❌ Harder rollback

**Recommendation:** **Use feature flags for high-risk components (editors, dropdowns) and gradual production rollout.** Remove flags after migration is stable.

---

### Decision 6: MUI X Licensing

**Question:** Do we need MUI X Pro or Premium licenses?

**MUI X Packages:**

- **@mui/x-date-pickers** - FREE (includes DatePicker, TimePicker)
- **@mui/x-data-grid** - FREE (basic features)
- **@mui/x-data-grid-pro** - COMMERCIAL ($49/month per developer)
- **@mui/x-data-grid-premium** - COMMERCIAL ($99/month per developer)

**Recommendation:** **Start with free packages.** Only purchase Pro/Premium if specific features are needed (e.g., DataGrid row grouping, tree data, Excel export).

For Enki's use case, free packages should be sufficient.

---

### Decision 7: Component Toggle Library

**Question:** Should we keep `@entur/react-component-toggle` or migrate to a different feature flag library?

**Options:**

1. **Keep `@entur/react-component-toggle`**
   - ✅ Already integrated
   - ✅ Works with MUI components (not design-system specific)
   - ✅ No migration needed
   - ❌ Additional Entur dependency

2. **Migrate to third-party library** (GrowthBook, LaunchDarkly, etc.)
   - ✅ More features (A/B testing, remote flags, analytics)
   - ✅ No Entur dependencies
   - ❌ Migration effort
   - ❌ May be overkill for Enki's needs

3. **Custom implementation**
   - ✅ No dependencies
   - ✅ Simple, lightweight
   - ❌ Need to implement and maintain
   - ❌ Fewer features

**Recommendation:** **Keep `@entur/react-component-toggle`.** It's a generic feature flag system (not tied to Entur Design System) and works perfectly with MUI components. No need to migrate unless advanced feature flag features are needed.

---

### Decision 8: Responsive Design Approach

**Question:** MUI has built-in responsive utilities. Should we refactor responsive design?

**Current state:** Only 3 media queries in codebase (minimal responsive design).

**Recommendation:** **Don't refactor responsive design during migration.** Focus on maintaining existing functionality. After migration is complete and stable, consider adding responsive design as a separate initiative using MUI's responsive utilities (`sx` breakpoints, `useMediaQuery` hook).

---

### Decision 9: Testing Strategy Depth

**Question:** How thoroughly should we update tests during migration?

**Options:**

1. **Update all tests to match MUI DOM structure**
   - ✅ Comprehensive test coverage
   - ✅ Catches regressions
   - ❌ Time-consuming (70 test files)
   - ❌ May delay migration

2. **Update critical tests only**
   - ✅ Faster migration
   - ✅ Focus on high-risk areas
   - ❌ Lower test coverage
   - ❌ May miss regressions

3. **Disable failing tests, fix after migration**
   - ✅ Fastest migration
   - ❌ No safety net during migration
   - ❌ Technical debt

**Recommendation:** **Hybrid approach:**

- **Update tests for critical components** (editors, forms, navigation) during migration
- **Mark non-critical tests as TODO** and fix in Phase 10
- **Rely on E2E tests** for critical flows
- **Visual regression testing** to catch UI issues

This balances speed and safety.

---

### Decision 10: Bundle Size Threshold

**Question:** What bundle size increase is acceptable?

**Expected:** MUI is heavier than Entur Design System.

**Recommendations:**

- **<10% increase:** Excellent - proceed
- **10-20% increase:** Acceptable - monitor
- **20-30% increase:** Review - optimize with tree-shaking, code splitting
- **>30% increase:** Concerning - investigate, may need DataGrid alternatives, lazy loading

**Mitigation strategies:**

- Tree-shaking (MUI supports this well)
- Code splitting (lazy load MUI components)
- Analyze bundle with `source-map-explorer`
- Use MUI's `@mui/material` named imports (not default import)

---

## Timeline & Resource Estimates

### Conservative Estimate (Single Developer)

| Phase | Description | Effort (days) | Weeks |
|-------|-------------|---------------|-------|
| 0 | Foundation & Setup | 3-5 | 1-2 |
| 1 | Simple Leaf Components | 5 | 1 |
| 2 | Form Primitives | 5.5 | 1.5 |
| 3 | Buttons & Navigation | 6 | 1.5 |
| 4 | Layout & Structural | 8 | 2 |
| 5 | Dropdowns | 5 | 1 |
| 6 | Complex Editors | 22 | 4.5 |
| 7 | Date/Time Pickers | 1 | 0.5 |
| 8 | SCSS Migration | 15 | 3 |
| 9 | Fintraffic Extension | 5 | 1 |
| 10 | Testing & Cleanup | 19 | 4 |
| **Total** | | **94.5 days** | **21 weeks** |

**Note:** This assumes 5 days/week, 1 developer working full-time on migration.

---

### Recommended Estimate (2-3 Developers)

**Team composition:**

- **1 Lead Developer** - Architecture, complex components, theme
- **1-2 Mid-level Developers** - Component migration, tests
- **0.5 Designer** - Visual QA, Fintraffic branding (part-time)
- **0.5 QA** - Testing, E2E tests (part-time)

**Timeline:** 12-16 weeks

**Phases run in parallel where possible:**

| Weeks | Activities | Team |
|-------|------------|------|
| 1-2 | Phase 0: Foundation | Lead Dev |
| 3-4 | Phase 1 & 2: Simple components + Forms | 2 Devs (parallel) |
| 5-6 | Phase 3 & 4: Buttons + Layout | 2 Devs (parallel) |
| 7-8 | Phase 5: Dropdowns | 1 Dev |
| 8-9 | Phase 8: SCSS Migration (start early) | 1 Dev |
| 9-13 | Phase 6: Complex Editors | 2 Devs (split editors) |
| 13-14 | Phase 7 & 9: Date Pickers + Fintraffic | 1 Dev |
| 14-16 | Phase 10: Testing & Cleanup | Full team |

**Total:** 12-16 weeks with 2-3 developers + part-time designer + QA

---

### Optimistic Estimate (4+ Developers)

**Team composition:**

- **1 Lead Developer**
- **3 Mid-level Developers**
- **1 Designer** (part-time)
- **1 QA** (part-time)

**Timeline:** 9-12 weeks

**Highly parallelized:**

- Multiple phases run concurrently
- Each developer owns specific components
- Daily sync to prevent conflicts

---

### Risk Buffer

**Add 20-30% buffer** for:

- Unexpected issues
- Design revisions
- Testing failures
- Learning curve
- Merge conflicts

**Conservative with buffer:** 21 weeks + 20% = **25 weeks (6 months)** for 1 developer

**Recommended with buffer:** 16 weeks + 20% = **19 weeks (4.5 months)** for 2-3 developers

---

## Success Criteria

### Migration Complete When:

- ✅ All Entur components replaced with MUI
- ✅ All tests passing
- ✅ Visual consistency verified (designer approved)
- ✅ Fintraffic branding working (stakeholder approved)
- ✅ E2E tests passing for critical flows
- ✅ Accessibility audit passed
- ✅ Browser compatibility verified
- ✅ Bundle size acceptable (<20% increase)
- ✅ Entur UI packages removed (except `react-component-toggle`)
- ✅ Documentation updated
- ✅ Production deployment successful
- ✅ No critical bugs in production

---

## Conclusion

This migration is a significant undertaking but achievable with careful planning and execution. The incremental approach, thorough testing, and risk mitigation strategies will ensure a smooth transition from Entur Design System to Material-UI.

**Key Success Factors:**

1. **Incremental migration** - Don't attempt big-bang
2. **Continuous testing** - Test after each phase
3. **Visual consistency** - Designer involvement throughout
4. **Feature flags** - Enable gradual rollout and easy rollback
5. **Team communication** - Daily syncs, clear ownership
6. **Stakeholder involvement** - Regular demos, especially for Fintraffic

**Next Steps:**

1. **Review and approve this plan** with stakeholders
2. **Allocate resources** (developers, designer, QA)
3. **Set up project tracking** (Jira, Linear, etc.)
4. **Begin Phase 0** (Foundation & Setup)
5. **Establish weekly checkpoints** for progress review

---

**Document Version:** 1.0
**Last Updated:** 2026-02-05
**Status:** Awaiting Approval