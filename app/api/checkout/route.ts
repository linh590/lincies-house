import { NextResponse } from "next/server";
import { getSiteUrl } from "../../lib/supabase/config";
import { getStripe } from "../../lib/stripe";

const PROMO_DISCOUNTS: Record<string, number> = {
  LINCIES100: 10000,
  LINCIES50: 5000,
};

const PACKAGES = {
  course: {
    amount: 49700,
    name: "Package 1: Khóa học Airbnb Lincies House",
    description: "Quyền truy cập khóa học Airbnb thực chiến bằng tiếng Việt",
  },
  coaching: {
    amount: 59700,
    name: "Package 2: Khóa học + 3 buổi 1:1 với Linh",
    description: "Khóa học Airbnb Lincies House kèm 3 buổi coaching 1:1",
  },
  premium: {
    amount: 499900,
    name: "Package 3: Premium support Lincies House",
    description: "Khóa học, tham gia miễn phí các khóa học của Linh, hỗ trợ tối đa 10 listings hoặc 3 properties của chính học viên, co-host/support 1 năm và support trọn đời khi cần",
  },
} as const;

type PackageKey = keyof typeof PACKAGES;

function normalizePromoCode(value: FormDataEntryValue | null) {
  return String(value ?? "").trim().toUpperCase().replace(/\s+/g, "");
}

function getSelectedPackage(value: FormDataEntryValue | null): PackageKey {
  const key = String(value ?? "course").trim().toLowerCase();
  if (key === "coaching" || key === "premium" || key === "course") {
    return key;
  }
  return "course";
}

export async function POST(request: Request) {
  try {
    const stripe = getStripe();
    const siteUrl = getSiteUrl();
    const formData = await request.formData().catch(() => null);
    const selectedPackageKey = getSelectedPackage(formData?.get("package") ?? null);
    const selectedPackage = PACKAGES[selectedPackageKey];
    const enteredPromoCode = normalizePromoCode(formData?.get("promoCode") ?? null);
    const promoDiscountCents = PROMO_DISCOUNTS[enteredPromoCode] ?? 0;
    const promoApplied = promoDiscountCents > 0;
    const checkoutAmount = promoApplied ? Math.max(selectedPackage.amount - promoDiscountCents, 100) : selectedPackage.amount;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: selectedPackage.name,
              description: selectedPackage.description,
            },
            unit_amount: checkoutAmount,
          },
          quantity: 1,
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      billing_address_collection: "auto",
      customer_creation: "if_required",
      success_url: `${siteUrl}/login?checkout=success`,
      cancel_url: `${siteUrl}/#pricing`,
      metadata: {
        course: "lincies-house-airbnb-course",
        package: selectedPackageKey,
        package_name: selectedPackage.name,
        promo_code: promoApplied ? enteredPromoCode : "",
        discount_cents: promoApplied ? String(promoDiscountCents) : "0",
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe did not return a checkout URL." }, { status: 500 });
    }

    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error("checkout_error", error);
    return NextResponse.json({ error: "Checkout is not configured yet." }, { status: 500 });
  }
}
