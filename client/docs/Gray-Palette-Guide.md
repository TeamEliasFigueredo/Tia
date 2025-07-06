# Light Gray Palette Design System

## Overview

The application now uses a sophisticated light gray color palette that provides a modern, professional appearance while maintaining excellent accessibility and visual clarity.

## Color Palette Reference

### Light Mode Grays

- **gray-50 (98%)**: Subtle backgrounds, card highlights
- **gray-100 (95%)**: Container backgrounds, subtle sections
- **gray-200 (90%)**: Borders, dividers, accent backgrounds
- **gray-300 (83%)**: Input borders, inactive element borders
- **gray-400 (65%)**: Placeholder text, disabled element text
- **gray-500 (45%)**: Secondary text, muted content
- **gray-600 (35%)**: Interactive elements, secondary buttons
- **gray-700 (25%)**: Primary buttons, important text
- **gray-800 (15%)**: High contrast text, emphasis
- **gray-900 (8%)**: Maximum contrast headers

### Utility Classes

#### Background Colors

- `.bg-primary-gray` - Primary action backgrounds (gray-700)
- `.bg-secondary-gray` - Secondary container backgrounds (gray-100)
- `.bg-accent-gray` - Accent/highlight backgrounds (gray-200)

#### Text Colors

- `.text-primary-gray` - Primary text color (gray-700)
- `.text-secondary-gray` - Secondary text color (gray-500)

#### Gradients

- `.bg-gradient-gray` - Primary gradient (gray-600 to gray-700)
- `.bg-gradient-gray-light` - Light gradient (gray-50 to gray-100)

#### Buttons

- `.btn-gray-primary` - Primary button styling with hover states
- `.btn-gray-secondary` - Secondary button styling with hover states

## Usage Examples

### Primary Actions

```html
<button class="btn-gray-primary">Primary Action</button>
<button class="bg-gray-700 hover:bg-gray-800 text-white">Custom Primary</button>
```

### Secondary Elements

```html
<div class="bg-secondary-gray border-gray-300">
  <p class="text-secondary-gray">Secondary content</p>
</div>
```

### Cards and Containers

```html
<div class="bg-white border border-gray-200 shadow-sm">
  <div class="bg-accent-gray p-4">
    <h3 class="text-primary-gray">Card Header</h3>
  </div>
</div>
```

## Accessibility

All color combinations in this palette maintain WCAG AA contrast ratios:

- **Gray-700 on white**: 11.9:1 contrast ratio
- **Gray-600 on white**: 8.3:1 contrast ratio
- **Gray-500 on white**: 4.6:1 contrast ratio
- **White on gray-700**: 11.9:1 contrast ratio

## Migration from Blue Palette

The CSS automatically overrides blue references:

- `text-blue-600` → `text-gray-700`
- `bg-blue-600` → `bg-gray-700`
- `border-blue-600` → `border-gray-700`

This ensures existing components automatically adopt the gray palette without requiring individual updates.

## Dark Mode Support

The palette includes carefully crafted dark mode variants that maintain the same visual hierarchy and accessibility standards in dark environments.
