---
name: Frontend Builder
description: Build modern landing page hero sections with animations. Use for homepage designs.
skill_type: Frontend Skill
focus: Layout, Components, Styling, Animations
---

# Hero Section Design

A **Hero Section** is the first visual block of a landing page. Its purpose is to clearly communicate value, grab attention, and drive a single action.

---

## Instructions

### 1. Layout Structure
- Full viewport height (`min-height: 100vh`)
- Horizontally and vertically centered content
- Clear, eye-catching headline as primary focus

### 2. Visual Elements
- Gradient or visually rich background
- Supporting text under headline
- Primary CTA (Call To Action) button
- Optional background shapes or illustrations

### 3. Animations
- Fade-in animation on page load
- Staggered animations for text elements
- Optional parallax effect on scroll
- Smooth scrolling behavior for CTA links

---

## Best Practices
- Keep headline **under 10 words**
- Use **high-contrast text** for readability
- One **clear CTA only**
- Design **mobile-first**
- Avoid heavy animations that impact performance

---

## Example HTML Structure

```html
<section class="hero">
  <div class="hero-content">
    <h1 class="animate-fade-in">Your Headline</h1>
    <p class="animate-fade-in-delay">
      Supporting text that explains the value.
    </p>
    <button class="cta-button">Get Started</button>
  </div>
</section>
