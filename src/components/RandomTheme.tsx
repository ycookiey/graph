'use client'

export function generateRandomHue(): number {
  return Math.floor(Math.random() * 360)
}

export function generateTheme() {
  const hue = generateRandomHue()
  const saturation = 60 + Math.random() * 20
  const lightness = 15 + Math.random() * 10 // 15-25% for dark backgrounds
  
  return {
    bgFrom: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    bgTo: `hsl(${(hue + 30) % 360}, ${saturation}%, ${lightness + 5}%)`,
    
    accent: `hsl(${(hue + 180) % 360}, 70%, 60%)`,
    accentLight: `hsl(${(hue + 180) % 360}, 70%, 75%)`,
    
    textPrimary: `hsl(${hue}, 20%, 90%)`,
    textSecondary: `hsl(${hue}, 15%, 65%)`,
    
    grid: `hsl(${hue}, 30%, 25%)`,
    
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
