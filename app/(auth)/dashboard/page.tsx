"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Plus, Trash2, ListTodo, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { PaywallGate } from "@/components/paywall/paywall-gate";
import { PLAN_LIMITS } from "@/lib/subscription";
import {
  useTodoLists,
  useCreateTodoList,
  useDeleteTodoList,
  useCreateTodoItem,
  useToggleTodoItem,
  useDeleteTodoItem,
} from "@/hooks/use-todo-lists";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [newListName, setNewListName] = useState("");
  const [newItemTitles, setNewItemTitles] = useState<Record<string, string>>({});

  const { data: lists, isLoading } = useTodoLists();
  const createList = useCreateTodoList();
  const deleteList = useDeleteTodoList();
  const createItem = useCreateTodoItem();
  const toggleItem = useToggleTodoItem();
  const deleteItem = useDeleteTodoItem();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
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

  function handleCreateList(e: React.FormEvent) {
    e.preventDefault();
    if (!newListName.trim()) return;
    createList.mutate(newListName.trim());
    setNewListName("");
  }

  function handleCreateItem(listId: string) {
    const title = newItemTitles[listId]?.trim();
    if (!title) return;
    createItem.mutate({ title, todoListId: listId });
    setNewItemTitles((prev) => ({ ...prev, [listId]: "" }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minhas Listas</h1>
          <p className="text-sm text-gray-500">
            {listCount} lista{listCount !== 1 ? "s" : ""} criada{listCount !== 1 ? "s" : ""}
            {userPlan === "FREE" && ` de ${freeLimit}`}
          </p>
        </div>
      </div>

      {/* Create new list */}
      <PaywallGate
        featureName="listas"
        currentUsage={listCount}
        limit={freeLimit}
        isBlocked={isAtLimit}
      >
        <form onSubmit={handleCreateList} className="flex gap-2">
          <Input
            placeholder="Nome da nova lista..."
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="max-w-sm"
          />
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={createList.isPending}
          >
            {createList.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            <span className="ml-1">Nova Lista</span>
          </Button>
        </form>
      </PaywallGate>

      {/* Lists */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : lists?.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <ListTodo className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              Nenhuma lista ainda
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Crie sua primeira lista de tarefas acima.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lists?.map((list) => {
            const completedCount = list.items.filter((i) => i.completed).length;
            const totalCount = list.items.length;

            return (
              <Card key={list.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-semibold truncate">
                    {list.name}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">
                      {completedCount}/{totalCount}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-red-500"
                      onClick={() => deleteList.mutate(list.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {/* Items */}
                  {list.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 group"
                    >
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={(checked) =>
                          toggleItem.mutate({
                            itemId: item.id,
                            completed: checked as boolean,
                          })
                        }
                      />
                      <span
                        className={`flex-1 text-sm ${
                          item.completed
                            ? "line-through text-gray-400"
                            : "text-gray-700"
                        }`}
                      >
                        {item.title}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"
                        onClick={() => deleteItem.mutate(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}

                  {/* Add item */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleCreateItem(list.id);
                    }}
                    className="flex gap-1 pt-2"
                  >
                    <Input
                      placeholder="Nova tarefa..."
                      value={newItemTitles[list.id] || ""}
                      onChange={(e) =>
                        setNewItemTitles((prev) => ({
                          ...prev,
                          [list.id]: e.target.value,
                        }))
                      }
                      className="h-8 text-sm"
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={createItem.isPending}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
