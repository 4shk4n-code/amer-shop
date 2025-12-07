# Product Images Folder

Place your product images here!

## How to Add Products from Images

1. **Place your images** in this folder (`public/images/products/`)
   - You can organize them in subfolders if you want
   - Supported formats: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`

2. **Run the import script:**
   ```bash
   node scripts/add-products-from-images.js
   ```

3. **The script will:**
   - Scan all images in this folder
   - Group images with similar names as the same product
   - Create products in the database automatically
   - Set default prices and categories

## Customizing Products

Edit `scripts/add-products-from-images.js` to customize:
- Default category ID
- Default prices
- Stock quantities
- Product descriptions

## Image Naming Tips

- Images with similar names will be grouped together
  - `product-1.jpg`, `product-2.jpg` → Same product with multiple images
  - `coffee-beans.jpg` → Single product
  
- The first image becomes the primary/featured image

## Example

If you have:
- `coffee-arabica.jpg`
- `coffee-arabica-detail.jpg`
- `coffee-robusta.jpg`

The script will create:
- Product: "Coffee Arabica" (with 2 images)
- Product: "Coffee Robusta" (with 1 image)

