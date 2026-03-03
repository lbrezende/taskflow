"use client";

import { useRef } from "react";
import { KanbanColumn } from "./kanban-column";
import type { TodoItem, TodoList } from "@/hooks/use-todo-lists";
import type { TodoStatus } from "@/lib/validations";

const COLUMNS: { title: string; status: TodoStatus }[] = [
  { title: "To do", status: "TODO" },
  { title: "In progress", status: "IN_PROGRESS" },
  { title: "Done", status: "DONE" },
];

interface KanbanBoardProps {
  list: TodoList;
  onCreateItem: (title: string) => void;
  onDeleteItem: (itemId: string) => void;
  onMoveItem: (itemId: string, status: TodoStatus) => void;
}

export function KanbanBoard({
  list,
  onCreateItem,
  onDeleteItem,
  onMoveItem,
}: KanbanBoardProps) {
  const dragItemId = useRef<string | null>(null);

  function handleDragStart(_e: React.DragEvent, itemId: string) {
    dragItemId.current = itemId;
  }

  function handleDrop(_e: React.DragEvent, status: TodoStatus) {
    if (!dragItemId.current) return;
    onMoveItem(dragItemId.current, status);
    dragItemId.current = null;
  }

  function getItemsByStatus(status: TodoStatus): TodoItem[] {
    return list.items.filter((item) => item.status === status);
  }

  return (
    <div className="flex flex-1 gap-[10px] overflow-x-auto">
      {COLUMNS.map((col) => (
        <KanbanColumn
          key={col.status}
          title={col.title}
          status={col.status}
          items={getItemsByStatus(col.status)}
          onDeleteItem={onDeleteItem}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onCreateItem={col.status === "TODO" ? onCreateItem : undefined}
        />
      ))}
    </div>
  );
}
