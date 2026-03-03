"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { KanbanCard } from "./kanban-card";
import type { TodoItem } from "@/hooks/use-todo-lists";
import type { TodoStatus } from "@/lib/validations";

interface KanbanColumnProps {
  title: string;
  status: TodoStatus;
  items: TodoItem[];
  onDeleteItem: (itemId: string) => void;
  onDragStart: (e: React.DragEvent, itemId: string) => void;
  onDrop: (e: React.DragEvent, status: TodoStatus) => void;
  onCreateItem?: (title: string) => void;
}

export function KanbanColumn({
  title,
  status,
  items,
  onDeleteItem,
  onDragStart,
  onDrop,
  onCreateItem,
}: KanbanColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !onCreateItem) return;
    onCreateItem(newTitle.trim());
    setNewTitle("");
    setIsAdding(false);
  }

  return (
    <div
      className={`flex min-h-0 flex-1 flex-col gap-2 rounded-t-[6px] bg-[#F6F8F9] px-2 py-3 transition-colors ${
        isDragOver ? "ring-2 ring-[#4094F7] ring-inset" : ""
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        setIsDragOver(false);
        onDrop(e, status);
      }}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-semibold uppercase leading-6 tracking-[0.084px] text-[#6E7C87]">
          {title}
        </h3>
        {onCreateItem && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex h-6 w-6 items-center justify-center rounded-md text-[#9AA6AC] hover:bg-[#E5E9EB] hover:text-[#6E7C87]"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Cards */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {onCreateItem && isAdding && (
          <form
            onSubmit={handleSubmit}
            className="rounded-[6px] bg-white p-3 shadow-[0px_0px_1px_0px_rgba(26,32,36,0.32),0px_1px_2px_0px_rgba(91,104,113,0.32)]"
          >
            <input
              autoFocus
              placeholder="Nova tarefa..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={() => {
                if (!newTitle.trim()) setIsAdding(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setNewTitle("");
                  setIsAdding(false);
                }
              }}
              className="w-full text-sm leading-5 tracking-[-0.084px] text-[#252C32] placeholder:text-[#9AA6AC] focus:outline-none"
            />
            <div className="mt-2 flex justify-end gap-1">
              <button
                type="button"
                onClick={() => {
                  setNewTitle("");
                  setIsAdding(false);
                }}
                className="rounded-md px-2 py-1 text-xs text-[#6E7C87] hover:bg-[#F6F8F9]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-md bg-[#4094F7] px-2 py-1 text-xs font-semibold text-white hover:bg-[#0E73F6]"
              >
                Adicionar
              </button>
            </div>
          </form>
        )}

        {items.map((item) => (
          <KanbanCard
            key={item.id}
            item={item}
            onDelete={onDeleteItem}
            onDragStart={onDragStart}
          />
        ))}

        {items.length === 0 && !isAdding && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-xs text-[#9AA6AC]">Arraste tarefas aqui</p>
          </div>
        )}
      </div>
    </div>
  );
}
