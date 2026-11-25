import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NAV_ITEMS, findNavItem } from "@/lib/navigation";
import { PlaceholderPage } from "@/components/shell/PlaceholderPage";

type Props = { params: Promise<{ slug: string[] }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return NAV_ITEMS.map((item) => ({ slug: item.href.split("/").filter(Boolean) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = findNavItem(`/${slug.join("/")}`);
  return { title: item ? `${item.label} – Code Gaia (Prototyp)` : "Code Gaia (Prototyp)" };
}

export default async function ModulePlaceholder({ params }: Props) {
  const { slug } = await params;
  const item = findNavItem(`/${slug.join("/")}`);
  if (!item) notFound();
  return <PlaceholderPage item={item} />;
}
