# Public Assets

This folder contains static assets that are served directly by Next.js.

## Folder Structure

- `/images` - Product images, banners, and general images
  - `/products` - Product images
  - `/banners` - Banner/slider images
  - `/categories` - Category images
  - `/icons` - Icon files

## Usage

Reference images in your code like this:

```tsx
// In components
<Image src="/images/products/product-1.jpg" alt="Product" width={400} height={400} />

// In CSS
background-image: url('/images/banners/banner-1.jpg');
```

## Notes

- Images in this folder are accessible at the root URL (e.g., `/images/logo.png`)
- Use Next.js `Image` component for optimized images
- Recommended formats: WebP, JPEG, PNG
- Keep file sizes optimized for web performance

