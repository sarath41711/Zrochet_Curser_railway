import catalogData from "@/data/catalog.json";
import { TEST_BAG_PRODUCTS } from "./test-product";
import type { Catalog, Product, Category, ProductMedia } from "./types";

type RawProduct = Product & { images?: string[] };

function normalizeProduct(raw: RawProduct): Product {
  let media: ProductMedia[] = raw.media ?? [];

  if (!media.length && raw.images?.length) {
    media = raw.images.map((src, i) => ({
      type: "image" as const,
      src,
      label: "View " + (i + 1),
    }));
  }

  return {
    ...raw,
    media,
    colorVariants: raw.colorVariants ?? [],
    colors: raw.colors ?? [],
    sizes: raw.sizes ?? ["One Size"],
  };
}

const baseCatalog = catalogData as Catalog;
const baseProducts = baseCatalog.products.map(normalizeProduct);

const missingTestProducts = TEST_BAG_PRODUCTS.filter(
  (test) =>
    !baseProducts.some(
      (p) => p.category === test.category && p.id.toUpperCase() === test.id.toUpperCase()
    )
);

const catalog: Catalog = {
  ...baseCatalog,
  products: [...baseProducts, ...missingTestProducts],
};

export function getCatalog(): Catalog {
  return catalog;
}

export function getCategories(): Category[] {
  return catalog.categories;
}

export function getCategory(slug: string): Category | undefined {
  return catalog.categories.find((c) => c.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return catalog.products.filter((p) => p.category === categorySlug);
}

export function getProduct(categorySlug: string, id: string): Product | undefined {
  return catalog.products.find(
    (p) => p.category === categorySlug && p.id.toUpperCase() === id.toUpperCase()
  );
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return catalog.products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

export function getCoverImage(product: Product): string {
  const media = product.media ?? [];
  const image = media.find((m) => m.type === "image");
  return image?.src || media[0]?.poster || media[0]?.src || "/images/placeholder.png";
}

export function getMediaCount(product: Product): number {
  return product.media?.length ?? 0;
}

export function formatPrice(product: Product): string {
  if (product.currency === "INR") {
    return "₹" + product.price.toLocaleString("en-IN");
  }
  return "$" + product.price.toFixed(2);
}

export function formatOriginalPrice(product: Product): string | null {
  if (!product.originalPrice || product.originalPrice <= product.price) return null;
  if (product.currency === "INR") {
    return "₹" + product.originalPrice.toLocaleString("en-IN");
  }
  return "$" + product.originalPrice.toFixed(2);
}

export const SAMPLE_REVIEWS = [
  {
    id: "1",
    author: "Priya M.",
    rating: 5,
    date: "March 2026",
    title: "Absolutely stunning craftsmanship",
    body: "The quality exceeded my expectations. Every stitch is perfect and the bag gets compliments everywhere I go.",
    verified: true,
  },
  {
    id: "2",
    author: "Ananya R.",
    rating: 5,
    date: "February 2026",
    title: "Worth every rupee",
    body: "Beautiful handmade piece. The photos don't do justice — it's even prettier in person. Fast delivery too!",
    verified: true,
  },
  {
    id: "3",
    author: "Sarah K.",
    rating: 4,
    date: "January 2026",
    title: "Lovely bag, unique design",
    body: "Such a unique piece. Slightly smaller than I imagined but perfect for evenings out. Would buy again.",
    verified: true,
  },
];
