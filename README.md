# Amer

A modern, multi-category e-commerce shop built with Next.js, Tailwind CSS, and shadcn/ui.

## Features

- 🎨 Modern, responsive design
- 🛍️ Multi-category shop structure
- 🔍 Centered search bar
- 🎠 Banner slider with auto-play
- 📱 Mobile-friendly navigation
- 🖼️ Placeholder image system for dummy/fallback images
- ⚡ Built with Next.js 14 (App Router)
- 🎨 Styled with Tailwind CSS
- 🧩 UI components from shadcn/ui

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app` - Next.js app router pages and layouts
- `/components` - React components
  - `/ui` - shadcn/ui components (including PlaceholderImage)
- `/lib` - Utility functions (including placeholder image helpers)

## Placeholder Images

The project includes a placeholder image system for handling dummy/fallback images:

- **PlaceholderImage Component** (`components/ui/placeholder-image.tsx`) - A wrapper around Next.js Image that automatically uses placeholder images when no source is provided
- **Placeholder Utilities** (`lib/placeholder.ts`) - Helper functions to generate placeholder image URLs:
  - `getPlaceholderImage()` - Generate custom placeholder images
  - `getCategoryPlaceholder()` - Category-specific placeholders
  - `getBannerPlaceholder()` - Banner placeholders
  - `getProductPlaceholder()` - Product placeholders

Visit `/demo` to see product cards with placeholder images in action.

## Categories

The shop includes the following categories:
- Electronics
- Fashion
- Home & Garden
- Sports
- Automotive Parts & Accessories
- Toys

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **Embla Carousel** - Banner slider

## License

MIT

