import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDetailLayout from "@/components/ProductDetailLayout";
import ProductInfo from "@/components/ProductInfo";
import PurchasePanel from "@/components/PurchasePanel";
import {
  getCategory,
  getProduct,
  getRelatedProducts,
} from "@/lib/catalog";

interface ProductPageProps {
  params: Promise<{ category: string; id: string }>;
}

export async function generateStaticParams() {
  const { getCatalog } = await import("@/lib/catalog");
  return getCatalog().products.map((p) => ({
    category: p.category,
    id: p.id,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { category, id } = await params;
  const product = getProduct(category, id);
  if (!product) return { title: "Product — Zrochet" };
  return {
    title: product.name + " — Zrochet",
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { category: slug, id } = await params;
  const category = getCategory(slug);
  const product = getProduct(slug, id);

  if (!category || !product) notFound();

  const related = getRelatedProducts(product);

  return (
    <div className="pt-24 pb-16 animate-fade-up">
      <div className="mx-auto max-w-[1400px] px-5">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-text-muted">
          <Link href="/" className="transition hover:text-brown-dark">Home</Link>
          <span>/</span>
          <Link href={`/${slug}`} className="transition hover:text-brown-dark">
            {category.name}
          </Link>
          <span>/</span>
          <span className="font-medium text-brown-dark">{product.name}</span>
        </nav>

        <ProductDetailLayout
          product={product}
          info={<ProductInfo product={product} related={related} />}
          purchase={<PurchasePanel product={product} />}
        />
      </div>
    </div>
  );
}
