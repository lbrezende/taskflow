"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  Plus,
  Loader2,
  Kanban,
  ChevronDown,
  ChevronRight,
  Star,
  Share2,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PaywallGate } from "@/components/paywall/paywall-gate";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { PLAN_LIMITS } from "@/lib/subscription";
import type { TodoStatus } from "@/lib/validations";
import {
  useTodoLists,
  useCreateTodoList,
  useCreateTodoItem,
  useUpdateItemStatus,
  useDeleteTodoItem,
} from "@/hooks/use-todo-lists";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [newListName, setNewListName] = useState("");
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  const { data: lists, isLoading } = useTodoLists();
  const createList = useCreateTodoList();
  const createItem = useCreateTodoItem();
  const updateStatus = useUpdateItemStatus();
  const deleteItem = useDeleteTodoItem();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#4094F7]" />
      </div>
    );
  }

  if (!session) {
    redirect("/login");
  }

  const userPlan = session.user.plan || "FREE";
  const listCount = lists?.length || 0;
  const freeLimit = PLAN_LIMITS.FREE.todoLists;
  const isAtLimit = userPlan === "FREE" && listCount >= freeLimit;

  const activeList =
    lists?.find((l) => l.id === selectedListId) || lists?.[0] || null;

  function handleCreateList(e: React.FormEvent) {
    e.preventDefault();
    if (!newListName.trim()) return;
    createList.mutate(newListName.trim());
    setNewListName("");
  }

  function handleCreateItem(title: string) {
    if (!activeList) return;
    createItem.mutate({ title, todoListId: activeList.id });
  }

  function handleMoveItem(itemId: string, newStatus: TodoStatus) {
    updateStatus.mutate({ itemId, status: newStatus });
  }

  function handleDeleteItem(itemId: string) {
    deleteItem.mutate(itemId);
  }

  return (
    <div className="flex h-full flex-col">
      {/* Breadcrumbs */}
      <div className="flex items-center px-8 pt-6">
        <div className="flex items-center text-xs leading-4">
          <span className="text-[#6E7C87]">Projects</span>
          <ChevronRight className="mx-0.5 h-4 w-3 text-[#6E7C87]" />
          <span className="text-[#6E7C87]">
            {activeList?.name || "Board"}
          </span>
          <ChevronRight className="mx-0.5 h-4 w-3 text-[#6E7C87]" />
          <span className="text-[#252C32]">Active Sprint</span>
        </div>
      </div>

      {/* Page header */}
      <div className="flex items-center justify-between px-8 pt-3 pb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold leading-8 tracking-[-0.456px] text-black">
            All sprints
          </h1>
          {lists && lists.length > 1 && activeList && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 rounded-md px-2 py-0.5 text-sm text-[#6E7C87] hover:bg-[#F6F8F9]">
                  {activeList.name}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {lists.map((list) => (
                  <DropdownMenuItem
                    key={list.id}
                    onClick={() => setSelectedListId(list.id)}
                    className={
                      list.id === activeList.id ? "font-semibold" : ""
                    }
                  >
                    {list.name}
                    <span className="ml-auto text-xs text-[#9AA6AC]">
                      {list.items.length}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button className="flex h-8 w-8 items-center justify-center rounded-md text-[#6E7C87] hover:bg-[#F6F8F9]">
            <Star className="h-6 w-6" />
          </button>

          <PaywallGate
            featureName="boards"
            currentUsage={listCount}
            limit={freeLimit}
            isBlocked={isAtLimit}
          >
            <form onSubmit={handleCreateList} className="flex gap-2">
              <Input
                placeholder="Novo board..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="h-8 w-36 rounded-md border-[#DDE2E4] text-sm"
              />
              <Button
                type="submit"
                className="h-8 rounded-md bg-[#4094F7] px-3 text-sm font-semibold text-[#F6F8F9] hover:bg-[#0E73F6]"
                disabled={createList.isPending}
              >
                {createList.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span className="ml-1">Criar</span>
              </Button>
            </form>
          </PaywallGate>

          <button className="flex h-8 w-8 items-center justify-center rounded-md text-[#6E7C87] hover:bg-[#F6F8F9]">
            <Share2 className="h-6 w-6" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-md border border-[#DDE2E4] bg-white text-[#6E7C87] hover:bg-[#F6F8F9]">
            <MoreHorizontal className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-4 border-b border-[#E5E9EB] px-8 pb-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9AA6AC]" />
          <input
            type="text"
            placeholder="Search"
            className="h-8 w-[200px] rounded-md border border-[#DDE2E4] bg-white pl-8 pr-3 text-sm leading-6 tracking-[-0.084px] text-[#252C32] placeholder:text-[#9AA6AC] focus:border-[#4094F7] focus:outline-none"
          />
        </div>

        {/* Avatar stack placeholder */}
        <div className="flex -space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#D7EDFF]"
            >
              <span className="text-[10px] font-semibold text-[#0452C8]">
                {["PG", "AB", "CD"][i]}
              </span>
            </div>
          ))}
        </div>

        <button className="rounded-md px-3 py-1 text-sm leading-6 tracking-[-0.084px] text-[#252C32] hover:bg-[#F6F8F9]">
          Only My Issues
        </button>
        <button className="rounded-md px-3 py-1 text-sm leading-6 tracking-[-0.084px] text-[#252C32] hover:bg-[#F6F8F9]">
          Recently Updated
        </button>
        <button className="flex items-center gap-1 rounded-md px-2.5 py-1 text-sm leading-6 tracking-[-0.084px] text-[#252C32] hover:bg-[#F6F8F9]">
          All sprints
          <ChevronDown className="h-5 w-5 text-[#6E7C87]" />
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex flex-1 overflow-hidden px-8 pt-4 pb-4">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#9AA6AC]" />
          </div>
        ) : !activeList ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#DDE2E4] text-center">
            <Kanban className="mb-4 h-12 w-12 text-[#D5DADD]" />
            <h3 className="text-lg font-medium text-[#252C32]">
              Nenhum board ainda
            </h3>
            <p className="mt-1 text-sm text-[#6E7C87]">
              Crie seu primeiro board Kanban acima para organizar suas tarefas.
            </p>
          </div>
        ) : (
          <KanbanBoard
            list={activeList}
            onCreateItem={handleCreateItem}
            onDeleteItem={handleDeleteItem}
            onMoveItem={handleMoveItem}
          />
        )}
      </div>
    </div>
  );
}
