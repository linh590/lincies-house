import { NextResponse } from "next/server";
import { getSiteUrl } from "../../lib/supabase/config";
import { getCourseAmount, getStripe } from "../../lib/stripe";

const PROMO_CODE = "LINCIES100";
const PROMO_DISCOUNT_CENTS = 10000;

function normalizePromoCode(value: FormDataEntryValue | null) {
  return String(value ?? "").trim().toUpperCase().replace(/\s+/g, "");
}

export async function POST(request: Request) {
  try {
    const stripe = getStripe();
    const siteUrl = getSiteUrl();
    const formData = await request.formData().catch(() => null);
    const enteredPromoCode = normalizePromoCode(formData?.get("promoCode") ?? null);
    const promoApplied = enteredPromoCode === PROMO_CODE;
    const courseAmount = getCourseAmount();
    const checkoutAmount = promoApplied ? Math.max(courseAmount - PROMO_DISCOUNT_CENTS, 100) : courseAmount;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Khóa học Airbnb Lincies House",
              description: "Quyền truy cập khóa học Airbnb thực chiến bằng tiếng Việt",
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
        promo_code: promoApplied ? PROMO_CODE : "",
        discount_cents: promoApplied ? String(PROMO_DISCOUNT_CENTS) : "0",
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
