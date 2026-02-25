# Polyglot Powerlifting Branding Guide

This document defines the core visual identity for all three frontend applications (SvelteKit, Flutter, React Native). Our goal is a cohesive, modern, sleek, and premium fitness application aesthetic.

## 1. Color Palette

We are using a clean, high-contrast, modern minimalist theme.

*   **Background (App):** `#F8F9FA` (Soft Light Grey - minimizes eye strain)
*   **Surface Elevation 1 (Cards/Dialogs):** `#FFFFFF` (Pure White - creates a clean container)
*   **Primary Accent:** `#4338CA` (Vibrant Indigo - used for primary buttons, active tabs, and main calls to action)
*   **Primary Text:** `#0F172A` (Slate 900 / Near Black - sharp contrast for maximum legibility)
*   **Muted Text:** `#64748B` (Slate 500 / Grey - used for secondary text, placeholders, and subtle labels)
*   **Success:** `#10B981` (Emerald Green - used for "Lift Saved" or positive outcomes)

*   **Dark Mode Requirements:** All three applications (Svelte, Flutter, React Native) MUST support dynamic system-level Dark Mode.
    *   **Dark Background:** `#020617` (Slate 950)
    *   **Dark Surface:** `#0F172A` (Slate 900)
    *   **Dark Primary Text:** `#F8FAFC` (Slate 50)
    *   *Note: The Primary Accent (`#4338CA`) and Success (`#10B981`) colors remain identical in both light and dark modes to preserve brand identity.*

## 2. Typography

We will use Google Fonts to ensure consistency across web and mobile, focusing on premium, modern geometric sans-serifs.

*   **Headings / Display (H1, H2, H3):** 
    *   Font: **Inter** or **Outfit** (Bold / 700 weight)
    *   Why: Clean, modern, and friendly without losing the structured feel of a data application.
*   **Body / UI Elements (Paragraphs, Labels, Buttons):**
    *   Font: **Inter**
    *   Why: The absolute gold standard for modern UI legibility at small sizes.

## 3. Iconography

To ensure all three apps look identical, we will standardize on a single icon set.

*   **Icon Set:** **Lucide Icons** (formerly Feather Icons)
    *   Why: It has official, well-maintained packages for Svelte (`lucide-svelte`), Flutter (`lucide_icons`), and React Native (`lucide-react-native`). The stroke width is consistent, smooth, and modern.

## 4. Component Styling Rules

*   **Corners:** Friendly, modern rounded corners (`border-radius: 12px` or `16px` for cards, `8px` for buttons).
*   **Shadows:** Soft, diffused drop shadows on cards to create a slight floating effect (e.g., `box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1)`). 
*   **Inputs:** Clean, outlined inputs with a light grey border (`#E2E8F0`). On focus, the border transitions to the Primary Accent (`#4338CA`) with a subtle glow or thickened ring.
