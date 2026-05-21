import { notFound } from "next/navigation";

export const metadata = {
  title: "Page not found | Lincies House",
  robots: { index: false, follow: false },
};

export default function HiddenShopPage() {
  notFound();
}
