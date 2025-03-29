# TRADR Game Style Guide

This document outlines the design system and styling conventions used in the TRADR Game project.

## Design Tokens

All design tokens are stored in `style-guide.ts` and organized into the following categories:

### Colors
- Primary palette for buttons and UI elements
- Text colors for different states and hierarchy
- Shadow colors for depth and interaction

### Typography
- Consistent text sizes from micro (10px) to title (36px)
- System font stack optimized for crisp pixel rendering

### Spacing
- Layout spacing for page sections and components
- Button-specific spacing for consistent padding
- Icon spacing for visual harmony

### Animations
- Button interactions (hover, tap, pulse)
- Icon animations (rotate, float)
- Text animations (scroll)

### Effects
- Pixel-perfect shadows
- Border styles maintaining the retro-modern aesthetic

## Usage Examples

### Buttons
```tsx
// Primary button (NEW GAME)
<button className="w-full py-5 bg-green-200 hover:bg-green-300 text-black rounded-lg pixel-button pixel-border">

// Secondary button (LEADERBOARD)
<button className="w-full py-4 bg-purple-200 hover:bg-purple-300 text-black rounded-lg pixel-button pixel-border">

// Disabled button (1-1 BATTLE)
<button className="w-full py-4 bg-gray-200 text-gray-500 rounded-lg pixel-button pixel-border cursor-not-allowed">
```

### Text Styles
```tsx
// Title
<h1 className="text-4xl font-bold tracking-tight">

// Button text
<span className="text-lg font-bold">

// Small text
<p className="text-xs text-gray-500">

// Micro text
<p className="text-[10px] text-gray-300">
```

### Animations
```tsx
// Button hover
whileHover={{ scale: 1.03, y: -2 }}
whileTap={{ scale: 0.98 }}

// Icon animation
animate={{ rotate: [0, 360] }}
transition={{ duration: 4, repeat: Infinity }}

// Text scroll
animation: scrollText 20s linear infinite
```

## Maintaining Consistency

1. Always use the classes and animations defined in this guide
2. Keep the pixel-perfect aesthetic with defined shadows and borders
3. Maintain the spacing hierarchy for visual rhythm
4. Use the color palette consistently for user feedback and states

## Future Updates

When updating the design system:
1. Update the `style-guide.ts` file
2. Document any new tokens or patterns in this README
3. Ensure backwards compatibility with existing components 