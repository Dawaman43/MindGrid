import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { and, eq } from "drizzle-orm";

import { grid, member, project } from "@MindGrid/db/schema";

import { protectedProcedure, router } from "../index";

export const gridRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return ctx.db
        .select({
          id: grid.id,
          name: grid.name,
          layout: grid.layout,
          archivedAt: grid.archivedAt,
          createdAt: grid.createdAt,
          updatedAt: grid.updatedAt,
        })
        .from(grid)
        .innerJoin(project, eq(project.id, grid.projectId))
        .innerJoin(member, eq(member.workspaceId, project.workspaceId))
        .where(
          and(
            eq(grid.projectId, input.projectId),
            eq(member.userId, userId),
            eq(member.isActive, true),
          ),
        );
    }),
  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1),
        name: z.string().min(1),
        layout: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const membership = await ctx.db
        .select({ workspaceId: project.workspaceId })
        .from(project)
        .innerJoin(member, eq(member.workspaceId, project.workspaceId))
        .where(
          and(
            eq(project.id, input.projectId),
            eq(member.userId, userId),
            eq(member.isActive, true),
          ),
        )
        .limit(1);
      if (membership.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this project.",
        });
      }
      const gridId = randomUUID();
      await ctx.db.insert(grid).values({
        id: gridId,
        projectId: input.projectId,
        name: input.name,
        layout: input.layout,
      });
      return {
        id: gridId,
        projectId: input.projectId,
        name: input.name,
        layout: input.layout ?? null,
      };
    }),
});
