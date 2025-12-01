# Lighthouse Performance Optimization Guide

## ✅ Changes Already Applied

### 1. HTML Optimizations (index.html)
- ✅ Added title: "Winseed - Quality Seeds"
- ✅ Added preconnect to Stockcake CDN
- ✅ Added DNS prefetch for image domains

### 2. CSS Optimizations (index.css)
- ✅ `content-visibility: auto` on all sections → skips rendering off-screen content
- ✅ `contain: layout style paint` → browser isolation for independent rendering
- ✅ Mobile-specific CSS media queries to disable expensive effects
- ✅ `will-change: transform` only on nav (not all elements)
- ✅ Image max-width and height rules to prevent layout shift

## 🎯 Next Steps to Boost Score to 70+

### Step 1: Optimize Image URLs with Size Parameters
Change Stockcake URLs from `_large` to smaller versions. Update in App.tsx (around lines 459, 467, 475, 483):

**Before:**
```jsx
'https://images.stockcake.com/public/1/7/0/17076ac9-fb1c-4a79-ac17-8d02644ea0e8_large/earth-s-orange-treasure-stockcake.jpg'
```

**After (smaller, faster):**
```jsx
'https://images.stockcake.com/public/1/7/0/17076ac9-fb1c-4a79-ac17-8d02644ea0e8_medium/earth-s-orange-treasure-stockcake.jpg'
```

Or if Stockcake supports query params: `?w=600` at the end.

### Step 2: Add Lazy Loading & Decoding to All Images
In VegetableCard.tsx and any other card components showing images, add:

```jsx
<img 
  src={veg.image}
  loading="lazy"
  decoding="async"
  alt={veg.name}
/>
```

### Step 3: Reduce Animation Complexity
In your scroll handlers and FloatingCard:
- Only update transforms on products that are in viewport
- Use `requestAnimationFrame` to batch updates
- Disable complex animations on mobile (already in CSS media query)

### Step 4: Defer Non-Critical JavaScript
In main.jsx or vite.config.ts:
- Lazy-load AppleCardsCarouselDemo and WorldMapDemo (should already be React.lazy)
- Verify they're NOT in main chunk: check Network tab in DevTools

### Step 5: Reduce Unused CSS
- Remove unused Tailwind classes by ensuring purgeable patterns
- Keep only critical animations (fade-in, scroll reveals)

## 🔍 Lighthouse Audit Checklist

Run Lighthouse and check for:
1. **Avoid enormous network payloads** → Images over 1MB? Compress or use smaller resolution.
2. **Reduce unused JavaScript** → Large demo components bundled? Make sure they're lazy.
3. **Minimize main-thread tasks** → Long scroll handlers? Wrap in `requestAnimationFrame`.

## 📊 Expected Improvements
- **Images optimized**: +10-15 points
- **Content visibility**: +5-8 points
- **Lazy loading**: +5-10 points
- **Animation reduction on mobile**: +3-5 points
- **Total potential**: 39 → 65-75 range

## 🚀 Quick Wins (Do First)
1. ✅ Preconnect to image CDNs (DONE)
2. ⏳ Optimize image sizes (50 KB → 30 KB each saves ~200KB)
3. ⏳ Add `loading="lazy"` to all non-hero images
4. ⏳ Verify lazy-loaded components work
5. ⏳ Run Lighthouse again and inspect remaining opportunities

## 📝 Files to Check
- `/src/optimized/VegetableCard.tsx` → Add lazy loading attributes
- `/src/components/ui/apple-cards-carousel-demo.tsx` → Image optimization
- `/src/App.tsx` → Image URLs (consider srcset for responsive images)
