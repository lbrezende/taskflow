import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { todoListSchema } from "@/lib/validations";
import { checkUsageLimit } from "@/lib/subscription";
import { NextResponse } from "next/server";

// GET all todo lists for the current user
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const lists = await db.todoList.findMany({
    where: { userId: session.user.id },
    include: {
      items: { orderBy: { position: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(lists);
}

// POST create a new todo list
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const parsed = todoListSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // Check usage limits
  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const listCount = await db.todoList.count({
    where: { userId: session.user.id },
  });

  const limit = checkUsageLimit(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      plan: user.plan,
      trialEndsAt: user.trialEndsAt,
      stripeCustomerId: user.stripeCustomerId,
      stripePriceId: user.stripePriceId,
      stripeSubscriptionId: user.stripeSubscriptionId,
      stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd,
    },
    "todoLists",
    listCount
  );

  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: "Limite atingido",
        limit: limit.limit,
        current: limit.current,
      },
      { status: 403 }
    );
  }

  const list = await db.todoList.create({
    data: {
      name: parsed.data.name,
      userId: session.user.id,
    },
    include: { items: true },
  });

  return NextResponse.json(list, { status: 201 });
}
