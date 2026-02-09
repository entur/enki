# MUI Migration — Agent Team Collaboration Plan

This document defines how a team of Claude Code agents will collaborate to migrate the Enki project from the Entur Design System to Material-UI. The plan maximizes parallelism while ensuring no two agents edit the same file simultaneously.

## Key Principles

1. **Migrate by file ownership, not by component type.** Each file is touched once by one agent who replaces ALL Entur imports in that file with MUI equivalents. This avoids multiple agents editing the same file and avoids touching files repeatedly.
2. **Component internals change, public APIs don't.** When Agent A migrates a component's internals from Entur to MUI, consumers of that component don't need to change. This means component files and their consuming scene files can be migrated by different agents in parallel.
3. **Phase gates.** Each phase must pass verification before the next phase begins. The team lead runs builds/tests between phases.
4. **SCSS migrates with its owner.** Each `.scss` file is migrated by the same agent that owns the corresponding `.tsx` file.
5. **Tests migrate with their source.** Each `.test.tsx` file is migrated by the same agent that owns the component/scene being tested.

## Team Structure

| Role | Agent Type | Purpose |
|------|-----------|---------|
| **team-lead** | general-purpose | Coordinates phases, runs verification, handles merge issues, reviews |
| **foundation** | general-purpose | Phase 0 only: MUI setup, theme, shared utilities |
| **worker-1** | general-purpose | File migration per phase assignment |
| **worker-2** | general-purpose | File migration per phase assignment |
| **worker-3** | general-purpose | File migration per phase assignment |
| **worker-4** | general-purpose | File migration per phase assignment |

Workers are spawned and shut down per phase as needed. Not all workers are active in every phase.

---

## Phase 0: Foundation Setup

**Agents:** foundation (solo)
**Blocking:** All other phases depend on this
**Estimated effort:** 1-2 hours

### Tasks

1. **Install MUI packages**
   ```
   npm install @mui/material @mui/icons-material @mui/x-date-pickers @emotion/react @emotion/styled date-fns
   ```

2. **Create MUI theme** at `src/theme.ts`
   - Map Entur brand colors to MUI palette
   - Configure typography scale (matching current h1-h5, paragraph sizes)
   - Set up spacing scale
   - Configure component default overrides where needed

3. **Wrap app with ThemeProvider**
   - Edit `src/index.tsx` to add `<ThemeProvider>` and `<CssBaseline />`
   - This is the ONLY file shared across concerns — foundation agent owns it

4. **Migrate shared helper utilities**
   - `src/helpers/dropdown.ts` — Replace `NormalizedDropdownItemType` from `@entur/dropdown` with a local type definition (this type is used by many components)
   - `src/helpers/errorHandling.ts` — Replace `VariantType` from `@entur/form` with local type
   - `src/components/StopPointsEditor/common/quaySearchResults.ts` — Replace `VariantType`

5. **Create adapter utilities** (if needed)
   - Dropdown value adapter (Entur onChange gives item, MUI onChange gives event)
   - Any shared migration helpers

### Verification Gate
- `npm run build` passes (MUI and Entur coexist)
- `npm test -- run` passes (no regressions)
- App renders with both design systems loaded

---

## Phase 1: Scenes + Shared UI Components (Max Parallel)

**Agents:** worker-1, worker-2, worker-3, worker-4 (all 4 in parallel)
**Depends on:** Phase 0 complete
**Estimated effort:** 2-3 hours per worker

### Critical Rule: No file overlap between workers

Since scenes NEVER import from other scenes (confirmed by dependency analysis), and component internal changes don't affect consumers, all four workers can run simultaneously.

### Worker-1: App Shell & Navigation

**Files owned (tsx + associated scss + tests):**
| File | Entur Packages |
|------|---------------|
| `src/scenes/App/index.tsx` | react-component-toggle |
| `src/scenes/App/LandingPage.tsx` | layout, menu, button, react-component-toggle |
| `src/scenes/App/NavBar/index.tsx` | icons, layout, menu, react-component-toggle |
| `src/scenes/App/NavBar/LogoutChip/index.tsx` | chip, icons |
| `src/scenes/App/NavBar/LanguagePicker/index.tsx` | button, icons |
| `src/scenes/App/NavBar/UserPreference/index.tsx` | layout |
| `src/scenes/App/NavBar/UserPreference/UserMenu/index.tsx` | icons |
| `src/scenes/App/SelectProvider/SelectProvider.tsx` | dropdown |
| `src/scenes/App/NoSelectedProvider/NoSelectedProvider.tsx` | layout, icons |
| `src/scenes/App/NavBar/styles.scss` + all App SCSS files | tokens |

**Key challenges:**
- SideNavigation → MUI Drawer + List (significant structural change)
- Contrast wrapper → MUI ThemeProvider with dark theme
- FloatingButton → MUI Fab
- SearchableDropdown → MUI Autocomplete

### Worker-2: Listing Scenes + Table Components

**Files owned (tsx + associated scss + tests):**
| File | Entur Packages |
|------|---------------|
| `src/scenes/Lines/index.tsx` | button, icons, typography |
| `src/scenes/Lines/DeleteConfirmationDialog/index.tsx` | button |
| `src/scenes/FlexibleLines/index.tsx` | button, icons, typography |
| `src/scenes/Exports/index.tsx` | button, icons, table, typography |
| `src/scenes/Exports/Creator/index.tsx` | button, form, icons, tooltip, typography |
| `src/scenes/Exports/Viewer/index.tsx` | button, icons, typography |
| `src/components/LinesTable/index.tsx` | table |
| `src/components/LinesForExport/index.tsx` | form, typography |
| All associated SCSS files | tokens |

**Key challenges:**
- @entur/table → MUI Table (different cell component names)
- Multiple button variant replacements

### Worker-3: CRUD Scenes (Networks, Brandings, StopPlaces, Providers, DayTypes)

**Files owned (tsx + associated scss + tests):**
| File | Entur Packages |
|------|---------------|
| `src/scenes/Networks/index.tsx` | button, icons, table, typography |
| `src/scenes/Networks/Editor/index.tsx` | button, dropdown, form, typography |
| `src/scenes/Brandings/index.tsx` | button, icons, typography |
| `src/scenes/Brandings/Editor/index.tsx` | button, form, typography |
| `src/scenes/StopPlaces/index.tsx` | button, icons, typography |
| `src/scenes/StopPlaces/scenes/Editor/index.tsx` | alert, button, form, grid, typography |
| `src/scenes/StopPlaces/scenes/Editor/components/StopPlaceTypeDropdown.tsx` | dropdown |
| `src/scenes/StopPlaces/scenes/Editor/components/FlexibleAreaPanel.tsx` | button, expand, icons |
| `src/scenes/StopPlaces/scenes/Editor/components/CoordinatesInputField.tsx` | form |
| `src/scenes/Providers/index.tsx` | button, icons, typography |
| `src/scenes/Providers/Editor/index.tsx` | button, form |
| `src/scenes/Providers/LineMigration/index.tsx` | button, dropdown, form, typography |
| `src/scenes/DayTypes/index.tsx` | button, icons, typography |
| `src/scenes/DayTypes/Editor/index.tsx` | button, typography |
| `src/scenes/DayTypes/Editor/DayTypeForm.tsx` | alert, form, icons, tooltip, typography |
| All associated SCSS files | tokens |

**Key challenges:**
- Dropdown onChange API differences
- Grid → MUI Grid2
- ExpandablePanel → MUI Accordion
- Most files are straightforward CRUD forms

### Worker-4: Shared UI Components (Small/Medium)

**Files owned (tsx + associated scss + tests):**
| File | Entur Packages |
|------|---------------|
| `src/components/Page/index.tsx` | button, icons, typography |
| `src/components/ConfirmDialog/index.tsx` | modal, typography |
| `src/components/ConfirmNavigationDialog/index.tsx` | button |
| `src/components/AddButton/AddButton.tsx` | button, icons, typography |
| `src/components/DeleteButton/DeleteButton.tsx` | button, icons |
| `src/components/DeleteActionChip/index.tsx` | chip, icons |
| `src/components/CopyActionChip/index.tsx` | chip, icons |
| `src/components/Loading/index.tsx` | (if any) |
| `src/components/OverlayLoader/index.tsx` | (if any) |
| `src/components/Notification/**/*.tsx` | button, form, modal |
| `src/components/RequiredInputMarker/index.tsx` | typography |
| `src/components/WeekdayPicker/index.tsx` | chip, form |
| `src/components/DayOffsetDropdown/index.tsx` | dropdown, icons |
| `src/components/FlexibleLineTypeSelector/**/*.tsx` | dropdown, modal, typography |
| All associated SCSS files | tokens |

**Key challenges:**
- Modal → MUI Dialog (structural change)
- ActionChip → MUI Chip with onClick
- FilterChip → MUI Chip with variant

### Verification Gate
- `npm run build` passes
- `npm test -- run` passes
- Manual smoke test: navigate all scenes, verify rendering

---

## Phase 2: Complex Editor Components (Max Parallel)

**Agents:** worker-1, worker-2, worker-3 (3 in parallel)
**Depends on:** Phase 1 complete
**Estimated effort:** 3-5 hours per worker

These are the highest-risk files. Each worker gets a non-overlapping cluster of tightly related editor components.

### Worker-1: Line Editor Infrastructure + Booking

**Files owned (tsx + associated scss + tests):**
| File | Entur Packages |
|------|---------------|
| `src/scenes/LineEditor/**/*.tsx` | (scene wrappers, may have few direct imports) |
| `src/scenes/FlexibleLineEditor/**/*.tsx` | (scene wrappers) |
| `src/components/GeneralLineEditor/index.tsx` | dropdown, form, typography |
| `src/components/GeneralLineEditor/VehicleSubModeDropdown.tsx` | dropdown |
| `src/components/LineEditorStepper/index.tsx` | alert, button, menu (Stepper) |
| `src/components/BookingArrangementEditor/index.tsx` | button, layout (Contrast), modal, typography |
| `src/components/BookingArrangementEditor/editor.tsx` | chip, dropdown, form, typography |
| `src/components/Notices/index.tsx` | button, icons, tooltip, typography |
| `src/components/TimeUnitPicker/index.tsx` | button, dropdown, form |
| `src/components/FormMap/index.tsx` | button, icons |
| `src/components/FormMap/FormMapContainer.tsx` | react-component-toggle |
| All associated SCSS files | tokens |

**Key challenges:**
- Stepper component (different API in MUI — steps defined differently)
- BookingArrangementEditor with Contrast wrapper → MUI ThemeProvider
- Modal → Dialog migration
- SearchableDropdown → MUI Autocomplete

### Worker-2: Journey Patterns & Service Journeys

**Files owned (tsx + associated scss + tests):**
| File | Entur Packages |
|------|---------------|
| `src/components/JourneyPatternEditor/index.tsx` | button |
| `src/components/JourneyPatternEditor/CopyDialog.tsx` | button, form, modal |
| `src/components/JourneyPatternEditor/General/index.tsx` | form |
| `src/components/JourneyPatterns/index.tsx` | expand, typography |
| `src/components/JourneyPatterns/NewJourneyPatternModal.tsx` | button, form, modal |
| `src/components/ServiceJourneyEditor/index.tsx` | button, dropdown, form |
| `src/components/ServiceJourneyEditor/CopyDialog.tsx` | button, form, modal, typography |
| `src/components/ServiceJourneys/index.tsx` | button, expand, typography |
| `src/components/ServiceJourneys/BulkDeleteDialog.tsx` | button, form, icons, modal, typography |
| `src/components/ServiceJourneys/NewServiceJourneyDialog.tsx` | button, dropdown, form, modal |
| All associated SCSS files | tokens |

**Key challenges:**
- Multiple Modal → Dialog migrations
- Accordion → MUI Accordion
- Several Dropdown instances with different patterns
- Copy dialogs with validation

### Worker-3: Stop Points, Passing Times & Day Types Editors

**Files owned (tsx + associated scss + tests):**
| File | Entur Packages |
|------|---------------|
| `src/components/StopPointsEditor/Generic/GenericStopPointEditor.tsx` | button, react-component-toggle |
| `src/components/StopPointsEditor/Generic/GenericStopPointsEditor.tsx` | alert, react-component-toggle, typography |
| `src/components/StopPointsEditor/MixedFlexible/MixedFlexibleStopPointEditor.tsx` | button, dropdown, form |
| `src/components/StopPointsEditor/MixedFlexible/MixedFlexibleStopPointsEditor.tsx` | typography |
| `src/components/StopPointsEditor/FlexibleAreasOnly/FlexibleAreasOnlyStopPointEditor.tsx` | dropdown |
| `src/components/StopPointsEditor/FlexibleAreasOnly/FlexibleAreasOnlyStopPointsEditor.tsx` | typography |
| `src/components/StopPointsEditor/common/BoardingTypeSelect.tsx` | dropdown |
| `src/components/StopPointsEditor/common/FrontTextTextField.tsx` | form |
| `src/components/StopPointsEditor/common/QuayRefField.tsx` | form |
| `src/components/StopPointsEditor/common/StopPointOrder.tsx` | button, icons, typography |
| `src/components/PassingTimesEditor/common/PassingTimePicker.tsx` | datepicker |
| `src/components/PassingTimesEditor/common/PassingTimesError.tsx` | alert |
| `src/components/PassingTimesEditor/GenericPassingTimesEditor/*.tsx` | typography |
| `src/components/PassingTimesEditor/MixedFlexiblePassingTimesEditor/*.tsx` | typography |
| `src/components/PassingTimesEditor/FlexibleAreasOnlyPassingTimesEditor/*.tsx` | typography |
| `src/components/DayTypesEditor/DayTypesEditor.tsx` | button, dropdown (MultiSelect) |
| `src/components/DayTypesEditor/DayTypesModal.tsx` | modal |
| `src/components/DayTypesEditor/DayTypesModalContent.tsx` | alert, button, form, menu (Pagination) |
| `src/components/DayTypesEditor/DayTypeEditor.tsx` | alert, button, form, icons, tooltip, typography |
| `src/components/DayTypesEditor/DayTypeAssignmentsEditor.tsx` | button, datepicker, form, icons, table |
| `src/components/DayTypesEditor/DayTypesTableExpRow.tsx` | form |
| All associated SCSS files | tokens |

**Key challenges:**
- 3 StopPointsEditor variants must stay consistent
- MultiSelect → MUI Autocomplete (multiple) — different API
- DatePicker → MUI X DatePicker (needs LocalizationProvider)
- PassingTimePicker wraps TimePicker — careful migration needed
- Pagination → MUI Pagination
- Complex table in DayTypeAssignmentsEditor

### Verification Gate
- `npm run build` passes
- `npm test -- run` passes
- Manual smoke test: create/edit a flexible line end-to-end, test all editor steps

---

## Phase 3: Extensions & Global Styles

**Agents:** worker-1, worker-2 (2 in parallel)
**Depends on:** Phase 2 complete
**Estimated effort:** 2-3 hours per worker

### Worker-1: Extension Components

**Files owned:**
| File | Entur Packages |
|------|---------------|
| `src/ext/JourneyPatternStopPointMap/**/*.tsx` | button, chip, icons, typography, react-component-toggle |
| `src/ext/Fintraffic/**/*.tsx` | menu, various |
| `src/ext/AuthenticatedTileLayer/**/*.tsx` | react-component-toggle |
| All extension SCSS files | tokens, eds variables |

**Key challenges:**
- Map popover components use Entur UI
- Fintraffic navbar additions
- Custom EDS CSS variable overrides (--eds-*) need complete rework

### Worker-2: Global Styles & Fintraffic Theme

**Files owned:**
| File | Purpose |
|------|---------|
| `src/styles/index.scss` | Root stylesheet — remove all @entur CSS imports |
| `src/styles/base/base.scss` | Global typography — replace with MUI CssBaseline |
| `src/styles/base/dimensions.scss` | Single variable — migrate to theme |
| `src/ext/Fintraffic/CustomStyle/styles.scss` | 1,080-line override → MUI theme variant |

**Key challenges:**
- The root `src/styles/index.scss` imports ALL Entur component CSS — must remove these after all components are migrated
- Fintraffic's 1,080-line override must become a createTheme() configuration
- Must create `src/themes/fintraffic.ts` (or similar) with MUI theme overrides
- CSS custom property mapping: `--fds-*` → MUI theme tokens

### Verification Gate
- `npm run build` passes
- `npm test -- run` passes
- Test with Fintraffic extension enabled (if possible)
- Test map features (if applicable)

---

## Phase 4: Cleanup & Package Removal

**Agents:** foundation (solo)
**Depends on:** Phase 3 complete
**Estimated effort:** 1-2 hours

### Tasks

1. **Verify no remaining Entur imports**
   ```bash
   grep -r "@entur/" src/ --include="*.tsx" --include="*.ts" --include="*.scss" | grep -v "react-component-toggle" | grep -v "rollup-plugin"
   ```
   This should return zero results.

2. **Remove Entur CSS imports** from `src/styles/index.scss`
   - Remove all `@import '@entur/*/dist/styles.css'` lines

3. **Remove Entur packages from package.json**
   Keep: `@entur/react-component-toggle`, `@entur/rollup-plugin-react-component-toggle`
   Remove all others:
   ```
   npm uninstall @entur/a11y @entur/alert @entur/button @entur/chip @entur/datepicker @entur/dropdown @entur/expand @entur/form @entur/grid @entur/icons @entur/layout @entur/menu @entur/modal @entur/table @entur/tokens @entur/tooltip @entur/typography
   ```

4. **Remove unused SCSS files** that only contained Entur token references

5. **Final build and test**
   ```bash
   npm run build
   npm test -- run
   ```

6. **Update documentation**
   - Update AGENTS.md to reference MUI instead of Entur
   - Remove or archive MUI_COMPONENT_MAPPING.md and MUI_MIGRATION_PLAN.md

### Verification Gate
- Clean build with no Entur packages (except component-toggle)
- All tests pass
- Full manual smoke test of all features

---

## Parallelism Summary

```
Phase 0: [foundation]                                          ████
          ↓
Phase 1: [worker-1] [worker-2] [worker-3] [worker-4]          ████████████
          ↓
Phase 2: [worker-1] [worker-2] [worker-3]                     ████████████████
          ↓
Phase 3: [worker-1] [worker-2]                                 ████████████
          ↓
Phase 4: [foundation]                                          ████
```

**Maximum concurrent agents:** 4 workers + 1 team lead = 5
**Sequential phases:** 5 (with parallel work within each)

---

## File Ownership Rules

To prevent conflicts, these rules are absolute:

1. **Each .tsx/.ts file has exactly one owner** within a phase. The owner migrates all Entur imports in that file.
2. **Each .scss file is owned by the agent that owns its corresponding .tsx file.** (e.g., `src/components/Page/styles.scss` belongs to whoever owns `src/components/Page/index.tsx`)
3. **Each .test.tsx file is owned by the agent that owns the source file it tests.**
4. **No agent may edit `package.json` except the foundation agent** (Phase 0 and Phase 4).
5. **No agent may edit `src/index.tsx` except the foundation agent.**
6. **No agent may edit `src/styles/index.scss` except during Phase 3** (Worker-2 owns it).
7. **If an agent discovers a shared file that needs changes, they report it to the team lead** who assigns it to the appropriate owner.

---

## Communication Protocol

### Task Assignment
The team lead creates tasks with clear file ownership lists and assigns them to workers via TaskUpdate.

### Progress Reporting
Workers mark tasks as `completed` when done and report any issues via SendMessage to team-lead.

### Conflict Resolution
If a worker needs to edit a file owned by another worker:
1. Worker sends message to team-lead describing the needed change
2. Team-lead either reassigns the file or asks the file owner to make the change
3. Never edit another worker's files without explicit reassignment

### Phase Gate Protocol
1. All workers in current phase mark tasks complete
2. Team lead shuts down phase workers
3. Team lead runs: `npm run build && npm test -- run`
4. If issues found: team lead spawns a fix agent for specific files
5. If clean: team lead spawns next phase workers

---

## Context Each Worker Needs

When spawning workers, the team lead should provide each agent with:

1. **Reference to MUI_COMPONENT_MAPPING.md** — "Read /path/to/MUI_COMPONENT_MAPPING.md for before/after code examples"
2. **Their specific file list** — Exact files they own (from the tables above)
3. **The MUI theme file** — So they can reference theme tokens
4. **Key migration patterns:**
   - Typography: `<Heading1>` → `<Typography variant="h1">`
   - Buttons: `<SecondaryButton>` → `<Button variant="outlined">`
   - Icons: `import { AddIcon } from '@entur/icons'` → `import AddIcon from '@mui/icons-material/Add'`
   - Modal: `<Modal>` → `<Dialog>` (compositional with DialogTitle, DialogContent, DialogActions)
   - Dropdown: `<Dropdown>` → `<Autocomplete>` or `<Select>` depending on use
   - Table: `<HeaderCell>` → `<TableCell>` in `<TableHead>`, `<DataCell>` → `<TableCell>` in `<TableBody>`
   - Alert: `<SmallAlertBox variant="info">` → `<Alert severity="info">`
   - Form: `<TextField>` → `<TextField>` (similar but different error handling props)

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Agent edits wrong file | Strict file ownership tables; team lead reviews |
| Build breaks between phases | Phase gates with build/test verification |
| Component API changes unexpectedly | Rule: never change component public props interfaces |
| Dropdown onChange incompatibility | Foundation agent creates adapter in Phase 0 |
| MUI theme doesn't match Entur look | Designer review after Phase 1; adjust theme before Phase 2 |
| Tests fail due to DOM structure changes | Each agent updates tests for their owned files |
| SCSS conflicts with MUI styles | Keep SCSS during migration; clean up in Phase 3-4 |

---

## Estimated Total Timeline

| Phase | Duration (wall clock) | Agents |
|-------|----------------------|--------|
| Phase 0: Foundation | 1-2 hours | 1 |
| Phase 1: Scenes + Shared Components | 2-3 hours | 4 parallel |
| Phase 2: Complex Editors | 3-5 hours | 3 parallel |
| Phase 3: Extensions + Styles | 2-3 hours | 2 parallel |
| Phase 4: Cleanup | 1-2 hours | 1 |
| **Total** | **~9-15 hours wall clock** | — |

This is significantly faster than the 12-16 week estimate for human developers due to agent parallelism and the ability to work continuously.
