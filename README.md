# Hierarchical Combobox – Uzence Assignment

This project implements a fully accessible, scalable **Hierarchical Combobox** component built entirely from scratch, as part of the Front End Development Internship assignment for **Uzence Design Studio**.

The component is demonstrated **only via Storybook**, following the assignment guidelines.

---

## Tech Stack

- React 18
- TypeScript (Strict Mode enabled)
- Vite
- Tailwind CSS
- Storybook

❌ No UI libraries  
❌ No tree / select / virtualization libraries  
❌ No prebuilt components  

---

## Features

- Async hierarchical data loading
- Tree-based expand / collapse behavior
- Manual virtualization for large datasets
- Multi-select support with correct indeterminate parent states
- Full keyboard navigation:
  - Arrow Up / Down – navigate
  - Arrow Left / Right – collapse / expand
  - Space / Enter – select
- Accessibility-first implementation with correct ARIA roles
- Edge cases covered in Storybook:
  - Default
  - Empty state
  - Loading state

---

## Architecture Overview

- **Tree state** is managed using a custom React hook with normalized storage.
- **Async loading** is handled via a configurable loader function.
- **Virtualization** is implemented manually based on scroll position and row height.
- **Selection logic** propagates downward to children and upward to parents for indeterminate states.
- **Presentation and logic** are clearly separated for maintainability.

---

## Accessibility

- Keyboard-first UX (mouse not required)
- ARIA roles used:
  - `combobox`
  - `tree`
  - `treeitem`
- `aria-selected`, `aria-level`, and `aria-multiselectable` applied correctly
- Indeterminate checkbox states handled explicitly

---

## Storybook

All component behavior is showcased using Storybook only.

### Available stories:
- `Default`
- `Empty`
- `Loading`

Storybook is the single source of truth for reviewing this component.

---
```md
## Running the Project Locally

```bash
npm install
npm run storybook

**Author:** Aman Panwar  
**Assignment:** Front End Development Internship – Uzence Design Studio
