import { auth } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth();

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const checkoutSession = await createCheckoutSession({
      userId: session.user.id,
      email: session.user.email,
      stripeCustomerId: session.user.stripeCustomerId,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
