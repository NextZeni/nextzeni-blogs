// Single source of truth for the NextZeni color palette.
// CSS variables in globals.css must stay in sync with these values.
// SVG components reference `var(--color-*)` so they stay linked automatically.

export const colors = {
  background: "#ffffff",
  foreground: "#242424",
  secondary:  "#6b6b6b",
  accent:     "#2E6F40",
  button:     "#2E6F40",
  border:     "#e6e6e6",
} as const;

export type ColorKey = keyof typeof colors;

// CSS variable names — use these when reading values at runtime via getComputedStyle.
export const cssVars = {
  background: "var(--color-background)",
  foreground: "var(--color-foreground)",
  secondary:  "var(--color-secondary)",
  accent:     "var(--color-accent)",
  button:     "var(--color-button)",
  border:     "var(--color-border)",
} as const;
