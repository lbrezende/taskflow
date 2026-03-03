import { auth } from "@/lib/auth";
import { createCustomerPortalSession } from "@/lib/stripe";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth();

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true },
  });

  if (!user?.stripeCustomerId) {
    return new NextResponse("No Stripe customer", { status: 400 });
  }

  try {
    const portalSession = await createCustomerPortalSession(
      user.stripeCustomerId
    );

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Portal error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
