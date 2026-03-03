import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// PATCH toggle todo item completion
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
    data: { completed: body.completed },
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
