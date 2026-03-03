import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// DELETE a todo list
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ listId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { listId } = await params;

  const list = await db.todoList.findFirst({
    where: { id: listId, userId: session.user.id },
  });

  if (!list) {
    return new NextResponse("Not found", { status: 404 });
  }

  await db.todoList.delete({ where: { id: listId } });

  return new NextResponse(null, { status: 204 });
}
