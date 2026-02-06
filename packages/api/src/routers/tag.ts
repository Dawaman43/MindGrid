import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";

import { grid, member, node, nodeTag, project, tag } from "@MindGrid/db/schema";

import { protectedProcedure, router } from "../index";
import { normalizePagination, paginationInput } from "./pagination";
import { requireWorkspaceAdmin } from "./rbac";

export const tagRouter = router({
  list: protectedProcedure
    .input(
      z
        .object({
          workspaceId: z.string().min(1),
        })
        .merge(paginationInput),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { limit, offset } = normalizePagination(input);
      return ctx.db
        .select({
          id: tag.id,
          name: tag.name,
          color: tag.color,
        })
        .from(tag)
        .innerJoin(member, eq(member.workspaceId, tag.workspaceId))
        .where(
          and(
            eq(tag.workspaceId, input.workspaceId),
            eq(member.userId, userId),
            eq(member.isActive, true),
          ),
        )
        .orderBy(desc(tag.createdAt))
        .limit(limit)
        .offset(offset);
    }),
  create: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().min(1),
        name: z.string().min(1),
        color: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const [membership] = await ctx.db
        .select({ workspaceId: member.workspaceId, role: member.role })
        .from(member)
        .where(
          and(
            eq(member.workspaceId, input.workspaceId),
            eq(member.userId, userId),
            eq(member.isActive, true),
          ),
        )
        .limit(1);
      if (!membership) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this workspace.",
        });
      }
      requireWorkspaceAdmin(membership.role);
      const tagId = randomUUID();
      await ctx.db.insert(tag).values({
        id: tagId,
        workspaceId: input.workspaceId,
        name: input.name,
        color: input.color,
      });
      return {
        id: tagId,
        workspaceId: input.workspaceId,
        name: input.name,
        color: input.color ?? null,
      };
    }),
  assign: protectedProcedure
    .input(
      z.object({
        nodeId: z.string().min(1),
        tagId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const [tagRow] = await ctx.db
        .select({ workspaceId: tag.workspaceId, role: member.role })
        .from(tag)
        .innerJoin(member, eq(member.workspaceId, tag.workspaceId))
        .where(
          and(eq(tag.id, input.tagId), eq(member.userId, userId), eq(member.isActive, true)),
        )
        .limit(1);
      if (!tagRow) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this tag.",
        });
      }
      requireWorkspaceAdmin(tagRow.role);
      const nodeAccess = await ctx.db
        .select({ nodeId: node.id })
        .from(node)
        .innerJoin(grid, eq(grid.id, node.gridId))
        .innerJoin(project, eq(project.id, grid.projectId))
        .where(and(eq(node.id, input.nodeId), eq(project.workspaceId, tagRow.workspaceId)))
        .limit(1);
      if (nodeAccess.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Node must belong to the same workspace as the tag.",
        });
      }
      await ctx.db.insert(nodeTag).values({
        nodeId: input.nodeId,
        tagId: input.tagId,
      });
      return { nodeId: input.nodeId, tagId: input.tagId };
    }),
  remove: protectedProcedure
    .input(
      z.object({
        nodeId: z.string().min(1),
        tagId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const [membership] = await ctx.db
        .select({ workspaceId: tag.workspaceId, role: member.role })
        .from(tag)
        .innerJoin(member, eq(member.workspaceId, tag.workspaceId))
        .where(
          and(eq(tag.id, input.tagId), eq(member.userId, userId), eq(member.isActive, true)),
        )
        .limit(1);
      if (!membership) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this tag.",
        });
      }
      requireWorkspaceAdmin(membership.role);
      await ctx.db
        .delete(nodeTag)
        .where(and(eq(nodeTag.nodeId, input.nodeId), eq(nodeTag.tagId, input.tagId)));
      return { nodeId: input.nodeId, tagId: input.tagId };
    }),
});
