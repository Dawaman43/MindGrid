import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { eq, and } from "drizzle-orm";

import { member, workspace } from "@MindGrid/db/schema";

import { protectedProcedure, router } from "../index";
import { requireWorkspaceAdmin } from "./rbac";

export const workspaceRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const rows = await ctx.db
      .select({
        id: workspace.id,
        name: workspace.name,
        role: member.role,
      })
      .from(workspace)
      .innerJoin(member, eq(member.workspaceId, workspace.id))
      .where(and(eq(member.userId, userId), eq(member.isActive, true)));
    return rows;
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const workspaceId = randomUUID();
      await ctx.db.insert(workspace).values({
        id: workspaceId,
        name: input.name,
      });
      await ctx.db.insert(member).values({
        workspaceId,
        userId,
        role: "owner",
      });
      return {
        id: workspaceId,
        name: input.name,
        role: "owner",
      };
    }),
  update: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().min(1),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const [membership] = await ctx.db
        .select({ role: member.role })
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
      const [updated] = await ctx.db
        .update(workspace)
        .set({ name: input.name })
        .where(eq(workspace.id, input.workspaceId))
        .returning({
          id: workspace.id,
          name: workspace.name,
          updatedAt: workspace.updatedAt,
        });
      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workspace not found.",
        });
      }
      return updated;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const [membership] = await ctx.db
        .select({ role: member.role })
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
      await ctx.db.delete(workspace).where(eq(workspace.id, input.workspaceId));
      return { id: input.workspaceId };
    }),
  ensureMembership: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const existing = await ctx.db
        .select({ workspaceId: member.workspaceId })
        .from(member)
        .where(and(eq(member.workspaceId, input.workspaceId), eq(member.userId, userId)))
        .limit(1);
      if (existing.length > 0) {
        return { workspaceId: input.workspaceId };
      }
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You do not have access to this workspace.",
      });
    }),
});
