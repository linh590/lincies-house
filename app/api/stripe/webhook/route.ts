import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSiteUrl, supabaseAnonKey, supabaseUrl } from "../../../lib/supabase/config";
import { createEmailClient, createServiceClient } from "../../../lib/supabase/admin";
import { getStripe } from "../../../lib/stripe";

export const runtime = "nodejs";

async function activateStudent(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const supabaseAdmin = createServiceClient();

  const { data: existingStudent, error: lookupError } = await supabaseAdmin
    .from("students")
    .select("id")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (lookupError) throw lookupError;

  if (existingStudent) {
    const { error } = await supabaseAdmin.from("students").update({ status: "active" }).eq("id", existingStudent.id);
    if (error) throw error;
  } else {
    const { error } = await supabaseAdmin.from("students").insert({ email: normalizedEmail, status: "active" });

    // Some early Supabase Table Editor setups accidentally leave the numeric id defaulting to 1
    // instead of a real identity/sequence. Keep checkout fulfillment working by falling back to
    // the next id when that schema issue appears.
    if (error?.code === "23505" && String(error.message ?? "").includes("students_pkey")) {
      const { data: latestStudent, error: latestError } = await supabaseAdmin
        .from("students")
        .select("id")
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestError) throw latestError;

      const nextId = Number(latestStudent?.id ?? 0) + 1;
      const { error: retryError } = await supabaseAdmin
        .from("students")
        .insert({ id: nextId, email: normalizedEmail, status: "active" });
      if (retryError) throw retryError;
    } else if (error) {
      throw error;
    }
  }

  if (supabaseUrl && supabaseAnonKey) {
    const supabaseEmail = createEmailClient();
    const { error } = await supabaseEmail.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/learn`,
      },
    });

    if (error) {
      // Payment access is still granted. Log the email issue so chị can resend login manually if needed.
      console.error("post_purchase_login_email_error", error.message);
    }
  }
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  const body = await request.text();

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid Stripe webhook";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email ?? session.customer_email;

    if (!email) {
      console.error("stripe_checkout_missing_email", session.id);
      return NextResponse.json({ received: true, warning: "missing_email" });
    }

    await activateStudent(email);
  }

  return NextResponse.json({ received: true });
}
