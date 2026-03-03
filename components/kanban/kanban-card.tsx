"use client";

import { Trash2, Bookmark, ChevronUp } from "lucide-react";
import type { TodoItem } from "@/hooks/use-todo-lists";

interface KanbanCardProps {
  item: TodoItem;
  onDelete: (itemId: string) => void;
  onDragStart: (e: React.DragEvent, itemId: string) => void;
}

export function KanbanCard({ item, onDelete, onDragStart }: KanbanCardProps) {
  // Generate a short task ID from the item id
  const shortId = `TF-${item.id.slice(-3).toUpperCase()}`;

  // Generate initials from the title for the avatar
  const initials = item.title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item.id)}
      className="group flex w-full cursor-grab flex-col gap-3 rounded-[6px] bg-white p-4 shadow-[0px_0px_1px_0px_rgba(26,32,36,0.32),0px_1px_2px_0px_rgba(91,104,113,0.32)] transition-shadow hover:shadow-[0px_0px_1px_0px_rgba(26,32,36,0.32),0px_2px_4px_0px_rgba(91,104,113,0.32)] active:cursor-grabbing active:opacity-80"
    >
      {/* Title */}
      <p className="text-sm font-normal leading-5 tracking-[-0.084px] text-[#252C32]">
        {item.title}
      </p>

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        {/* Left: status icons + story points */}
        <div className="flex items-center gap-[2px]">
          <Bookmark className="h-6 w-6 text-[#47D16C]" />
          <ChevronUp className="h-6 w-6 text-[#F76659]" />
          <div className="flex items-center rounded-xl bg-[#E5E9EB] px-2">
            <span className="text-sm font-semibold leading-6 tracking-[-0.084px] text-[#252C32]">
              {item.position + 1}
            </span>
          </div>
        </div>

        {/* Right: task ID + avatar + delete */}
        <div className="flex items-center gap-1">
          <span className="text-sm leading-5 tracking-[-0.084px] text-[#6E7C87]">
            {shortId}
          </span>
          <div className="relative flex h-6 w-6 items-center justify-center rounded-xl bg-[#D7EDFF]">
            <span className="text-[10px] font-semibold leading-4 text-[#0452C8]">
              {initials}
            </span>
            <div className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-[4px] border-2 border-white bg-[#47D16C]" />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="flex h-6 w-6 items-center justify-center rounded-md text-[#9AA6AC] opacity-0 transition-opacity hover:text-[#F76659] group-hover:opacity-100"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
