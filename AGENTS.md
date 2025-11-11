# AGENTS.md

This file provides guidance to AI agents when working with code in this repository.

## Project Overview

Enki is the frontend application for Nplan, a timetable editor for flexible transit lines. It communicates with a GraphQL backend called [Uttu](https://github.com/entur/uttu). The application supports creating and managing flexible transit lines, journey patterns, service journeys, day types, and exports.

## Common Commands

### Development
- `npm install` - Install dependencies
- `npm start` - Start development server on http://localhost:3001
- `npm run build` - Build production bundle (runs TypeScript compiler first, then Vite build)
- `npm run server` - Preview production build locally

### Testing
- `npm test` - Run tests with Vitest
- `npm test -- run --coverage` - Run tests with coverage report

### Code Quality
- `npm run format` - Format code with Prettier
- `npm run check` - Check code formatting
- `npm run analyze` - Analyze bundle size with source-map-explorer

### Requirements
- Node version: 24 (LTS)

## Configuration

### Local Development Setup

1. Copy the local environment configuration:
   ```bash
   cp .github/environments/local.json public/bootstrap.json
   ```

2. To connect to a local Uttu backend (port 11701), create `.env.development.local`:
   ```
   REACT_APP_UTTU_API_URL=http://localhost:11701/services/flexible-lines
   ```

3. To bypass authentication locally, set `disableAuthentication: true` in `bootstrap.json`

### Configuration Structure

Configuration is loaded from `/bootstrap.json` at runtime (not compile time). See `src/config/config.ts` for the complete configuration interface, including:
- `uttuApiUrl` - Backend GraphQL API base URL
- `oidcConfig` - OIDC authentication settings
- `sandboxFeatures` - Feature flags for experimental features
- `supportedFlexibleLineTypes` - Restrict available flexible line types
- `extPath` - Path to custom company-specific extensions in `/src/ext`

## Architecture

### State Management

Redux Toolkit with the following structure:
- **Store**: `src/store/store.ts` - Configures store with Redux Toolkit, Sentry integration, and dynamic reducer injection
- **Reducers**: `src/reducers/` - Contains domain-specific reducers (providers, exports, networks, brandings, flexibleLines, flexibleStopPlaces, editor, notification)
- **Slices**: Authentication (`auth/authSlice.ts`), config (`config/configSlice.ts`), internationalization (`i18n/intlSlice.ts`), and user context (`auth/userContextSlice.ts`)
- **Hooks**: Use `useAppDispatch` and `useAppSelector` from `src/store/hooks.ts` for type-safe Redux access

### API Communication

- **GraphQL**: Uses Apollo Client for GraphQL queries/mutations to Uttu backend
  - Apollo provider setup: `src/api/index.tsx`
  - GraphQL queries: `src/api/uttu/queries.ts`
  - GraphQL mutations: `src/api/uttu/mutations.ts`
  - Provider-specific endpoints: Each provider has its own GraphQL endpoint at `{uttuApiUrl}/{providerCode}/graphql`
- **Authentication**: JWT tokens from OIDC are automatically added to GraphQL requests via Apollo Link
- **Multi-provider**: The active provider is stored in Redux state (`userContext.activeProviderCode`) and determines which GraphQL endpoint to use

### Authentication

- Uses `oidc-client-ts` with `react-oidc-context` for OIDC authentication
- Authentication wrapper: `src/auth/auth.tsx`
- Authentication state: `src/auth/authSlice.ts`
- User context (active provider): `src/auth/userContextSlice.ts`
- Can be bypassed locally with `disableAuthentication: true` config

### Application Structure

- **Entry point**: `src/index.tsx` - Bootstraps app with config loading, Sentry, component toggle system
- **Main app**: `src/scenes/App/` - Contains routing, navbar, provider selection
- **Scenes**: `src/scenes/` - Page-level components organized by feature:
  - `Providers/` - Provider management and line migration
  - `Lines/` - Fixed line listing
  - `FlexibleLines/` - Flexible line listing
  - `LineEditor/` - Fixed line editor with multi-step form
  - `FlexibleLineEditor/` - Flexible line editor with multi-step form
  - `Exports/` - NeTEx export creation and management
  - `Networks/` - Network management
  - `Brandings/` - Branding management
  - `StopPlaces/` - Flexible stop place management
- **Components**: `src/components/` - Reusable UI components (journey pattern editor, day types editor, form map, booking arrangement editor, etc.)
- **Models**: `src/model/` - TypeScript interfaces for domain entities (Line, FlexibleLine, JourneyPattern, ServiceJourney, DayType, Export, etc.)
- **Helpers**: `src/helpers/` - Utility functions and business logic
- **Actions**: `src/actions/` - Redux action creators and thunks

### Extension System

The app supports company-specific customizations via the `/src/ext` directory:
- Custom components can be provided using the `@entur/react-component-toggle` system
- Features are toggled via `sandboxFeatures` config
- Custom components are loaded dynamically with code splitting
- Examples: Custom styles, logos, translations, landing pages
- Configured via `extPath` in bootstrap.json (e.g., `"extPath": "Fintraffic"`)

### Internationalization

- Uses `react-intl` for translations
- Translations: `src/i18n/translations/`
- Default locale and supported locales configured in bootstrap.json
- Custom translations can be provided via extension system

### Build System

- **Vite** for development server and building
- **TypeScript** with strict mode enabled
- **SCSS** for styling
- **SVG**: Imported as React components via `vite-plugin-svgr`
- **Path aliases**: Base URL set to `src/` in tsconfig.json
- **Code splitting**: Manual chunks for vendor, index, and translation files

### Testing

- **Vitest** for unit tests with jsdom environment
- **Testing Library** for React component testing
- **MSW** for API mocking (see `src/mocks/`)
- Test setup: `src/setupTests.js`
- Coverage reporting with lcov format
- Sonar test reporting with vitest-sonar-reporter

## Key Concepts

### Providers
- Providers represent different transit operators/organizations
- Each provider has its own isolated data in the backend
- Users must select a provider before accessing most features
- Provider context is managed in Redux (`userContext.activeProviderCode`)

### Flexible Lines
- Three types: `fixed`, `mixedFlexible`, `flexibleAreasOnly`
- Can be restricted via `supportedFlexibleLineTypes` config
- Different editor flows based on line type

### Journey Patterns
- Define the route and stop sequence for a line
- Contains stop points (quays or flexible stop places)
- Can have service journey patterns (templates for service journeys)

### Service Journeys
- Specific trips on a journey pattern
- Have passing times for each stop point
- Can be dated (specific date) or day type-based

### Day Types
- Define when service journeys operate (e.g., weekdays, weekends)
- Can have day type assignments for specific date ranges

### Exports
- Creates NeTEx XML exports of line data
- Options for dry run, service links generation, dated service journeys
- Can be configured per deployment via bootstrap.json

## Code Style

- Prettier formatting with single quotes (configured in package.json)
- Husky pre-commit hooks run lint-staged for auto-formatting
- TypeScript strict mode enabled
- Imports are organized automatically with prettier-plugin-organize-imports
