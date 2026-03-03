import { z } from "zod";

export const todoStatusEnum = z.enum(["TODO", "IN_PROGRESS", "DONE"]);

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

export const updateItemStatusSchema = z.object({
  status: todoStatusEnum,
  position: z.number().int().min(0).optional(),
});

export type TodoListInput = z.infer<typeof todoListSchema>;
export type TodoItemInput = z.infer<typeof todoItemSchema>;
export type TodoStatus = z.infer<typeof todoStatusEnum>;
