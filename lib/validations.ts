import { z } from "zod";

export const todoListSchema = z.object({
  name: z
    .string()
    .min(1, "O nome da lista é obrigatório")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
});

export const todoItemSchema = z.object({
  title: z
    .string()
    .min(1, "O título da tarefa é obrigatório")
    .max(500, "O título deve ter no máximo 500 caracteres"),
  todoListId: z.string().cuid(),
});

export const toggleItemSchema = z.object({
  id: z.string().cuid(),
  completed: z.boolean(),
});

export const deleteItemSchema = z.object({
  id: z.string().cuid(),
});

export type TodoListInput = z.infer<typeof todoListSchema>;
export type TodoItemInput = z.infer<typeof todoItemSchema>;
