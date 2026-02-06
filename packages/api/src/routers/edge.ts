import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { and, desc, eq, inArray } from "drizzle-orm";

import { edge, grid, member, node, project } from "@MindGrid/db/schema";

import { protectedProcedure, router } from "../index";
import { normalizePagination, paginationInput } from "./pagination";

export const edgeRouter = router({
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
          id: edge.id,
          gridId: edge.gridId,
          sourceNodeId: edge.sourceNodeId,
          targetNodeId: edge.targetNodeId,
          type: edge.type,
          createdAt: edge.createdAt,
        })
        .from(edge)
        .innerJoin(grid, eq(grid.id, edge.gridId))
        .innerJoin(project, eq(project.id, grid.projectId))
        .innerJoin(member, eq(member.workspaceId, project.workspaceId))
        .where(
          and(
            eq(edge.gridId, input.gridId),
            eq(member.userId, userId),
            eq(member.isActive, true),
          ),
        )
        .orderBy(desc(edge.createdAt))
        .limit(limit)
        .offset(offset);
    }),
  create: protectedProcedure
    .input(
      z
        .object({
          gridId: z.string().min(1),
          sourceNodeId: z.string().min(1),
          targetNodeId: z.string().min(1),
          type: z.string().optional(),
        })
        .refine((data) => data.sourceNodeId !== data.targetNodeId, {
          message: "Source and target nodes must be different.",
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
      const nodes = await ctx.db
        .select({ id: node.id })
        .from(node)
        .where(
          and(
            eq(node.gridId, input.gridId),
            inArray(node.id, [input.sourceNodeId, input.targetNodeId]),
          ),
        );
      if (nodes.length !== 2) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Source and target nodes must belong to the same grid.",
        });
      }
      const edgeId = randomUUID();
      await ctx.db.insert(edge).values({
        id: edgeId,
        gridId: input.gridId,
        sourceNodeId: input.sourceNodeId,
        targetNodeId: input.targetNodeId,
        type: input.type ?? "link",
      });
      return {
        id: edgeId,
        gridId: input.gridId,
        sourceNodeId: input.sourceNodeId,
        targetNodeId: input.targetNodeId,
        type: input.type ?? "link",
      };
    }),
  delete: protectedProcedure
    .input(
      z.object({
        edgeId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const membership = await ctx.db
        .select({ edgeId: edge.id })
        .from(edge)
        .innerJoin(grid, eq(grid.id, edge.gridId))
        .innerJoin(project, eq(project.id, grid.projectId))
        .innerJoin(member, eq(member.workspaceId, project.workspaceId))
        .where(
          and(eq(edge.id, input.edgeId), eq(member.userId, userId), eq(member.isActive, true)),
        )
        .limit(1);
      if (membership.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this edge.",
        });
      }
      await ctx.db.delete(edge).where(eq(edge.id, input.edgeId));
      return { id: input.edgeId };
    }),
});
