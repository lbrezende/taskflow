import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

async function getSubscriptionPeriodEnd(
  subscription: Stripe.Subscription
): Promise<Date> {
  // In Stripe SDK v20+, current_period_end was removed from Subscription.
  // We get period_end from the latest invoice instead.
  if (subscription.latest_invoice) {
    const invoiceId =
      typeof subscription.latest_invoice === "string"
        ? subscription.latest_invoice
        : subscription.latest_invoice.id;
    const invoice = await stripe.invoices.retrieve(invoiceId);
    return new Date(invoice.period_end * 1000);
  }
  // Fallback: 30 days from now
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
}

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (!userId) break;

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      const periodEnd = await getSubscriptionPeriodEnd(subscription);

      await db.user.update({
        where: { id: userId },
        data: {
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: periodEnd,
          plan: "PRO",
        },
      });
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      const subDetails = invoice.parent?.subscription_details;
      const subscriptionId = subDetails
        ? typeof subDetails.subscription === "string"
          ? subDetails.subscription
          : subDetails.subscription?.id
        : null;

      if (!subscriptionId) break;

      const subscription =
        await stripe.subscriptions.retrieve(subscriptionId);

      await db.user.update({
        where: { stripeSubscriptionId: subscriptionId },
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(invoice.period_end * 1000),
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      await db.user.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          plan: "FREE",
          stripePriceId: null,
          stripeSubscriptionId: null,
          stripeCurrentPeriodEnd: null,
        },
      });
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const periodEnd = await getSubscriptionPeriodEnd(subscription);

      const data: Record<string, unknown> = {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: periodEnd,
      };

      if (subscription.status === "active") {
        data.plan = "PRO";
      } else if (
        subscription.status === "canceled" ||
        subscription.status === "unpaid"
      ) {
        data.plan = "FREE";
      }

      await db.user.update({
        where: { stripeSubscriptionId: subscription.id },
        data,
      });
      break;
    }
  }

  return new NextResponse(null, { status: 200 });
}
