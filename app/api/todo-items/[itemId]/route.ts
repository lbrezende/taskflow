import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateItemStatusSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

// PATCH update todo item status/position
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { itemId } = await params;
  const body = await req.json();
  const parsed = updateItemStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // Verify the item belongs to the user via its list
  const item = await db.todoItem.findFirst({
    where: {
      id: itemId,
      todoList: { userId: session.user.id },
    },
  });

  if (!item) {
    return new NextResponse("Not found", { status: 404 });
  }

  const updated = await db.todoItem.update({
    where: { id: itemId },
    data: {
      status: parsed.data.status,
      ...(parsed.data.position !== undefined && { position: parsed.data.position }),
    },
  });

  return NextResponse.json(updated);
}

// DELETE a todo item
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { itemId } = await params;

  const item = await db.todoItem.findFirst({
    where: {
      id: itemId,
      todoList: { userId: session.user.id },
    },
  });

  if (!item) {
    return new NextResponse("Not found", { status: 404 });
  }

  await db.todoItem.delete({ where: { id: itemId } });

  return new NextResponse(null, { status: 204 });
}
