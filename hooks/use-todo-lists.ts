"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type TodoItem = {
  id: string;
  title: string;
  completed: boolean;
  todoListId: string;
  createdAt: string;
  updatedAt: string;
};

type TodoList = {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  items: TodoItem[];
};

export function useTodoLists() {
  return useQuery<TodoList[]>({
    queryKey: ["todo-lists"],
    queryFn: async () => {
      const res = await fetch("/api/todo-lists");
      if (!res.ok) throw new Error("Failed to fetch lists");
      return res.json();
    },
  });
}

export function useCreateTodoList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch("/api/todo-lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.status === 403) {
        const data = await res.json();
        throw new Error(`LIMIT:${data.limit}:${data.current}`);
      }

      if (!res.ok) throw new Error("Failed to create list");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo-lists"] });
      toast.success("Lista criada!");
    },
    onError: (error: Error) => {
      if (error.message.startsWith("LIMIT:")) {
        toast.error("Limite de listas atingido no plano gratuito.");
      } else {
        toast.error("Erro ao criar lista.");
      }
    },
  });
}

export function useDeleteTodoList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listId: string) => {
      const res = await fetch(`/api/todo-lists/${listId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete list");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo-lists"] });
      toast.success("Lista removida.");
    },
    onError: () => {
      toast.error("Erro ao remover lista.");
    },
  });
}

export function useCreateTodoItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      todoListId,
    }: {
      title: string;
      todoListId: string;
    }) => {
      const res = await fetch("/api/todo-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, todoListId }),
      });
      if (!res.ok) throw new Error("Failed to create item");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo-lists"] });
    },
    onError: () => {
      toast.error("Erro ao adicionar tarefa.");
    },
  });
}

export function useToggleTodoItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemId,
      completed,
    }: {
      itemId: string;
      completed: boolean;
    }) => {
      const res = await fetch(`/api/todo-items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      if (!res.ok) throw new Error("Failed to toggle item");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo-lists"] });
    },
  });
}

export function useDeleteTodoItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      const res = await fetch(`/api/todo-items/${itemId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete item");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo-lists"] });
    },
    onError: () => {
      toast.error("Erro ao remover tarefa.");
    },
  });
}
