# Design System

## Core Philosophy

Algos uses a **Modern Glassmorphism** aesthetic to create a clean, depth-rich, and futuristic user interface.

## Glassmorphism

The "Glass" effect is the signature style of the application. It mimics strict frosted glass.

### Usage

Use the `.glass` utility class for containers, cards, and panels that sit on top of the background or other elements.

```html
<div class="glass p-6 rounded-xl">
  <!-- Content -->
</div>
```

### Characteristics

- **Background**: `bg-background/60` (High translucency)
- **Blur**: `backdrop-blur-md` (Medium blur for readability)
- **Border**: `border-border/50` (Subtle boundary)
- **Shadow**: `shadow-sm` (Soft depth)

### Interactive Elements

For clickable glass elements, combine with `.glass-hover`:

```html
<div class="glass glass-hover ...">
  <!-- Interactive Content -->
</div>
```

## Colors

- **Primary**: Deep/Vibrant Accent (Used for actions, highlights).
- **Background**: Light/Dark neutral with slight noise or gradient.
- **Text**: High contrast for readability against glass.

## Typography

- **Font**: Inter (Variable)
- **Headings**: Bold, Tracking-tight.
