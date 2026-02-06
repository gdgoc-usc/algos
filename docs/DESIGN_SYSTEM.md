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

The application uses the official **Google Brand Colors** to align with the GDG identity.

- **Google Blue**: `#4285F4` (Primary Action, Arrays & Sorting)
- **Google Red**: `#DB4437` (Destructive, Errors, Searching)
- **Google Yellow**: `#F4B400` (Warnings, Charts, Data Structures)
- **Google Green**: `#0F9D58` (Success, Visualizations, Graphs)

### Theme Colors

- **Primary**: Google Blue
- **Background**:
  - Light: `oklch(0.985 0.005 60)` (Soft Light Grey)
  - Dark: `oklch(0.18 0.02 260)` (Softer Dark Grey/Blue - not pure black)
- **Text**: Contrast optimized for readability.

## Typography

- **Font**: **Excalifont** (Hand-drawn style)
- **Headings**: Tracking-tight, often used with gradients in Hero sections.
- **Body**: Clean and legible.
