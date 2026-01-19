# Hierarchical Combobox – Uzence Assignment

## Tech Stack
- React 18
- TypeScript (strict)
- Tailwind CSS
- Storybook

## Features
- Async hierarchical data loading
- Manual virtualization (no third-party libraries)
- Multi-select with indeterminate parent states
- Full keyboard navigation
- Accessible tree-based combobox (ARIA compliant)

## Architecture
- Tree state managed via custom hook
- Normalized node store for scalability
- Virtualized rendering based on scroll position
- All components demonstrated via Storybook only

## Accessibility
- Keyboard-first interaction
- Correct ARIA roles (`combobox`, `tree`, `treeitem`)
- Screen-reader friendly selection states

## Running locally
```bash
npm install
npm run storybook
