import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";

import { grid, member, node, project } from "@MindGrid/db/schema";

import { protectedProcedure, router } from "../index";
import { normalizePagination, paginationInput } from "./pagination";

const nodeInput = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  position: z.string().optional(),
  type: z.string().optional(),
});

export const nodeRouter = router({
  list: protectedProcedure
    .input(
      z
        .object({
          gridId: z.string().min(1),
        })
        .merge(paginationInput),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { limit, offset } = normalizePagination(input);
      return ctx.db
        .select({
          id: node.id,
          gridId: node.gridId,
          type: node.type,
          title: node.title,
          content: node.content,
          position: node.position,
          createdAt: node.createdAt,
          updatedAt: node.updatedAt,
        })
        .from(node)
        .innerJoin(grid, eq(grid.id, node.gridId))
        .innerJoin(project, eq(project.id, grid.projectId))
        .innerJoin(member, eq(member.workspaceId, project.workspaceId))
        .where(
          and(
            eq(node.gridId, input.gridId),
            eq(member.userId, userId),
            eq(member.isActive, true),
          ),
        )
        .orderBy(desc(node.createdAt))
        .limit(limit)
        .offset(offset);
    }),
  create: protectedProcedure
    .input(
      z.object({
        gridId: z.string().min(1),
        ...nodeInput.shape,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const membership = await ctx.db
        .select({ gridId: grid.id })
        .from(grid)
        .innerJoin(project, eq(project.id, grid.projectId))
        .innerJoin(member, eq(member.workspaceId, project.workspaceId))
        .where(
          and(eq(grid.id, input.gridId), eq(member.userId, userId), eq(member.isActive, true)),
        )
        .limit(1);
      if (membership.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this grid.",
        });
      }
      const nodeId = randomUUID();
      await ctx.db.insert(node).values({
        id: nodeId,
        gridId: input.gridId,
        title: input.title,
        content: input.content,
        position: input.position,
        type: input.type ?? "note",
      });
      return {
        id: nodeId,
        gridId: input.gridId,
        title: input.title ?? null,
        content: input.content ?? null,
        position: input.position ?? null,
        type: input.type ?? "note",
      };
    }),
  update: protectedProcedure
    .input(
      z.object({
        nodeId: z.string().min(1),
        ...nodeInput.shape,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const membership = await ctx.db
        .select({ nodeId: node.id })
        .from(node)
        .innerJoin(grid, eq(grid.id, node.gridId))
        .innerJoin(project, eq(project.id, grid.projectId))
        .innerJoin(member, eq(member.workspaceId, project.workspaceId))
        .where(and(eq(node.id, input.nodeId), eq(member.userId, userId), eq(member.isActive, true)))
        .limit(1);
      if (membership.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this node.",
        });
      }
      const [updated] = await ctx.db
        .update(node)
        .set({
          title: input.title,
          content: input.content,
          position: input.position,
          type: input.type,
        })
        .where(eq(node.id, input.nodeId))
        .returning({
          id: node.id,
          gridId: node.gridId,
          type: node.type,
          title: node.title,
          content: node.content,
          position: node.position,
          updatedAt: node.updatedAt,
        });
      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Node not found.",
        });
      }
      return updated;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        nodeId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const membership = await ctx.db
        .select({ nodeId: node.id })
        .from(node)
        .innerJoin(grid, eq(grid.id, node.gridId))
        .innerJoin(project, eq(project.id, grid.projectId))
        .innerJoin(member, eq(member.workspaceId, project.workspaceId))
        .where(and(eq(node.id, input.nodeId), eq(member.userId, userId), eq(member.isActive, true)))
        .limit(1);
      if (membership.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this node.",
        });
      }
      await ctx.db.delete(node).where(eq(node.id, input.nodeId));
      return { id: input.nodeId };
    }),
});
