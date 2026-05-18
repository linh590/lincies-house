import { NextResponse } from "next/server";
import { getSiteUrl } from "../../lib/supabase/config";
import { getCourseAmount, getStripe } from "../../lib/stripe";

export async function POST() {
  try {
    const stripe = getStripe();
    const siteUrl = getSiteUrl();

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
            unit_amount: getCourseAmount(),
          },
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      phone_number_collection: {
        enabled: true,
      },
      billing_address_collection: "auto",
      customer_creation: "if_required",
      success_url: `${siteUrl}/login?checkout=success`,
      cancel_url: `${siteUrl}/#pricing`,
      metadata: {
        course: "lincies-house-airbnb-course",
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
