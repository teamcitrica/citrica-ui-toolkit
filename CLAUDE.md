# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Citrica UI Toolkit is a React component library built on top of HeroUI components, providing a custom design system wrapper. The library is built with TypeScript and bundled using tsup for distribution.

## Build System

**Development:**
```bash
npm run dev
```
Watches source files and rebuilds on changes, outputting both CJS and ESM formats with TypeScript definitions.

**Production Build:**
```bash
npm run build
```
Builds the library for distribution in `dist/` with CommonJS, ESM, and TypeScript declaration files.

## Architecture

### Component Structure

Components follow Atomic Design principles with three tiers:

- **Atoms** (`src/components/atoms/`): Basic building blocks (Button, Input, Select, Icon, Card, Grid, etc.)
- **Molecules** (`src/components/molecules/`): Compositions of atoms (Modal, Carousel)
- **Organisms** (`src/components/organism/`): Complex UI sections (Footer, Header, Sidebar)

Each component directory contains:
- `ComponentName.tsx` - Implementation
- `index.ts` - Re-exports

All components are re-exported through `src/components/index.ts` and ultimately through `src/index.ts`.

### HeroUI Wrapper Pattern

Components wrap HeroUI components with custom variants and styling. The pattern used throughout:

1. **Custom variant mapping**: Components accept custom variants (`primary`, `secondary`) that map to HeroUI variants
2. **CSS class injection**: Custom classes are applied using `clsx()` based on variant selection
3. **Icon integration**: Components support both `startIcon`/`endIcon` (using lucide-react via Icon component) and `startContent`/`endContent` (for custom React nodes)
4. **Props forwarding**: HeroUI props are extended with custom props, then forwarded to the underlying HeroUI component

Example from Input, Select, and Autocomplete:
```typescript
const shouldUseCustomVariant = variant === 'primary' || variant === 'secondary';
const heroVariant = shouldUseCustomVariant ? 'bordered' : variant;
// Then pass heroVariant to HeroUI component
```

### Admin Mode System

Button component supports an `isAdmin` prop that switches to alternate color schemes (admin theme). This pattern applies classes like `btn-primary-admin`, `color-admin-on-primary`, etc.

### Custom Styling Classes

Components apply custom CSS classes:
- `{component}-citrica-ui` - Base class for all components
- `{component}-{variant}` - Variant-specific classes (e.g., `input-primary`, `select-secondary`)
- `{component}-item-citrica-ui` - For list items (select/autocomplete items)

These classes are expected to be defined in the consuming application's CSS.

## Key Dependencies

- **@heroui/\***: Base component library being wrapped
- **lucide-react**: Icon library used by Icon component
- **clsx**: Utility for conditional class names
- **swiper**: For Carousel component
- **tsup**: Build tool for library bundling

## Important Notes

### TypeScript Configuration
- Target: ES2020
- Module: ESNext with bundler resolution
- Strict mode enabled
- JSX: react-jsx (automatic runtime)

### Package Exports
Library exports CommonJS and ESM formats:
- Main (CJS): `dist/index.js`
- Module (ESM): `dist/index.mjs`
- Types: `dist/index.d.ts`

### Client Components
All interactive components use `'use client'` directive for Next.js App Router compatibility.

### Refs and ForwardRef
Input component uses `forwardRef` for ref forwarding. Other form components may need similar treatment for form library integration.

### Grid System
Grid components (Container, Col) provide responsive layout utilities with breakpoint-based column sizing using `cols={{ lg: 3, md: 6, sm: 2 }}` pattern.
