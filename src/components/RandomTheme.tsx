'use client'

// Generate random color in HSL format
export function generateRandomHue(): number {
  return Math.floor(Math.random() * 360)
}

export function generateTheme() {
  const hue = generateRandomHue()
  const saturation = 60 + Math.random() * 20 // 60-80%
  const lightness = 15 + Math.random() * 10 // 15-25% for dark backgrounds
  
  return {
    // Background gradient
    bgFrom: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    bgTo: `hsl(${(hue + 30) % 360}, ${saturation}%, ${lightness + 5}%)`,
    
    // Accent/line color
    accent: `hsl(${(hue + 180) % 360}, 70%, 60%)`,
    accentLight: `hsl(${(hue + 180) % 360}, 70%, 75%)`,
    
    // Text colors
    textPrimary: `hsl(${hue}, 20%, 90%)`,
    textSecondary: `hsl(${hue}, 15%, 65%)`,
    
    // Grid/border
    grid: `hsl(${hue}, 30%, 25%)`,
    
    // CSS variables
    cssVars: {
      '--bg-from': `hsl(${hue}, ${saturation}%, ${lightness}%)`,
      '--bg-to': `hsl(${(hue + 30) % 360}, ${saturation}%, ${lightness + 5}%)`,
      '--accent': `hsl(${(hue + 180) % 360}, 70%, 60%)`,
      '--accent-light': `hsl(${(hue + 180) % 360}, 70%, 75%)`,
      '--text-primary': `hsl(${hue}, 20%, 90%)`,
      '--text-secondary': `hsl(${hue}, 15%, 65%)`,
      '--grid': `hsl(${hue}, 30%, 25%)`,
    }
  }
}

export type Theme = ReturnType<typeof generateTheme>
