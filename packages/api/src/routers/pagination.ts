import { z } from "zod";

export const paginationInput = z.object({
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional(),
});

export const normalizePagination = (
  input?: z.infer<typeof paginationInput>,
): { limit: number; offset: number } => ({
  limit: input?.limit ?? 50,
  offset: input?.offset ?? 0,
});
