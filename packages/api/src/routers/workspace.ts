import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { eq, and } from "drizzle-orm";

import { member, workspace } from "@MindGrid/db/schema";

import { protectedProcedure, router } from "../index";

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
