import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { todoItemSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

// POST create a new todo item
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const parsed = todoItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // Verify the list belongs to the user
  const list = await db.todoList.findFirst({
    where: { id: parsed.data.todoListId, userId: session.user.id },
  });

  if (!list) {
    return new NextResponse("List not found", { status: 404 });
  }

  const item = await db.todoItem.create({
    data: {
      title: parsed.data.title,
      todoListId: parsed.data.todoListId,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
