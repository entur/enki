# Material-UI Component Mapping for Entur Design System Migration

This document provides a comprehensive mapping from Entur design system components to Material-UI (MUI) equivalents for the Enki codebase migration.

## Table of Contents

- [Buttons](#buttons)
- [Form Inputs](#form-inputs)
- [Dropdowns](#dropdowns)
- [Typography](#typography)
- [Icons](#icons)
- [Alerts](#alerts)
- [Modals & Drawers](#modals--drawers)
- [Tables](#tables)
- [Date & Time Pickers](#date--time-pickers)
- [Chips](#chips)
- [Tooltips](#tooltips)
- [Accordion](#accordion)
- [Layout](#layout)
- [Navigation](#navigation)
- [Grid](#grid)
- [Design Tokens](#design-tokens)
- [Feature Flags](#feature-flags)
- [Migration Strategy](#migration-strategy)

---

## Buttons

### PrimaryButton (28 uses)
**Entur:** `@entur/button`
```tsx
import { PrimaryButton } from '@entur/button';
<PrimaryButton onClick={handleClick} disabled={!isValid}>
  {text}
</PrimaryButton>
```

**MUI Equivalent:** `Button` with `variant="contained"`
```tsx
import { Button } from '@mui/material';
<Button variant="contained" onClick={handleClick} disabled={!isValid}>
  {text}
</Button>
```

**Migration Type:** Direct replacement with prop changes
**Key Differences:**
- Entur: No variant prop needed (component name = variant)
- MUI: Must specify `variant="contained"`
- Color: Add `color="primary"` for explicit primary color (default in MUI)
- Styling: MUI uses theme-based colors, may need theme customization

**Migration Notes:**
- MUI Button is more flexible but requires explicit variant
- Consider creating a wrapper component to maintain Entur naming: `const PrimaryButton = (props) => <Button variant="contained" color="primary" {...props} />`

---

### SuccessButton (18 uses)
**Entur:** `@entur/button`
```tsx
import { SuccessButton } from '@entur/button';
<SuccessButton onClick={handleConfirm} disabled={!isValid}>
  {text}
</SuccessButton>
```

**MUI Equivalent:** `Button` with `variant="contained"` and `color="success"`
```tsx
import { Button } from '@mui/material';
<Button variant="contained" color="success" onClick={handleConfirm} disabled={!isValid}>
  {text}
</Button>
```

**Migration Type:** Direct replacement with prop changes
**Key Differences:**
- Entur: Dedicated component for success actions
- MUI: Generic Button with color prop
- Must add `color="success"` explicitly
- Success color defined in MUI theme palette

**Migration Notes:**
- Ensure MUI theme has success color configured: `palette.success.main`
- May need to adjust success color to match Entur design

---

### SecondaryButton (28 uses)
**Entur:** `@entur/button`
```tsx
import { SecondaryButton } from '@entur/button';
<SecondaryButton onClick={handleCancel}>
  {text}
</SecondaryButton>

// With Link
<SecondaryButton as={Link} to="/path">
  <AddIcon />
  {text}
</SecondaryButton>
```

**MUI Equivalent:** `Button` with `variant="outlined"` or `variant="text"`
```tsx
import { Button } from '@mui/material';
// Outlined style (recommended for secondary actions):
<Button variant="outlined" onClick={handleCancel}>
  {text}
</Button>

// With react-router Link
import { Link } from 'react-router-dom';
<Button variant="outlined" component={Link} to="/path">
  <AddIcon />
  {text}
</Button>
```

**Migration Type:** Direct replacement with prop changes
**Key Differences:**
- Entur: `as={Link}` for react-router integration
- MUI: `component={Link}` for component polymorphism
- MUI: Choose between `outlined` or `text` variant based on design
- MUI: Supports `size="small"` prop (same as Entur)

**Migration Notes:**
- Decide on consistent secondary button style (outlined vs text)
- `component` prop works with any component (Link, 'a', custom components)
- Icon + text pattern works the same in MUI

---

### TertiaryButton (6 uses)
**Entur:** `@entur/button`
```tsx
import { TertiaryButton } from '@entur/button';
<TertiaryButton onClick={() => navigate(-1)}>
  <BackArrowIcon />
  {text}
</TertiaryButton>
```

**MUI Equivalent:** `Button` with `variant="text"`
```tsx
import { Button } from '@mui/material';
<Button variant="text" onClick={() => navigate(-1)}>
  <BackArrowIcon />
  {text}
</Button>
```

**Migration Type:** Direct replacement with prop changes
**Key Differences:**
- Entur: Dedicated component for tertiary actions
- MUI: Generic Button with `variant="text"`
- MUI text buttons have minimal styling by default

**Migration Notes:**
- Used for subtle/back navigation actions
- May need custom styling to match Entur tertiary button appearance
- Consider adding `color="inherit"` for neutral coloring

---

### NegativeButton (5 uses)
**Entur:** `@entur/button`
```tsx
import { NegativeButton } from '@entur/button';
<NegativeButton onClick={() => setDeleteDialogOpen(true)}>
  {formatMessage({ id: 'editorDeleteButtonText' })}
</NegativeButton>
```

**MUI Equivalent:** `Button` with `variant="contained"` and `color="error"`
```tsx
import { Button } from '@mui/material';
<Button variant="contained" color="error" onClick={() => setDeleteDialogOpen(true)}>
  {formatMessage({ id: 'editorDeleteButtonText' })}
</Button>
```

**Migration Type:** Direct replacement with prop changes
**Key Differences:**
- Entur: "Negative" terminology
- MUI: "Error" color terminology
- Must add `color="error"` explicitly
- Error color defined in MUI theme palette

**Migration Notes:**
- Used for destructive actions (delete, remove, etc.)
- Ensure MUI theme has error color configured: `palette.error.main`
- May need to adjust error color to match Entur design

---

### Button (5 uses)
**Entur:** `@entur/button`
```tsx
import { Button } from '@entur/button';
<Button onClick={handleClick}>{text}</Button>
```

**MUI Equivalent:** `Button` with default or explicit variant
```tsx
import { Button } from '@mui/material';
<Button onClick={handleClick}>{text}</Button>
// Or explicitly:
<Button variant="text" onClick={handleClick}>{text}</Button>
```

**Migration Type:** Direct replacement
**Key Differences:**
- Entur: Base button component
- MUI: Base button defaults to `variant="text"`
- May need to add explicit variant based on usage context

**Migration Notes:**
- Review each usage to determine appropriate variant
- Generic Button in Entur codebase may have been used with different intents

---

### IconButton (3 uses)
**Entur:** `@entur/button`
```tsx
import { IconButton } from '@entur/button';
<IconButton className="icon-button" onClick={handleDelete}>
  <DeleteIcon />
</IconButton>
```

**MUI Equivalent:** `IconButton`
```tsx
import { IconButton } from '@mui/material';
<IconButton className="icon-button" onClick={handleDelete}>
  <DeleteIcon />
</IconButton>
```

**Migration Type:** Direct replacement
**Key Differences:**
- Very similar API between Entur and MUI
- MUI IconButton has more size and color options

**Migration Notes:**
- Near 1:1 replacement
- MUI IconButton supports `size` prop: "small", "medium", "large"
- Consider adding `aria-label` for accessibility
- Commonly wrapped in Tooltip for user guidance

---

### FloatingButton (2 uses)
**Entur:** `@entur/button`
```tsx
import { FloatingButton } from '@entur/button';
<FloatingButton
  onClick={handleClick}
  aria-label="language picker"
  size="small"
>
  {flagIcon}
  {text}
  {arrowIcon}
</FloatingButton>
```

**MUI Equivalent:** `Fab` (Floating Action Button) or `Button` with custom styling
```tsx
import { Fab } from '@mui/material';
// For true FAB:
<Fab
  onClick={handleClick}
  aria-label="language picker"
  size="small"
  variant="extended" // For icon + text
>
  {flagIcon}
  {text}
  {arrowIcon}
</Fab>

// Or Button with elevation:
import { Button } from '@mui/material';
<Button
  onClick={handleClick}
  aria-label="language picker"
  size="small"
  sx={{ boxShadow: 2 }}
>
  {flagIcon}
  {text}
  {arrowIcon}
</Button>
```

**Migration Type:** Needs adaptation
**Key Differences:**
- Entur: FloatingButton is versatile (icons + text)
- MUI Fab: Primarily for icon-only actions, extended variant for text
- MUI Fab has circular shape by default
- May need custom Button with elevation instead

**Migration Notes:**
- Check usage context (language picker, etc.)
- If used as dropdown trigger, consider `Button` with custom styling
- Fab is best for persistent floating actions (add, create)
- Language picker example may be better as styled Button

---

### SecondarySquareButton (2 uses)
**Entur:** `@entur/button`
```tsx
import { SecondarySquareButton } from '@entur/button';
<SecondarySquareButton onClick={handleAdd}>
  <AddIcon />
</SecondarySquareButton>
```

**MUI Equivalent:** `IconButton` with `variant="outlined"` or custom Button
```tsx
import { IconButton } from '@mui/material';
<IconButton onClick={handleAdd} color="primary" sx={{ borderRadius: 1 }}>
  <AddIcon />
</IconButton>

// Or Button with square shape:
import { Button } from '@mui/material';
<Button
  variant="outlined"
  onClick={handleAdd}
  sx={{ minWidth: 'auto', aspectRatio: '1', p: 1, borderRadius: 1 }}
>
  <AddIcon />
</Button>
```

**Migration Type:** Needs adaptation
**Key Differences:**
- Entur: Square-shaped secondary button for icons
- MUI: No dedicated square button component
- Need custom styling for square aspect ratio

**Migration Notes:**
- Used for add actions with icon only
- Consider creating wrapper component for consistency
- `sx` prop for custom styling: `{ minWidth: 'auto', aspectRatio: '1', p: 1, borderRadius: 1 }`

---

### TertiarySquareButton (1 use)
**Entur:** `@entur/button`
```tsx
import { TertiarySquareButton } from '@entur/button';
<TertiarySquareButton onClick={handleAction}>
  <Icon />
</TertiarySquareButton>
```

**MUI Equivalent:** `IconButton` with `variant="text"` or custom styling
```tsx
import { IconButton } from '@mui/material';
<IconButton onClick={handleAction} sx={{ borderRadius: 1 }}>
  <Icon />
</IconButton>
```

**Migration Type:** Needs adaptation
**Key Differences:**
- Entur: Square tertiary button
- MUI: No dedicated tertiary square button
- IconButton is circular by default

**Migration Notes:**
- Only 1 use, may not need dedicated wrapper
- Use `sx={{ borderRadius: 1 }}` for square corners

---

### ButtonGroup (6 uses)
**Entur:** `@entur/button`
```tsx
import { ButtonGroup } from '@entur/button';
<ButtonGroup>
  <PrimaryButton>Option 1</PrimaryButton>
  <SecondaryButton>Option 2</SecondaryButton>
</ButtonGroup>
```

**MUI Equivalent:** `ButtonGroup`
```tsx
import { ButtonGroup, Button } from '@mui/material';
<ButtonGroup>
  <Button variant="contained">Option 1</Button>
  <Button variant="outlined">Option 2</Button>
</ButtonGroup>
```

**Migration Type:** Direct replacement
**Key Differences:**
- Very similar API
- MUI ButtonGroup has more variants and orientation options

**Migration Notes:**
- MUI ButtonGroup supports `variant` prop for all children
- Supports `orientation` prop: "horizontal" (default) or "vertical"
- Supports `size` prop: "small", "medium", "large"
- Children should be MUI Button components

---

## Form Inputs

### TextField (21 uses)
**Entur:** `@entur/form`
```tsx
import { TextField } from '@entur/form';
<TextField
  label="Name"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  {...getErrorFeedback(errorMsg, isValid, pristine)}
/>
```

**MUI Equivalent:** `TextField`
```tsx
import { TextField } from '@mui/material';
<TextField
  label="Name"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  error={!isValid && !pristine}
  helperText={!isValid && !pristine ? errorMsg : ''}
  variant="outlined" // or "filled" or "standard"
/>
```

**Migration Type:** Direct replacement with error handling changes
**Key Differences:**
- Entur: Uses spread `{...getErrorFeedback()}` for validation
- MUI: Uses `error` (boolean) and `helperText` (string) props
- MUI: Must specify `variant` prop (default is "outlined")
- Entur: Validation feedback helper pattern
- MUI: Direct prop-based validation

**Migration Notes:**
- Replace `getErrorFeedback()` helper with direct `error` and `helperText` props
- Create helper function to convert validation state to MUI props:
  ```tsx
  const getMuiErrorProps = (errorMsg: string, isValid: boolean, pristine: boolean) => ({
    error: !isValid && !pristine,
    helperText: !isValid && !pristine ? errorMsg : ''
  });
  ```
- MUI TextField is highly configurable with variants, sizes, and input adornments
- Consider standardizing on one variant across the app (recommended: "outlined")

---

### TextArea (6 uses)
**Entur:** `@entur/form`
```tsx
import { TextArea } from '@entur/form';
<TextArea
  label="Description"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  labelTooltip="Tooltip text"
/>
```

**MUI Equivalent:** `TextField` with `multiline` prop
```tsx
import { TextField } from '@mui/material';
<TextField
  label="Description"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  multiline
  rows={4}
  variant="outlined"
/>
// For label tooltip, wrap label in custom component:
<TextField
  label={
    <Box component="span">
      Description
      <Tooltip title="Tooltip text">
        <IconButton size="small"><HelpIcon fontSize="small" /></IconButton>
      </Tooltip>
    </Box>
  }
  // ...other props
/>
```

**Migration Type:** Direct replacement with prop changes
**Key Differences:**
- Entur: Dedicated `TextArea` component
- MUI: `TextField` with `multiline` prop
- Entur: `labelTooltip` prop for built-in tooltip
- MUI: No built-in label tooltip, needs custom label component
- MUI: `rows` prop to control default height
- MUI: `minRows` and `maxRows` for auto-growing textarea

**Migration Notes:**
- All TextArea instances become `<TextField multiline />`
- Add `rows={4}` or appropriate default height
- For `labelTooltip`, create reusable label component with help icon
- Consider creating wrapper component: `<TextAreaField labelTooltip={...} />`

---

### Checkbox (6 uses)
**Entur:** `@entur/form`
```tsx
import { Checkbox } from '@entur/form';
<Checkbox
  value="1"
  checked={isChecked}
  onChange={(e) => setChecked(e.target.checked)}
  disabled={isDisabled}
>
  Label text
</Checkbox>
```

**MUI Equivalent:** `FormControlLabel` + `Checkbox`
```tsx
import { FormControlLabel, Checkbox } from '@mui/material';
<FormControlLabel
  control={
    <Checkbox
      checked={isChecked}
      onChange={(e) => setChecked(e.target.checked)}
      disabled={isDisabled}
    />
  }
  label="Label text"
/>
```

**Migration Type:** Structural change required
**Key Differences:**
- Entur: Label as children of Checkbox
- MUI: Checkbox wrapped in FormControlLabel
- Entur: `value` prop required
- MUI: `value` prop optional (used in CheckboxGroup)
- MUI: More verbose but more flexible

**Migration Notes:**
- Major structural change: label moves from children to FormControlLabel
- Remove `value` prop if not needed (not used for single checkboxes)
- MUI Checkbox supports `indeterminate` prop (for "select all" states)
- Consider creating wrapper to maintain Entur API:
  ```tsx
  const CheckboxField = ({ value, children, ...props }) => (
    <FormControlLabel
      control={<Checkbox {...props} />}
      label={children}
    />
  );
  ```

---

### Radio & RadioGroup (4 uses)
**Entur:** `@entur/form`
```tsx
import { Radio, RadioGroup } from '@entur/form';
<RadioGroup
  name="booking-limit-type"
  label="Select Type"
  onChange={(e) => setValue(e.target.value)}
  value={value}
>
  <Radio value="none">None</Radio>
  <Radio value="time">Time</Radio>
  <Radio value="period">Period</Radio>
</RadioGroup>
```

**MUI Equivalent:** `FormControl` + `FormLabel` + `RadioGroup` + `FormControlLabel` + `Radio`
```tsx
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';

<FormControl>
  <FormLabel>Select Type</FormLabel>
  <RadioGroup
    name="booking-limit-type"
    value={value}
    onChange={(e) => setValue(e.target.value)}
  >
    <FormControlLabel value="none" control={<Radio />} label="None" />
    <FormControlLabel value="time" control={<Radio />} label="Time" />
    <FormControlLabel value="period" control={<Radio />} label="Period" />
  </RadioGroup>
</FormControl>
```

**Migration Type:** Structural change required
**Key Differences:**
- Entur: RadioGroup has `label` prop
- MUI: Requires separate FormControl + FormLabel
- Entur: Radio label as children
- MUI: Radio wrapped in FormControlLabel with label prop
- MUI: More nesting but more control over layout

**Migration Notes:**
- Significant structural change required
- Move RadioGroup label to FormLabel
- Wrap each Radio in FormControlLabel
- Move Radio children to FormControlLabel label prop
- Consider creating wrapper component to maintain Entur API

---

### Switch (2 uses)
**Entur:** `@entur/form`
```tsx
import { Switch } from '@entur/form';
<Switch
  checked={isAvailable}
  onChange={(e) => setAvailable(e.target.checked)}
/>
```

**MUI Equivalent:** `Switch` or `FormControlLabel` + `Switch`
```tsx
import { Switch } from '@mui/material';
// Standalone:
<Switch
  checked={isAvailable}
  onChange={(e) => setAvailable(e.target.checked)}
/>

// With label:
import { FormControlLabel, Switch } from '@mui/material';
<FormControlLabel
  control={
    <Switch
      checked={isAvailable}
      onChange={(e) => setAvailable(e.target.checked)}
    />
  }
  label="Available"
/>
```

**Migration Type:** Direct replacement (or with FormControlLabel for labels)
**Key Differences:**
- Nearly identical API
- MUI Switch has more styling options

**Migration Notes:**
- Near 1:1 replacement
- If label needed, wrap in FormControlLabel
- MUI Switch supports `size` prop: "small", "medium"
- MUI Switch supports `color` prop

---

### FeedbackText (4 uses)
**Entur:** `@entur/form`
```tsx
import { FeedbackText } from '@entur/form';
<FeedbackText variant="error">
  {errorMessage}
</FeedbackText>
```

**MUI Equivalent:** `FormHelperText` or `Typography` with color
```tsx
import { FormHelperText } from '@mui/material';
<FormHelperText error>
  {errorMessage}
</FormHelperText>

// Or Typography:
import { Typography } from '@mui/material';
<Typography variant="caption" color="error">
  {errorMessage}
</Typography>
```

**Migration Type:** Direct replacement with component change
**Key Differences:**
- Entur: Dedicated FeedbackText component with variant prop
- MUI: FormHelperText with error prop, or Typography with color
- Entur: `variant` prop (likely "error", "success", etc.)
- MUI FormHelperText: `error` prop (boolean)
- MUI Typography: `color` prop (more flexible)

**Migration Notes:**
- Use FormHelperText when feedback is for form fields
- Use Typography for standalone feedback messages
- Map Entur variants to MUI props:
  - `variant="error"` → `error={true}` or `color="error"`
  - `variant="success"` → `color="success"`
- FormHelperText automatically positions under form controls

---

### Fieldset (1 use)
**Entur:** `@entur/form`
```tsx
import { Fieldset } from '@entur/form';
<Fieldset label="Booking Method">
  <div className="filter-chip-list">
    {/* FilterChips */}
  </div>
</Fieldset>
```

**MUI Equivalent:** `FormControl` + `FormLabel` or `FormGroup`
```tsx
import { FormControl, FormLabel, FormGroup } from '@mui/material';
<FormControl component="fieldset">
  <FormLabel component="legend">Booking Method</FormLabel>
  <FormGroup>
    <div className="filter-chip-list">
      {/* Chips */}
    </div>
  </FormGroup>
</FormControl>
```

**Migration Type:** Structural change required
**Key Differences:**
- Entur: Simple Fieldset component with label prop
- MUI: Requires FormControl + FormLabel + FormGroup composition
- MUI: More semantic HTML (actual fieldset/legend)

**Migration Notes:**
- Only 1 use, straightforward replacement
- FormControl with `component="fieldset"` creates semantic fieldset
- FormLabel with `component="legend"` creates semantic legend
- FormGroup for grouping related controls

---

### VariantType (3 uses)
**Entur:** `@entur/form`
```tsx
import { VariantType } from '@entur/form';
const variant: VariantType = 'error';
```

**MUI Equivalent:** Custom type or MUI color types
```tsx
// Custom type:
type FeedbackVariant = 'error' | 'warning' | 'info' | 'success';

// Or use MUI's built-in types:
import { AlertColor } from '@mui/material';
const variant: AlertColor = 'error';
```

**Migration Type:** Type definition change
**Key Differences:**
- Entur: Form-specific variant type
- MUI: AlertColor type covers similar use cases

**Migration Notes:**
- VariantType is likely a TypeScript type definition
- Map to MUI's AlertColor: 'error' | 'info' | 'success' | 'warning'
- Or create custom type if needed
- Check actual Entur VariantType definition for complete mapping

---

## Dropdowns

### Dropdown (15 uses)
**Entur:** `@entur/dropdown`
```tsx
import { Dropdown, NormalizedDropdownItemType } from '@entur/dropdown';
<Dropdown
  label="Select Authority"
  selectedItem={{ value: 'id1', label: 'Name 1' }}
  items={() => [
    { value: 'id1', label: 'Name 1' },
    { value: 'id2', label: 'Name 2' }
  ]}
  placeholder="Select..."
  clearable
  labelClearSelectedItem="Clear"
  noMatchesText="No matches"
  onChange={(item) => handleChange(item?.value)}
  {...errorFeedback}
/>
```

**MUI Equivalent:** `Autocomplete` (recommended) or `Select`
```tsx
import { Autocomplete, TextField } from '@mui/material';

// Autocomplete (recommended for complex dropdowns):
<Autocomplete
  options={[
    { value: 'id1', label: 'Name 1' },
    { value: 'id2', label: 'Name 2' }
  ]}
  value={{ value: 'id1', label: 'Name 1' }}
  onChange={(event, newValue) => handleChange(newValue?.value)}
  getOptionLabel={(option) => option.label}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Select Authority"
      placeholder="Select..."
      error={!isValid && !pristine}
      helperText={!isValid && !pristine ? errorMsg : ''}
    />
  )}
  clearText="Clear"
  noOptionsText="No matches"
/>

// Select (simpler but less flexible):
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
<FormControl>
  <InputLabel>Select Authority</InputLabel>
  <Select
    value="id1"
    onChange={(e) => handleChange(e.target.value)}
    label="Select Authority"
  >
    <MenuItem value="id1">Name 1</MenuItem>
    <MenuItem value="id2">Name 2</MenuItem>
  </Select>
</FormControl>
```

**Migration Type:** Needs significant adaptation
**Key Differences:**
- Entur: Single Dropdown component with item objects
- MUI Autocomplete: More complex but powerful (search, async, custom rendering)
- MUI Select: Simpler but less flexible (no search, no clearable by default)
- Entur: `items` is function returning array
- MUI Autocomplete: `options` is array (not function)
- Entur: `selectedItem` is object
- MUI Autocomplete: `value` is object
- MUI Select: `value` is primitive (string/number)
- Entur: `clearable` prop for clear button
- MUI Autocomplete: Clear button included by default, disable with `disableClearable`
- MUI Select: No built-in clear functionality

**Migration Notes:**
- **Recommended approach: Use Autocomplete**
  - More feature-rich and closer to Entur Dropdown
  - Built-in search/filter functionality
  - Built-in clear button
  - Better for complex dropdowns with many options
- **Alternative: Use Select for simple dropdowns**
  - Less setup for basic use cases
  - Better for small, static lists
- Major API differences require careful migration
- Create wrapper component to maintain Entur API:
  ```tsx
  interface DropdownProps {
    label: string;
    selectedItem: { value: string; label: string } | null;
    items: () => { value: string; label: string }[];
    onChange: (item?: { value: string; label: string }) => void;
    placeholder?: string;
    clearable?: boolean;
    // ... other props
  }

  const DropdownField = ({
    items,
    selectedItem,
    onChange,
    clearable = false,
    ...props
  }: DropdownProps) => (
    <Autocomplete
      options={items()}
      value={selectedItem}
      onChange={(_, value) => onChange(value || undefined)}
      getOptionLabel={(option) => option.label}
      disableClearable={!clearable}
      renderInput={(params) => <TextField {...params} {...props} />}
    />
  );
  ```
- Helper functions (`mapToItems`, `getEnumInit`, `mapEnumToItems`) will still work with MUI

---

### NormalizedDropdownItemType (6 uses)
**Entur:** `@entur/dropdown`
```tsx
import { NormalizedDropdownItemType } from '@entur/dropdown';
const item: NormalizedDropdownItemType = { value: 'id', label: 'Name' };
```

**MUI Equivalent:** Custom type definition
```tsx
// Define custom type:
interface DropdownOption {
  value: string;
  label: string;
}

// Or use generic autocomplete option:
import { AutocompleteValue } from '@mui/material';
```

**Migration Type:** Type definition change
**Key Differences:**
- Entur: Specific type for dropdown items
- MUI: No equivalent built-in type, use custom interface

**Migration Notes:**
- Create custom `DropdownOption` interface
- Use throughout codebase for consistency
- Can extend with additional properties if needed
- Existing helper functions (`mapToItems`, etc.) can use this type

---

### SearchableDropdown (1 use)
**Entur:** `@entur/dropdown`
```tsx
import { SearchableDropdown } from '@entur/dropdown';
<SearchableDropdown
  label="Select Operator"
  selectedItem={selectedOperator}
  items={operatorItems}
  onChange={handleOperatorChange}
/>
```

**MUI Equivalent:** `Autocomplete`
```tsx
import { Autocomplete, TextField } from '@mui/material';
<Autocomplete
  options={operatorItems()}
  value={selectedOperator}
  onChange={(event, newValue) => handleOperatorChange(newValue)}
  getOptionLabel={(option) => option.label}
  renderInput={(params) => (
    <TextField {...params} label="Select Operator" />
  )}
/>
```

**Migration Type:** Direct replacement (Autocomplete is searchable by default)
**Key Differences:**
- Entur: Dedicated SearchableDropdown component
- MUI: Autocomplete has search built-in (no separate component)
- MUI Autocomplete has more advanced filtering options

**Migration Notes:**
- Only 1 use, straightforward replacement
- Autocomplete automatically handles search/filter
- Can customize filtering with `filterOptions` prop
- No need for separate searchable component in MUI

---

### MultiSelect (1 use)
**Entur:** `@entur/dropdown`
```tsx
import { MultiSelect } from '@entur/dropdown';
<MultiSelect
  label="Select Day Types"
  items={() => dayTypes.map(dt => ({
    label: dt.name,
    value: dt.id
  }))}
  selectedItems={selectedDayTypes.map(dt => ({
    label: dt.name,
    value: dt.id
  }))}
  onChange={(items) => handleChange(items.map(i => i.value))}
  labelSelectAll="Select All"
  labelClearAllItems="Clear All"
  noMatchesText="No matches"
  clearable
/>
```

**MUI Equivalent:** `Autocomplete` with `multiple` prop
```tsx
import { Autocomplete, TextField } from '@mui/material';
<Autocomplete
  multiple
  options={dayTypes.map(dt => ({ label: dt.name, value: dt.id }))}
  value={selectedDayTypes.map(dt => ({ label: dt.name, value: dt.id }))}
  onChange={(event, newValue) => handleChange(newValue.map(v => v.value))}
  getOptionLabel={(option) => option.label}
  renderInput={(params) => (
    <TextField {...params} label="Select Day Types" />
  )}
  noOptionsText="No matches"
  disableCloseOnSelect
  limitTags={2}
/>
```

**Migration Type:** Direct replacement with Autocomplete
**Key Differences:**
- Entur: Dedicated MultiSelect component
- MUI: Autocomplete with `multiple` prop
- Entur: `selectedItems` (array)
- MUI: `value` (array)
- Entur: `labelSelectAll` and `labelClearAllItems` props
- MUI: No built-in "select all" / "clear all" functionality
- MUI: `limitTags` prop to limit displayed tags
- MUI: `disableCloseOnSelect` to keep dropdown open

**Migration Notes:**
- Only 1 use, manageable migration
- Autocomplete `multiple` mode uses chip display by default
- No built-in "Select All" / "Clear All" buttons in MUI
- Can add custom "Select All" button in renderInput or above component
- Example custom "Select All":
  ```tsx
  <Box>
    <Button onClick={() => handleChange(allDayTypes)}>Select All</Button>
    <Button onClick={() => handleChange([])}>Clear All</Button>
    <Autocomplete multiple {...props} />
  </Box>
  ```

---

## Typography

### Heading1 (Page Titles)
**Entur:** `@entur/typography`
```tsx
import { Heading1 } from '@entur/typography';
<Heading1>{title}</Heading1>
```

**MUI Equivalent:** `Typography` with `variant="h1"`
```tsx
import { Typography } from '@mui/material';
<Typography variant="h1">{title}</Typography>
```

**Migration Type:** Direct replacement with variant prop
**Key Differences:**
- Entur: Dedicated component for each heading level
- MUI: Single Typography component with variant prop
- MUI: Highly customizable via theme

**Migration Notes:**
- Replace all `<Heading1>` with `<Typography variant="h1">`
- Ensure MUI theme has h1 styles configured to match design
- Can customize via theme: `typography.h1`

---

### Heading2, Heading3, Heading4, Heading5
**Entur:** `@entur/typography`
```tsx
import { Heading2, Heading3, Heading4, Heading5 } from '@entur/typography';
<Heading2>{title}</Heading2>
<Heading3>{subtitle}</Heading3>
<Heading4>{section}</Heading4>
<Heading5>{subsection}</Heading5>
```

**MUI Equivalent:** `Typography` with respective variants
```tsx
import { Typography } from '@mui/material';
<Typography variant="h2">{title}</Typography>
<Typography variant="h3">{subtitle}</Typography>
<Typography variant="h4">{section}</Typography>
<Typography variant="h5">{subsection}</Typography>
```

**Migration Type:** Direct replacement with variant prop
**Migration Notes:**
- Same approach as Heading1
- Configure all heading styles in theme: `typography.h2` through `typography.h5`

---

### Paragraph (16 uses)
**Entur:** `@entur/typography`
```tsx
import { Paragraph } from '@entur/typography';
<Paragraph>{text}</Paragraph>
```

**MUI Equivalent:** `Typography` with `variant="body1"`
```tsx
import { Typography } from '@mui/material';
<Typography variant="body1">{text}</Typography>
// Or default (body1 is default):
<Typography>{text}</Typography>
```

**Migration Type:** Direct replacement
**Migration Notes:**
- MUI Typography defaults to `variant="body1"`
- Can omit variant prop for body text
- Configure body1 styles in theme

---

### LeadParagraph (4 uses)
**Entur:** `@entur/typography`
```tsx
import { LeadParagraph } from '@entur/typography';
<LeadParagraph>{introText}</LeadParagraph>
```

**MUI Equivalent:** `Typography` with custom variant or `variant="subtitle1"`
```tsx
import { Typography } from '@mui/material';
// Option 1: Use subtitle1
<Typography variant="subtitle1">{introText}</Typography>

// Option 2: Create custom variant in theme
<Typography variant="lead">{introText}</Typography>
```

**Migration Type:** Needs adaptation
**Key Differences:**
- Entur: Dedicated LeadParagraph for introductory text
- MUI: No direct "lead" variant, use subtitle1 or custom

**Migration Notes:**
- Use `subtitle1` (larger than body1, smaller than h6)
- Or define custom "lead" variant in theme:
  ```tsx
  typography: {
    lead: {
      fontSize: '1.25rem',
      lineHeight: 1.6,
      // ... other styles
    }
  }
  ```
- Declare custom variant in TypeScript:
  ```tsx
  declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
      lead: true;
    }
  }
  ```

---

### Label (5 uses)
**Entur:** `@entur/typography`
```tsx
import { Label } from '@entur/typography';
<Label>
  <i>{labelText}</i>
</Label>
```

**MUI Equivalent:** `Typography` with `variant="caption"` or `InputLabel`
```tsx
import { Typography } from '@mui/material';
// For standalone labels:
<Typography variant="caption" component="label">
  <i>{labelText}</i>
</Typography>

// For form labels:
import { InputLabel } from '@mui/material';
<InputLabel>{labelText}</InputLabel>
```

**Migration Type:** Context-dependent replacement
**Key Differences:**
- Entur: Single Label component for all label use cases
- MUI: Different components for form labels vs. general labels
- Typography caption for small text
- InputLabel for form field labels

**Migration Notes:**
- Check usage context: form labels vs. standalone labels
- Form labels → InputLabel (part of FormControl)
- Standalone labels → Typography variant="caption"
- Adjust component prop as needed: `component="label"`

---

### SmallText (2 uses)
**Entur:** `@entur/typography`
```tsx
import { SmallText } from '@entur/typography';
<SmallText>{text}</SmallText>
```

**MUI Equivalent:** `Typography` with `variant="caption"` or `variant="body2"`
```tsx
import { Typography } from '@mui/material';
<Typography variant="caption">{text}</Typography>
// Or body2 if not as small:
<Typography variant="body2">{text}</Typography>
```

**Migration Type:** Direct replacement
**Migration Notes:**
- Use "caption" for smallest text
- Use "body2" for slightly larger small text
- Only 2 uses, check context for appropriate variant

---

### StrongText (2 uses)
**Entur:** `@entur/typography`
```tsx
import { StrongText } from '@entur/typography';
<StrongText>{text}</StrongText>
```

**MUI Equivalent:** `Typography` with `fontWeight="bold"` or `<strong>`
```tsx
import { Typography } from '@mui/material';
<Typography component="strong">{text}</Typography>
// Or with sx:
<Typography sx={{ fontWeight: 'bold' }}>{text}</Typography>
// Or inline:
<strong>{text}</strong>
```

**Migration Type:** Direct replacement
**Migration Notes:**
- Only 2 uses, straightforward replacement
- Use `component="strong"` for semantic HTML
- Or use `sx={{ fontWeight: 'bold' }}`
- Or plain `<strong>` tag if not needing Typography features

---

### Link (1 use)
**Entur:** `@entur/typography`
```tsx
import { Link } from '@entur/typography';
<Link href="/path">{text}</Link>
```

**MUI Equivalent:** `Link` from MUI or with react-router
```tsx
import { Link } from '@mui/material';
<Link href="/path">{text}</Link>

// With react-router:
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';
<Link component={RouterLink} to="/path">{text}</Link>
```

**Migration Type:** Direct replacement
**Migration Notes:**
- Only 1 use
- MUI Link component has similar API
- For internal links, use `component={RouterLink}`
- For external links, use `href` prop
- MUI Link supports `underline` prop: "none" | "hover" | "always"

---

### SubParagraph (1 use)
**Entur:** `@entur/typography`
```tsx
import { SubParagraph } from '@entur/typography';
<SubParagraph>{text}</SubParagraph>
```

**MUI Equivalent:** `Typography` with `variant="body2"` or custom variant
```tsx
import { Typography } from '@mui/material';
<Typography variant="body2">{text}</Typography>
```

**Migration Type:** Direct replacement
**Migration Notes:**
- Only 1 use
- Use "body2" for smaller paragraph text
- Or define custom "subparagraph" variant in theme if needed

---

## Icons

### Icon Migration Strategy
**Entur:** `@entur/icons`
```tsx
import {
  AddIcon,
  DeleteIcon,
  SearchIcon,
  // ... etc
} from '@entur/icons';
```

**MUI Equivalent:** `@mui/icons-material`
```tsx
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  // ... etc
} from '@mui/icons-material';
```

**Migration Type:** Import path changes, icon name mapping
**Key Differences:**
- Different icon libraries (Entur custom vs. Material Design)
- Icon names may differ
- MUI has 2000+ icons vs. Entur's curated set
- Visual style differences (Material Design aesthetic)

**Icon Mapping:**

| Entur Icon | MUI Icon | Import |
|------------|----------|--------|
| AddIcon | Add | `import Add from '@mui/icons-material/Add';` |
| DeleteIcon | Delete | `import Delete from '@mui/icons-material/Delete';` |
| QuestionIcon | HelpOutline | `import HelpOutline from '@mui/icons-material/HelpOutline';` |
| BackArrowIcon | ArrowBack | `import ArrowBack from '@mui/icons-material/ArrowBack';` |
| SearchIcon | Search | `import Search from '@mui/icons-material/Search';` |
| PositionIcon | Place | `import Place from '@mui/icons-material/Place';` |
| DownloadIcon | Download | `import Download from '@mui/icons-material/Download';` |
| UserIcon | Person | `import Person from '@mui/icons-material/Person';` |
| UpArrowIcon | ArrowUpward | `import ArrowUpward from '@mui/icons-material/ArrowUpward';` |
| UndoIcon | Undo | `import Undo from '@mui/icons-material/Undo';` |
| SaveIcon | Save | `import Save from '@mui/icons-material/Save';` |
| NightIcon | Nightlight | `import Nightlight from '@mui/icons-material/Nightlight';` |
| MapIcon | Map | `import Map from '@mui/icons-material/Map';` |
| ExternalIcon | OpenInNew | `import OpenInNew from '@mui/icons-material/OpenInNew';` |
| DownArrowIcon | ArrowDownward | `import ArrowDownward from '@mui/icons-material/ArrowDownward';` |
| CopyIcon | ContentCopy | `import ContentCopy from '@mui/icons-material/ContentCopy';` |
| ClosedLockIcon | Lock | `import Lock from '@mui/icons-material/Lock';` |
| CheckIcon | Check | `import Check from '@mui/icons-material/Check';` |
| AdjustmentsIcon | Tune | `import Tune from '@mui/icons-material/Tune';` |
| ValidationSuccessIcon | CheckCircle | `import CheckCircle from '@mui/icons-material/CheckCircle';` |
| ValidationErrorIcon | Error | `import Error from '@mui/icons-material/Error';` |
| ValidationExclamationIcon | Warning | `import Warning from '@mui/icons-material/Warning';` |

**Migration Notes:**
- Create import alias map for easier migration:
  ```tsx
  // src/icons/index.ts
  export { Add as AddIcon } from '@mui/icons-material/Add';
  export { Delete as DeleteIcon } from '@mui/icons-material/Delete';
  // ... etc
  ```
- MUI icons have different visual style (Material Design)
- May need design review to ensure icons match brand
- MUI icons support `fontSize` prop: "small" | "medium" | "large" | "inherit"
- MUI icons support `color` prop: "primary" | "secondary" | "action" | "error" | "disabled" | "inherit"
- Some Entur icons may not have exact MUI equivalents - review each

---

## Alerts

### SmallAlertBox (7 uses)
**Entur:** `@entur/alert`
```tsx
import { SmallAlertBox } from '@entur/alert';
<SmallAlertBox variant="error">
  {errorMessage}
</SmallAlertBox>
```

**MUI Equivalent:** `Alert` with `severity` prop
```tsx
import { Alert } from '@mui/material';
<Alert severity="error">
  {errorMessage}
</Alert>
```

**Migration Type:** Direct replacement with prop name change
**Key Differences:**
- Entur: `variant` prop
- MUI: `severity` prop
- Entur: "SmallAlertBox" naming
- MUI: Single "Alert" component, size controlled by style

**Variant/Severity Mapping:**
- `variant="error"` → `severity="error"`
- `variant="warning"` → `severity="warning"`
- `variant="info"` → `severity="info"`
- `variant="success"` → `severity="success"`

**Migration Notes:**
- Near 1:1 replacement
- Change `variant` to `severity`
- MUI Alert has action slot for buttons/icons
- MUI Alert supports `onClose` for dismissible alerts
- Can customize icon with `icon` prop

---

### BannerAlertBox (1 use)
**Entur:** `@entur/alert`
```tsx
import { BannerAlertBox } from '@entur/alert';
<BannerAlertBox variant="info">
  {message}
</BannerAlertBox>
```

**MUI Equivalent:** `Alert` with `variant="filled"` or custom styling
```tsx
import { Alert } from '@mui/material';
<Alert severity="info" variant="filled">
  {message}
</Alert>
// Or with custom styling for banner appearance:
<Alert
  severity="info"
  sx={{
    width: '100%',
    borderRadius: 0,
    // ... other banner styles
  }}
>
  {message}
</Alert>
```

**Migration Type:** Direct replacement with styling
**Key Differences:**
- Entur: Dedicated BannerAlertBox for full-width alerts
- MUI: Single Alert component, style controlled by props
- MUI: `variant="filled"` for filled background
- MUI: `variant="outlined"` for outlined style
- MUI: `variant="standard"` (default) for standard style

**Migration Notes:**
- Only 1 use, straightforward replacement
- Use `variant="filled"` for more prominent banner
- Add sx styling for full-width banner appearance
- Can use `sx={{ borderRadius: 0, width: '100%' }}` for edge-to-edge

---

## Modals & Drawers

### Modal (9 uses)
**Entur:** `@entur/modal`
```tsx
import { Modal } from '@entur/modal';
<Modal
  open={isOpen}
  title="Dialog Title"
  onDismiss={handleClose}
  size="medium"
  className="custom-modal"
>
  <Paragraph>{message}</Paragraph>
  <div className="buttons">
    <Button onClick={handleAction}>Action</Button>
  </div>
</Modal>
```

**MUI Equivalent:** `Dialog` with `DialogTitle` and `DialogContent`
```tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

<Dialog
  open={isOpen}
  onClose={handleClose}
  maxWidth="md" // "xs" | "sm" | "md" | "lg" | "xl" | false
  fullWidth
  className="custom-modal"
>
  <DialogTitle>
    Dialog Title
    <IconButton
      onClick={handleClose}
      sx={{ position: 'absolute', right: 8, top: 8 }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>
  <DialogContent>
    <Typography>{message}</Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleAction}>Action</Button>
  </DialogActions>
</Dialog>
```

**Migration Type:** Structural change required
**Key Differences:**
- Entur: Single Modal component with title prop
- MUI: Dialog with DialogTitle, DialogContent, DialogActions subcomponents
- Entur: `onDismiss` callback
- MUI: `onClose` callback
- Entur: `size` prop ("small", "medium", "large")
- MUI: `maxWidth` prop ("xs", "sm", "md", "lg", "xl", false)
- MUI: No built-in close button, must add manually

**Size Mapping:**
- `size="small"` → `maxWidth="sm"`
- `size="medium"` → `maxWidth="md"`
- `size="large"` → `maxWidth="lg"`

**Migration Notes:**
- Significant structural change
- Split modal content into DialogTitle, DialogContent, DialogActions
- Add close button manually in DialogTitle if needed
- Use `fullWidth` prop for responsive width
- Consider creating wrapper component to maintain Entur API:
  ```tsx
  interface ModalProps {
    open: boolean;
    title: string;
    onDismiss: () => void;
    size?: 'small' | 'medium' | 'large';
    children: React.ReactNode;
  }

  const ModalWrapper = ({ open, title, onDismiss, size = 'medium', children }: ModalProps) => {
    const sizeMap = { small: 'sm', medium: 'md', large: 'lg' };
    return (
      <Dialog open={open} onClose={onDismiss} maxWidth={sizeMap[size]} fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
      </Dialog>
    );
  };
  ```

---

### Drawer (1 use)
**Entur:** `@entur/modal`
```tsx
import { Drawer } from '@entur/modal';
<Drawer
  title="Drawer Title"
  onDismiss={handleClose}
  open={isOpen}
>
  <header className="drawer-header">Header</header>
  <section className="drawer-section">Content</section>
</Drawer>
```

**MUI Equivalent:** `Drawer` with content structure
```tsx
import {
  Drawer,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

<Drawer
  anchor="right"
  open={isOpen}
  onClose={handleClose}
>
  <Box sx={{ width: 400, p: 2 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      <Typography variant="h6">Drawer Title</Typography>
      <IconButton onClick={handleClose}>
        <CloseIcon />
      </IconButton>
    </Box>
    <header className="drawer-header">Header</header>
    <section className="drawer-section">Content</section>
  </Box>
</Drawer>
```

**Migration Type:** Structural change required
**Key Differences:**
- Entur: `title` and `onDismiss` props built-in
- MUI: Must build title/close button structure manually
- Entur: Default width/position
- MUI: `anchor` prop for position ("left", "right", "top", "bottom")
- MUI: Must set width manually
- MUI: No built-in title or close button

**Migration Notes:**
- Only 1 use, manageable migration
- Add Box wrapper for content with width
- Build title bar with Typography + IconButton for close
- Use `anchor="right"` for right-side drawer (typical)
- Add padding and structure as needed

---

## Tables

### Table Components
**Entur:** `@entur/table`
```tsx
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  HeaderCell,
  DataCell,
  EditableCell,
  useSortableData
} from '@entur/table';

<Table fixed>
  <TableHead>
    <TableRow>
      <HeaderCell>Name</HeaderCell>
      <HeaderCell>Code</HeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow onClick={handleRowClick} hover title="tooltip">
      <DataCell>{name}</DataCell>
      <DataCell align="right">{code}</DataCell>
    </TableRow>
  </TableBody>
</Table>
```

**MUI Equivalent:** `Table` components
```tsx
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper
} from '@mui/material';

<TableContainer component={Paper}>
  <Table stickyHeader>
    <TableHead>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell>Code</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow
        onClick={handleRowClick}
        hover
        title="tooltip"
        sx={{ cursor: 'pointer' }}
      >
        <TableCell>{name}</TableCell>
        <TableCell align="right">{code}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>
```

**Migration Type:** Direct replacement with component name changes
**Key Differences:**
- Entur: `HeaderCell` and `DataCell`
- MUI: Single `TableCell` component
- MUI: Use `TableContainer` for scrolling and elevation
- Entur: `fixed` prop for fixed layout
- MUI: No direct equivalent, use `sx={{ tableLayout: 'fixed' }}`
- Entur: `hover` prop on TableRow
- MUI: `hover` prop on TableRow (same)

**Component Mapping:**
- `Table` → `Table` (same name)
- `TableHead` → `TableHead` (same name)
- `TableBody` → `TableBody` (same name)
- `TableRow` → `TableRow` (same name)
- `HeaderCell` → `TableCell` (in TableHead)
- `DataCell` → `TableCell` (in TableBody)
- `EditableCell` → `TableCell` with `sx={{ p: 0 }}` (for form inputs)

**Migration Notes:**
- Near 1:1 replacement with naming changes
- Wrap table in `TableContainer` for scrolling and Paper elevation
- Use `stickyHeader` prop for sticky header on scroll
- For fixed layout: `<Table sx={{ tableLayout: 'fixed' }}>`
- EditableCell → Regular TableCell with padding adjustments
- For clickable rows, add `sx={{ cursor: 'pointer' }}`

---

### useSortableData Hook
**Entur:** `@entur/table`
```tsx
import { useSortableData } from '@entur/table';

const { sortedData, getSortableHeaderProps, getSortableTableProps } =
  useSortableData<Line>(lines);

<Table {...getSortableTableProps()}>
  <TableHead>
    <TableRow>
      <HeaderCell {...getSortableHeaderProps('name')}>Name</HeaderCell>
      <HeaderCell {...getSortableHeaderProps('code')}>Code</HeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {sortedData.map(line => (
      <TableRow key={line.id}>
        <DataCell>{line.name}</DataCell>
        <DataCell>{line.code}</DataCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

**MUI Equivalent:** Custom hook or library (e.g., TanStack Table)
```tsx
// Option 1: Create custom sorting hook
import { useState, useMemo } from 'react';
import { TableSortLabel } from '@mui/material';

function useSortableData<T>(data: T[], initialSort?: { key: keyof T; direction: 'asc' | 'desc' }) {
  const [sortConfig, setSortConfig] = useState(initialSort);

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = (key: keyof T) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return { sortedData, sortConfig, handleSort };
}

// Usage:
const { sortedData, sortConfig, handleSort } = useSortableData(lines);

<Table>
  <TableHead>
    <TableRow>
      <TableCell>
        <TableSortLabel
          active={sortConfig?.key === 'name'}
          direction={sortConfig?.direction}
          onClick={() => handleSort('name')}
        >
          Name
        </TableSortLabel>
      </TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {sortedData.map(line => (
      <TableRow key={line.id}>
        <TableCell>{line.name}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

// Option 2: Use TanStack Table (recommended for complex tables)
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
```

**Migration Type:** Custom implementation required
**Key Differences:**
- Entur: Built-in `useSortableData` hook
- MUI: No built-in sorting hook, must implement or use library
- MUI: Provides `TableSortLabel` component for sort indicators
- Entur: Prop-based API (`getSortableHeaderProps`)
- MUI: Event-based API with TableSortLabel

**Migration Notes:**
- Create custom `useSortableData` hook (see example above)
- Use MUI's `TableSortLabel` for sort indicators
- For complex tables, consider TanStack Table library
- TableSortLabel provides arrow icons and active state
- Can store sort state in URL params for persistence

---

## Date & Time Pickers

### DatePicker (1 use)
**Entur:** `@entur/datepicker`
```tsx
import { DatePicker, CalendarDate } from '@entur/datepicker';
<DatePicker
  selectedDate={selectedDate}
  onChange={(date: CalendarDate) => setSelectedDate(date)}
  label="Select Date"
/>
```

**MUI Equivalent:** `DatePicker` from `@mui/x-date-pickers`
```tsx
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

<LocalizationProvider dateAdapter={AdapterDateFns}>
  <DatePicker
    value={selectedDate}
    onChange={(newDate) => setSelectedDate(newDate)}
    label="Select Date"
    renderInput={(params) => <TextField {...params} />}
  />
</LocalizationProvider>
```

**Migration Type:** Needs significant setup and adaptation
**Key Differences:**
- Entur: Standalone DatePicker component
- MUI: Requires LocalizationProvider wrapper and date adapter
- Entur: `selectedDate` prop
- MUI: `value` prop
- Entur: CalendarDate type (likely custom)
- MUI: Native Date objects or date-fns/dayjs/moment/luxon
- MUI: Must choose date library adapter (date-fns, dayjs, luxon, moment)

**Migration Notes:**
- Only 1 use
- Install dependencies: `npm install @mui/x-date-pickers date-fns`
- Wrap app (or DatePicker) in LocalizationProvider
- Choose date adapter: `AdapterDateFns` recommended
- Update date type from CalendarDate to Date
- MUI DatePicker is more feature-rich but more complex setup
- MUI has date range picker, date time picker, etc.

---

### TimePicker (1 use)
**Entur:** `@entur/datepicker`
```tsx
import { TimePicker } from '@entur/datepicker';
<TimePicker
  selectedTime={selectedTime}
  onChange={(time) => setSelectedTime(time)}
  label="Select Time"
/>
```

**MUI Equivalent:** `TimePicker` from `@mui/x-date-pickers`
```tsx
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

<LocalizationProvider dateAdapter={AdapterDateFns}>
  <TimePicker
    value={selectedTime}
    onChange={(newTime) => setSelectedTime(newTime)}
    label="Select Time"
    renderInput={(params) => <TextField {...params} />}
  />
</LocalizationProvider>
```

**Migration Type:** Same as DatePicker
**Migration Notes:**
- Only 1 use
- Same setup as DatePicker (LocalizationProvider + adapter)
- Update time type to Date object
- MUI TimePicker supports various time formats

---

### CalendarDate Type & Utilities
**Entur:** `@entur/datepicker`
```tsx
import {
  CalendarDate,
  nativeDateToTimeValue,
  timeOrDateValueToNativeDate
} from '@entur/datepicker';
```

**MUI Equivalent:** Standard Date objects or date library utilities
```tsx
// Use native Date objects:
const date: Date = new Date();

// Or use date-fns utilities:
import { format, parse } from 'date-fns';

// Convert string to Date:
const date = parse(dateString, 'yyyy-MM-dd', new Date());

// Convert Date to string:
const dateString = format(date, 'yyyy-MM-dd');
```

**Migration Type:** Replace with standard Date handling
**Migration Notes:**
- Replace CalendarDate type with Date
- Replace Entur utility functions with date-fns equivalents
- Common date-fns functions:
  - `format(date, formatString)` - format date to string
  - `parse(dateString, formatString, baseDate)` - parse string to date
  - `isValid(date)` - check if date is valid
  - `addDays(date, amount)` - add days to date
  - `differenceInDays(dateLeft, dateRight)` - get difference in days

---

## Chips

### ActionChip (3 uses)
**Entur:** `@entur/chip`
```tsx
import { ActionChip } from '@entur/chip';
<ActionChip onClick={handleClick} value="action1">
  Action Label
</ActionChip>
```

**MUI Equivalent:** `Chip` with `onClick`
```tsx
import { Chip } from '@mui/material';
<Chip
  label="Action Label"
  onClick={handleClick}
  clickable
/>
```

**Migration Type:** Direct replacement with prop changes
**Key Differences:**
- Entur: Dedicated ActionChip component
- Entur: Label as children
- MUI: Single Chip component with `clickable` prop
- MUI: Label as prop
- Entur: `value` prop
- MUI: No `value` prop (not needed for onClick)

**Migration Notes:**
- Only 3 uses
- Move children to `label` prop
- Add `clickable` prop for hover/click styles
- Remove `value` prop if not used in onClick handler

---

### FilterChip (2 uses)
**Entur:** `@entur/chip`
```tsx
import { FilterChip } from '@entur/chip';
<FilterChip
  checked={isSelected}
  onChange={() => handleToggle()}
  value="filter1"
>
  Filter Label
</FilterChip>
```

**MUI Equivalent:** `Chip` with `onClick` and conditional styling
```tsx
import { Chip } from '@mui/material';
<Chip
  label="Filter Label"
  onClick={handleToggle}
  variant={isSelected ? 'filled' : 'outlined'}
  color={isSelected ? 'primary' : 'default'}
  clickable
/>
```

**Migration Type:** Direct replacement with conditional styling
**Key Differences:**
- Entur: `checked` prop for selection state
- MUI: Visual state controlled by `variant` and `color` props
- Entur: `onChange` callback
- MUI: `onClick` callback
- MUI: No built-in checked/unchecked state, must control via styling

**Migration Notes:**
- Used for weekday picker and booking method selection
- Control visual state with conditional `variant` and `color`
- `variant="filled"` + `color="primary"` for selected
- `variant="outlined"` + `color="default"` for unselected
- Can also use `sx` for custom selected styles

---

### TagChip (1 use)
**Entur:** `@entur/chip`
```tsx
import { TagChip } from '@entur/chip';
<TagChip onDelete={handleDelete}>
  Tag Label
</TagChip>
```

**MUI Equivalent:** `Chip` with `onDelete`
```tsx
import { Chip } from '@mui/material';
<Chip
  label="Tag Label"
  onDelete={handleDelete}
/>
```

**Migration Type:** Direct replacement with prop changes
**Key Differences:**
- Entur: Dedicated TagChip component
- Entur: Label as children
- MUI: Single Chip component
- MUI: Label as prop
- MUI: `onDelete` adds delete icon automatically

**Migration Notes:**
- Only 1 use
- Move children to `label` prop
- MUI automatically adds delete icon when `onDelete` provided
- Can customize delete icon with `deleteIcon` prop

---

## Tooltips

### Tooltip (4 uses)
**Entur:** `@entur/tooltip`
```tsx
import { Tooltip } from '@entur/tooltip';
<Tooltip placement="right" content="Tooltip text">
  <span className="question-icon">
    <QuestionIcon />
  </span>
</Tooltip>
```

**MUI Equivalent:** `Tooltip`
```tsx
import { Tooltip } from '@mui/material';
<Tooltip title="Tooltip text" placement="right">
  <span className="question-icon">
    <QuestionIcon />
  </span>
</Tooltip>
```

**Migration Type:** Direct replacement with prop name change
**Key Differences:**
- Entur: `content` prop
- MUI: `title` prop
- Similar API otherwise

**Migration Notes:**
- Only 4 uses, straightforward replacement
- Change `content` to `title`
- MUI Tooltip has more placement options
- MUI Tooltip supports `arrow` prop for arrow indicator
- Child must be able to receive ref (use span wrapper if needed)

---

## Accordion

### Accordion & AccordionItem (1 use each)
**Entur:** `@entur/expand`
```tsx
import { Accordion, AccordionItem } from '@entur/expand';
<Accordion>
  <AccordionItem title="Section 1">
    Content 1
  </AccordionItem>
  <AccordionItem title="Section 2">
    Content 2
  </AccordionItem>
</Accordion>
```

**MUI Equivalent:** `Accordion`, `AccordionSummary`, `AccordionDetails`
```tsx
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

<div>
  <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Section 1</Typography>
    </AccordionSummary>
    <AccordionDetails>
      Content 1
    </AccordionDetails>
  </Accordion>
  <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Section 2</Typography>
    </AccordionSummary>
    <AccordionDetails>
      Content 2
    </AccordionDetails>
  </Accordion>
</div>
```

**Migration Type:** Structural change required
**Key Differences:**
- Entur: Container Accordion + AccordionItem children
- MUI: Individual Accordion components with Summary + Details
- Entur: `title` prop on AccordionItem
- MUI: Title as children of AccordionSummary
- MUI: Must specify expand icon

**Migration Notes:**
- Only 1 use each
- Split AccordionItem into Accordion + AccordionSummary + AccordionDetails
- Remove container Accordion wrapper
- Add expandIcon prop (typically ExpandMoreIcon)
- Move title to AccordionSummary children
- Move content to AccordionDetails children

---

### ExpandablePanel (1 use)
**Entur:** `@entur/expand`
```tsx
import { ExpandablePanel } from '@entur/expand';
<ExpandablePanel title="Panel Title" defaultExpanded={true}>
  Panel content
</ExpandablePanel>
```

**MUI Equivalent:** `Accordion` with `defaultExpanded`
```tsx
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

<Accordion defaultExpanded={true}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography>Panel Title</Typography>
  </AccordionSummary>
  <AccordionDetails>
    Panel content
  </AccordionDetails>
</Accordion>
```

**Migration Type:** Same as Accordion
**Migration Notes:**
- Only 1 use
- Same migration as Accordion above
- MUI Accordion supports `defaultExpanded` prop

---

## Layout

### Contrast (3 uses)
**Entur:** `@entur/layout`
```tsx
import { Contrast } from '@entur/layout';
<Contrast>
  <div>Content with contrasted background</div>
</Contrast>
```

**MUI Equivalent:** `Box` or `Paper` with theme mode switching
```tsx
import { Box, useTheme } from '@mui/material';

// Option 1: Box with background color
<Box sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
  <div>Content with contrasted background</div>
</Box>

// Option 2: Paper component
import { Paper } from '@mui/material';
<Paper elevation={0}>
  <div>Content with contrasted background</div>
</Paper>

// For theme switching (light/dark mode):
import { ThemeProvider, createTheme } from '@mui/material/styles';
const theme = createTheme({
  palette: {
    mode: isDarkMode ? 'dark' : 'light',
  },
});
```

**Migration Type:** Needs custom implementation
**Key Differences:**
- Entur: Contrast component for background contrast
- MUI: No direct equivalent, use Box/Paper with theme colors
- MUI: Theme mode switching for light/dark mode

**Migration Notes:**
- Only 3 uses
- Check usage context: is this for visual contrast or theme switching?
- For visual contrast: use Box/Paper with background color
- For theme switching: implement MUI theme mode switching
- Can create wrapper component if needed

---

### NavigationCard (1 use)
**Entur:** `@entur/layout`
```tsx
import { NavigationCard } from '@entur/layout';
<NavigationCard
  title="Card Title"
  description="Card description"
  onClick={handleClick}
/>
```

**MUI Equivalent:** `Card` with `CardActionArea`
```tsx
import {
  Card,
  CardActionArea,
  CardContent,
  Typography
} from '@mui/material';

<Card>
  <CardActionArea onClick={handleClick}>
    <CardContent>
      <Typography variant="h5" component="div">
        Card Title
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Card description
      </Typography>
    </CardContent>
  </CardActionArea>
</Card>
```

**Migration Type:** Structural change required
**Key Differences:**
- Entur: Single NavigationCard component with props
- MUI: Composite Card structure
- Entur: `title` and `description` props
- MUI: Typography components for content

**Migration Notes:**
- Only 1 use
- Build card structure with Card + CardActionArea + CardContent
- Use Typography for title and description
- CardActionArea provides hover/click styles
- Can add CardMedia for images if needed

---

## Navigation

### SideNavigation (1 use)
**Entur:** `@entur/menu`
```tsx
import {
  SideNavigation,
  SideNavigationGroup,
  SideNavigationItem
} from '@entur/menu';

<SideNavigation className="side-navigation">
  <Link to={'/'}>
    <Logo />
  </Link>

  <SideNavigationItem
    onClick={handleOnClick}
    active={isActive(location.pathname, path)}
    as={Link}
    to={path}
    icon={<Icon />}
  >
    Menu Item
  </SideNavigationItem>

  <SideNavigationGroup
    defaultOpen
    title="Submenu"
  >
    <SideNavigation>
      <SideNavigationItem text="Submenu Item" path="/path" />
    </SideNavigation>
  </SideNavigationGroup>
</SideNavigation>
```

**MUI Equivalent:** `Drawer` with `List`, `ListItem`, `ListItemButton`, `Collapse`
```tsx
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse
} from '@mui/material';
import { Link } from 'react-router-dom';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

<Drawer variant="permanent" className="side-navigation">
  <List>
    <ListItem>
      <Link to={'/'}>
        <Logo />
      </Link>
    </ListItem>

    <ListItem disablePadding>
      <ListItemButton
        component={Link}
        to={path}
        selected={isActive(location.pathname, path)}
        onClick={handleOnClick}
      >
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText primary="Menu Item" />
      </ListItemButton>
    </ListItem>

    <ListItem disablePadding>
      <ListItemButton onClick={handleToggle}>
        <ListItemText primary="Submenu" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
    </ListItem>
    <Collapse in={open} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        <ListItemButton sx={{ pl: 4 }} component={Link} to="/path">
          <ListItemText primary="Submenu Item" />
        </ListItemButton>
      </List>
    </Collapse>
  </List>
</Drawer>
```

**Migration Type:** Significant structural change required
**Key Differences:**
- Entur: Dedicated SideNavigation components
- MUI: Drawer + List composition
- Entur: `active` prop for current page
- MUI: `selected` prop on ListItemButton
- Entur: `as={Link}` for routing
- MUI: `component={Link}` for routing
- Entur: SideNavigationGroup for collapsible sections
- MUI: Collapse component for expandable sections

**Migration Notes:**
- Major structural change
- Use Drawer with `variant="permanent"` for persistent sidebar
- Build menu with List + ListItem + ListItemButton
- Use ListItemIcon for icons
- Use ListItemText for labels
- Use `selected` prop for active/current page
- Use Collapse for expandable sections (must manage open state)
- Consider creating wrapper components to simplify usage

---

### Stepper (1 use)
**Entur:** `@entur/menu`
```tsx
import { Stepper } from '@entur/menu';
<Stepper
  steps={[
    { label: 'Step 1', completed: true },
    { label: 'Step 2', completed: false },
    { label: 'Step 3', completed: false }
  ]}
  activeStep={1}
/>
```

**MUI Equivalent:** `Stepper`, `Step`, `StepLabel`
```tsx
import { Stepper, Step, StepLabel } from '@mui/material';

<Stepper activeStep={1}>
  <Step completed={true}>
    <StepLabel>Step 1</StepLabel>
  </Step>
  <Step completed={false}>
    <StepLabel>Step 2</StepLabel>
  </Step>
  <Step completed={false}>
    <StepLabel>Step 3</StepLabel>
  </Step>
</Stepper>
```

**Migration Type:** Structural change required
**Key Differences:**
- Entur: `steps` prop with array of objects
- MUI: Step components as children
- Similar API otherwise

**Migration Notes:**
- Only 1 use
- Map steps array to Step components
- MUI Stepper has more variants: horizontal, vertical, alternative label
- MUI supports optional steps and error states
- Can add StepContent for vertical stepper

---

### Pagination (1 use)
**Entur:** `@entur/menu`
```tsx
import { Pagination } from '@entur/menu';
<Pagination
  page={currentPage}
  count={totalPages}
  onChange={(page) => setCurrentPage(page)}
/>
```

**MUI Equivalent:** `Pagination`
```tsx
import { Pagination } from '@mui/material';
<Pagination
  page={currentPage}
  count={totalPages}
  onChange={(event, page) => setCurrentPage(page)}
/>
```

**Migration Type:** Direct replacement with callback signature change
**Key Differences:**
- Entur: `onChange(page)`
- MUI: `onChange(event, page)`
- Very similar API otherwise

**Migration Notes:**
- Only 1 use, straightforward replacement
- Update onChange callback to accept event parameter
- MUI Pagination has more options: size, variant, shape, color
- Can show/hide first/last buttons
- Can set sibling and boundary count

---

## Grid

### GridContainer & GridItem (1 use each)
**Entur:** `@entur/grid`
```tsx
import { GridContainer, GridItem } from '@entur/grid';
<GridContainer spacing={2}>
  <GridItem small={12} medium={6} large={4}>
    Content 1
  </GridItem>
  <GridItem small={12} medium={6} large={4}>
    Content 2
  </GridItem>
</GridContainer>
```

**MUI Equivalent:** `Grid` (or `Grid2` for newer API)
```tsx
import { Grid } from '@mui/material';

// Option 1: Grid v1 (container/item pattern)
<Grid container spacing={2}>
  <Grid item xs={12} md={6} lg={4}>
    Content 1
  </Grid>
  <Grid item xs={12} md={6} lg={4}>
    Content 2
  </Grid>
</Grid>

// Option 2: Grid2 (newer, simpler API)
import { Grid2 } from '@mui/material';
<Grid2 container spacing={2}>
  <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
    Content 1
  </Grid2>
  <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
    Content 2
  </Grid2>
</Grid2>
```

**Migration Type:** Direct replacement with breakpoint name changes
**Key Differences:**
- Entur: GridContainer + GridItem components
- MUI: Single Grid component with `container` and `item` props
- Entur: `small`, `medium`, `large` breakpoints
- MUI: `xs`, `sm`, `md`, `lg`, `xl` breakpoints
- MUI Grid2: Newer API with `size` prop

**Breakpoint Mapping:**
- `small` → `xs` (extra-small, <600px)
- `medium` → `md` (medium, 900px+)
- `large` → `lg` (large, 1200px+)

**Migration Notes:**
- Only 1 use of each
- Use Grid v1 for consistency with existing MUI patterns
- Or adopt Grid2 for cleaner API (recommended for new code)
- Grid v1: Add `container` prop to parent, `item` to children
- Update breakpoint prop names
- MUI uses 12-column grid (same as Entur)

---

## Design Tokens

### SCSS Variables (34 files)
**Entur:** `@entur/tokens`
```scss
@import '@entur/tokens/dist/styles.scss';

.element {
  color: $colors-brand-blue;
  background: $colors-brand-coral;
  border-color: $colors-validation-mint;
  padding: $space-extra-large4;
  margin: $space-extra-large9;
}
```

**MUI Equivalent:** MUI Theme system
```tsx
// Define theme with Entur colors
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0B78D0', // Entur brand blue
    },
    secondary: {
      main: '#ED5935', // Entur brand coral
    },
    success: {
      main: '#2ECC71', // Validation mint
    },
  },
  spacing: 8, // Base spacing unit (8px = 1)
  // Define custom spacing if needed
});

// Use in component:
import { Box } from '@mui/material';
<Box
  sx={{
    color: 'primary.main',
    backgroundColor: 'secondary.main',
    borderColor: 'success.main',
    padding: 4, // 4 * 8px = 32px (extraLarge4)
    margin: 9, // 9 * 8px = 72px (extraLarge9)
  }}
/>
```

**Migration Type:** Major architectural change
**Key Differences:**
- Entur: SCSS variables imported in each file
- MUI: Centralized theme object, accessed via `sx` prop or theme hook
- Entur: Direct variable references in SCSS
- MUI: Theme path references in JS/TS
- MUI: Type-safe theme access
- MUI: Dynamic theming (light/dark mode, user preferences)

**Migration Strategy:**
1. **Extract Entur token values:**
   - Map all used Entur tokens to their values
   - Create Entur → MUI theme mapping

2. **Create MUI theme:**
   ```tsx
   const theme = createTheme({
     palette: {
       // Map Entur brand colors
       primary: { main: '#0B78D0' }, // $colors-brand-blue
       secondary: { main: '#ED5935' }, // $colors-brand-coral
       success: { main: '#2ECC71' }, // $colors-validation-mint
       // ... other colors
     },
     spacing: 8, // MUI default, adjust if Entur uses different base
     typography: {
       // Map Entur typography styles
       h1: { fontSize: '2.5rem', fontWeight: 700 },
       // ... other variants
     },
   });
   ```

3. **Replace SCSS with sx prop or styled-components:**
   ```tsx
   // Before (SCSS):
   .element {
     color: $colors-brand-blue;
     padding: $space-extra-large4;
   }

   // After (sx prop):
   <Box sx={{ color: 'primary.main', p: 4 }} />

   // Or styled-component:
   import { styled } from '@mui/material/styles';
   const Element = styled('div')(({ theme }) => ({
     color: theme.palette.primary.main,
     padding: theme.spacing(4),
   }));
   ```

4. **Remove SCSS imports:**
   - Delete `@import '@entur/tokens/dist/styles.scss';`
   - Convert SCSS modules to styled-components or sx prop

**Migration Notes:**
- This is the most significant migration effort (34 files)
- Consider gradual migration: keep SCSS alongside MUI initially
- MUI theme system is more powerful and maintainable long-term
- Enables dynamic theming (light/dark mode, user preferences)
- Type-safe theme access prevents typos
- Can colocate component styles with components
- Consider using MUI's `styled` API for complex components
- Use `sx` prop for one-off styles

**Token Mapping Example:**
```tsx
// Create a token mapping reference
const enturToMuiTokens = {
  // Colors
  '$colors-brand-blue': 'primary.main',
  '$colors-brand-coral': 'secondary.main',
  '$colors-validation-mint': 'success.main',
  // Spacing
  '$space-extra-large4': 4, // theme.spacing(4)
  '$space-extra-large9': 9, // theme.spacing(9)
  // ... etc
};
```

---

## Feature Flags

### @entur/react-component-toggle (9 uses across 6 files)
**Entur:** `@entur/react-component-toggle`
```tsx
import {
  ComponentToggle,
  FeatureComponent,
  ComponentToggleProvider,
  ToggleFlags
} from '@entur/react-component-toggle';

// Provider setup:
<ComponentToggleProvider flags={toggleFlags}>
  <App />
</ComponentToggleProvider>

// Usage:
<ComponentToggle feature="newFeature">
  <FeatureComponent whenEnabled>
    <NewFeatureComponent />
  </FeatureComponent>
  <FeatureComponent whenDisabled>
    <OldFeatureComponent />
  </FeatureComponent>
</ComponentToggle>
```

**MUI Equivalent:** No direct equivalent - Custom implementation needed
```tsx
// Option 1: React Context + conditional rendering
import { createContext, useContext } from 'react';

const FeatureFlagsContext = createContext<ToggleFlags>({});

export const FeatureFlagsProvider = ({
  flags,
  children
}: {
  flags: ToggleFlags;
  children: React.ReactNode;
}) => (
  <FeatureFlagsContext.Provider value={flags}>
    {children}
  </FeatureFlagsContext.Provider>
);

export const useFeatureFlag = (flag: string) => {
  const flags = useContext(FeatureFlagsContext);
  return flags[flag] ?? false;
};

// Usage:
const MyComponent = () => {
  const isNewFeatureEnabled = useFeatureFlag('newFeature');
  return isNewFeatureEnabled ? <NewFeatureComponent /> : <OldFeatureComponent />;
};

// Option 2: Use a dedicated library like @growthbook/growthbook-react, launchdarkly, etc.
```

**Migration Type:** No direct MUI equivalent - custom implementation or library
**Key Differences:**
- Entur: Dedicated feature flag library with component-based API
- MUI: No built-in feature flag system
- Must implement custom solution or use third-party library

**Migration Options:**

1. **Minimal Custom Implementation (Recommended for simple cases):**
   ```tsx
   // Create context/hooks as shown above
   // Pros: Simple, no dependencies
   // Cons: Manual implementation, no advanced features
   ```

2. **Third-Party Library (Recommended for complex cases):**
   ```tsx
   // Options:
   // - @growthbook/growthbook-react (open source, powerful)
   // - launchdarkly-react-client-sdk (commercial)
   // - flagsmith (open source)
   // - unleash-proxy-client (open source)

   // Example with GrowthBook:
   import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react';

   const gb = new GrowthBook({
     features: toggleFlags,
   });

   <GrowthBookProvider growthbook={gb}>
     <App />
   </GrowthBookProvider>

   // Usage:
   import { useFeature } from '@growthbook/growthbook-react';
   const feature = useFeature('newFeature');
   return feature.on ? <NewFeatureComponent /> : <OldFeatureComponent />;
   ```

3. **Keep Entur Component Toggle:**
   ```tsx
   // If only using feature flags and not other Entur components,
   // consider keeping this package
   // Pros: No migration needed for feature flags
   // Cons: Additional dependency outside MUI ecosystem
   ```

**Migration Notes:**
- 9 uses across 6 files
- Feature flags are orthogonal to UI components - not MUI's responsibility
- Evaluate if feature flag complexity justifies a library
- For simple cases, custom context/hook implementation is sufficient
- For complex cases (A/B testing, gradual rollouts, remote flags), use a library
- Can keep using Entur's component-toggle if desired (not tied to UI)

---

## Migration Strategy

### Phase 1: Setup & Foundation
1. **Install MUI dependencies:**
   ```bash
   npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
   npm install @mui/x-date-pickers date-fns  # For date/time pickers
   ```

2. **Create MUI theme:**
   - Extract Entur design tokens (colors, spacing, typography)
   - Create MUI theme matching Entur design
   - Set up ThemeProvider at app root

3. **Set up wrapper components (optional but recommended):**
   - Create wrapper components that match Entur API for smooth migration
   - Example: `PrimaryButton`, `DropdownField`, etc.
   - Allows gradual migration without changing all call sites at once

### Phase 2: Component Migration Priority

**High Priority (Most Used):**
1. Buttons (67 uses) - Start here, high visibility
2. TextField (21 uses) - Critical form component
3. Typography (58+ uses) - Pervasive throughout app
4. Dropdown (17 uses) - Complex migration, start early
5. Table components - Common, moderate complexity

**Medium Priority:**
6. Alerts (8 uses)
7. Modal (9 uses)
8. Checkboxes & form controls
9. Icons - Gradual replacement
10. Chips (6 uses)

**Low Priority (Few Uses):**
11. DatePicker/TimePicker (1 each)
12. Drawer (1 use)
13. Grid (1 use)
14. Navigation components (1 use)
15. Accordion (1 use)

### Phase 3: SCSS to Theme Migration
1. Identify all SCSS files using Entur tokens (34 files)
2. Convert SCSS to MUI `sx` prop or styled-components
3. Remove Entur token imports
4. Test visual consistency

### Phase 4: Testing & Refinement
1. Visual regression testing (compare screenshots)
2. Accessibility testing (ensure ARIA labels, keyboard nav)
3. Responsive testing (breakpoints may differ)
4. Browser compatibility testing
5. Performance testing (bundle size, render performance)

### Migration Tools & Scripts

**Create a codemod or script for common replacements:**
```js
// Example codemod for button migration
module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Replace PrimaryButton with Button variant="contained"
  root
    .find(j.JSXElement, {
      openingElement: { name: { name: 'PrimaryButton' } }
    })
    .forEach(path => {
      path.value.openingElement.name.name = 'Button';
      // Add variant="contained" prop
      // ... implementation
    });

  return root.toSource();
};
```

**Search & Replace Patterns:**
```bash
# Find all Entur imports
rg "from '@entur/" --type tsx

# Find all SCSS imports with Entur tokens
rg "@import '@entur/tokens" --type scss

# Count usage of specific components
rg "import.*PrimaryButton.*from '@entur/button'" --count
```

### Component Wrapper Strategy

Create wrapper components to ease migration:

```tsx
// src/components/wrappers/Button.tsx
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

// Wrapper maintains Entur-like API
export const PrimaryButton = (props: MuiButtonProps) => (
  <MuiButton variant="contained" color="primary" {...props} />
);

export const SecondaryButton = (props: MuiButtonProps) => (
  <MuiButton variant="outlined" {...props} />
);

export const SuccessButton = (props: MuiButtonProps) => (
  <MuiButton variant="contained" color="success" {...props} />
);

// ... etc
```

Then update imports:
```tsx
// Before:
import { PrimaryButton } from '@entur/button';

// After (gradual migration):
import { PrimaryButton } from '@/components/wrappers/Button';

// After (full migration):
import { Button } from '@mui/material';
<Button variant="contained" color="primary">...</Button>
```

### Testing Strategy

1. **Visual Regression Testing:**
   - Use Storybook + Chromatic or Percy
   - Capture screenshots before/after migration
   - Identify visual differences

2. **Unit Tests:**
   - Update component tests to use MUI components
   - Test wrapper components
   - Ensure behavior parity

3. **Integration Tests:**
   - Test forms, dropdowns, modals in context
   - Ensure validation still works
   - Test navigation flows

4. **Accessibility Audits:**
   - Run axe or Lighthouse
   - Ensure ARIA attributes preserved
   - Test keyboard navigation
   - Test screen reader compatibility

### Rollback Strategy

If migration issues arise:
1. Keep Entur dependencies installed during migration
2. Use feature flags to toggle between Entur/MUI
3. Migrate page-by-page or feature-by-feature
4. Keep wrapper components to switch implementations

---

## Components With No Direct MUI Equivalent

These components require custom implementation or alternative approaches:

1. **FloatingButton** - Use `Fab` or styled `Button` with elevation
2. **SecondarySquareButton / TertiarySquareButton** - Custom styled `IconButton`
3. **FeedbackText (with variants)** - Use `FormHelperText` or `Typography` with conditional color
4. **SearchableDropdown** - MUI `Autocomplete` is searchable by default
5. **LeadParagraph** - Use `Typography` variant="subtitle1" or custom variant
6. **Contrast** - Custom implementation or theme mode switching
7. **NavigationCard** - Build with `Card` + `CardActionArea` + `CardContent`
8. **SideNavigation** - Build with `Drawer` + `List` + `ListItem` composition
9. **Component Toggle (Feature Flags)** - Custom context or third-party library
10. **Design Tokens** - Migrate to MUI theme system

---

## Breaking Changes & Gotchas

1. **Dropdown onChange signature:**
   - Entur: `onChange(item)`
   - MUI: `onChange(event, value)`

2. **Checkbox/Radio label structure:**
   - Entur: Label as children
   - MUI: Wrapped in FormControlLabel

3. **Modal structure:**
   - Entur: Single component with title prop
   - MUI: Dialog + DialogTitle + DialogContent composition

4. **Table cells:**
   - Entur: HeaderCell and DataCell
   - MUI: Single TableCell component

5. **Typography:**
   - Entur: Dedicated components (Heading1, Paragraph, etc.)
   - MUI: Single Typography component with variant prop

6. **Icons:**
   - Different icon library, visual style differences
   - Name changes (AddIcon → Add)

7. **SCSS to Theme:**
   - Major paradigm shift from static SCSS to dynamic theme
   - Requires rewriting all styled components

8. **Form error handling:**
   - Entur: Spread operator with helper function
   - MUI: Direct error and helperText props

9. **Component polymorphism:**
   - Entur: `as={Component}` prop
   - MUI: `component={Component}` prop

10. **Date handling:**
    - Entur: CalendarDate type
    - MUI: Native Date objects or date-fns

---

## Conclusion

This migration involves:
- **Direct replacements:** ~40% of components (buttons, icons, alerts, tooltips, switch, pagination)
- **Structural changes:** ~40% of components (forms, dropdowns, modal, table, navigation)
- **Custom implementation:** ~20% of components (feature flags, design tokens, specialized layouts)

**Estimated effort:**
- Phase 1 (Setup): 1-2 weeks
- Phase 2 (Component migration): 6-10 weeks
- Phase 3 (SCSS migration): 4-6 weeks
- Phase 4 (Testing): 2-4 weeks
- **Total: 13-22 weeks** (depending on team size and complexity)

**Recommendations:**
1. Start with high-priority components (buttons, typography)
2. Create wrapper components for gradual migration
3. Migrate page-by-page or feature-by-feature
4. Use feature flags for safe rollout
5. Prioritize visual consistency testing
6. Document team-specific patterns and decisions

**Benefits of migration:**
- Larger ecosystem and community
- Better TypeScript support
- More comprehensive component library
- Active maintenance and updates
- Better accessibility out-of-the-box
- Dynamic theming capabilities
- Performance optimizations