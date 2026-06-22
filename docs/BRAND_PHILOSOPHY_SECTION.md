Karyamoni: Brand & Philosophy Horizontal Section

1. Objective
   Transform the brand philosophy from static text into an immersive narrative journey using horizontal scroll. This section serves as the "Signature Moment" before the footer, designed to make users pause and engage
   .
2. Layout & Composition
   Pinned Narrative: The section will use a pinned container strategy. As the user scrolls vertically, the page "locks," and the content moves horizontally to reveal the philosophy chapters
   .
   Asymmetric Tension: Each "slide" of the philosophy will avoid centered layouts. We will use a 12-column grid to offset text and imagery, letting some elements bleed off the screen to create visual energy
   .
   Power Lines: Maintain the established vertical alignment edges from the hero section to ensure the transition from vertical to horizontal feels mathematically cohesive
   .
3. Typography: Philosophy as Architecture
   Monumental Scale: Use a 10:1 scale contrast
   .
   Core Slogans: "Precision over Guesswork." / "The Future of Fit." (Large, viewport-filling display type).
   Explanatory Text: Intimate 16px-18px body copy with generous leading
   .
   Overlapping Elements: Let 3D garment fragments or abstract fitting shapes overlap the large typography to create depth
   .
4. Motion & Interaction
   Smooth Scroll Integration: Use Lenis to ensure the horizontal movement feels weighted and physical, not mechanical
   .
   Staggered Text Reveals: As each philosophy chapter enters the viewport, text should reveal word-by-word or line-by-line using custom cubic-bezier(0.16, 1, 0.3, 1) easing
   .
   Visual Affordance: Provide a subtle horizontal progress indicator or a "magnetic" arrow to signal the horizontal interaction
   .
5. Content Chapters (Sample)
   The Problem: "Returns are the hidden cost of fashion." (Dark, Mist background).
   The Vision: "One-click confidence for every shopper." (Paper background, Ink text).
   The Impact: "Reducing waste, one byte at a time." (Accent Lime highlight).
6. The Implementation Prompt for Claude Code
   Use this prompt to guide Claude Code in building the section using your technical stack (Next.js, Tailwind, GSAP/Framer Motion, Lenis)
   .
