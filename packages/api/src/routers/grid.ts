import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { and, eq } from "drizzle-orm";

import { grid, member, project } from "@MindGrid/db/schema";

import { protectedProcedure, router } from "../index";
import { requireWorkspaceAdmin } from "./rbac";

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
  update: protectedProcedure
    .input(
      z.object({
        gridId: z.string().min(1),
        name: z.string().min(1).optional(),
        layout: z.string().optional().nullable(),
        archivedAt: z.string().datetime().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const [membership] = await ctx.db
        .select({ role: member.role })
        .from(grid)
        .innerJoin(project, eq(project.id, grid.projectId))
        .innerJoin(member, eq(member.workspaceId, project.workspaceId))
        .where(
          and(
            eq(grid.id, input.gridId),
            eq(member.userId, userId),
            eq(member.isActive, true),
          ),
        )
        .limit(1);
      if (!membership) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this grid.",
        });
      }
      const updates: { name?: string; layout?: string | null; archivedAt?: Date | null } = {};
      if (input.name !== undefined) {
        updates.name = input.name;
      }
      if (input.layout !== undefined) {
        updates.layout = input.layout;
      }
      if (input.archivedAt !== undefined) {
        updates.archivedAt = input.archivedAt ? new Date(input.archivedAt) : null;
      }
      if (Object.keys(updates).length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Provide at least one field to update.",
        });
      }
      const [updated] = await ctx.db
        .update(grid)
        .set(updates)
        .where(eq(grid.id, input.gridId))
        .returning({
          id: grid.id,
          projectId: grid.projectId,
          name: grid.name,
          layout: grid.layout,
          archivedAt: grid.archivedAt,
          updatedAt: grid.updatedAt,
        });
      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Grid not found.",
        });
      }
      return updated;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        gridId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const [membership] = await ctx.db
        .select({ role: member.role })
        .from(grid)
        .innerJoin(project, eq(project.id, grid.projectId))
        .innerJoin(member, eq(member.workspaceId, project.workspaceId))
        .where(
          and(
            eq(grid.id, input.gridId),
            eq(member.userId, userId),
            eq(member.isActive, true),
          ),
        )
        .limit(1);
      if (!membership) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this grid.",
        });
      }
      requireWorkspaceAdmin(membership.role);
      await ctx.db.delete(grid).where(eq(grid.id, input.gridId));
      return { id: input.gridId };
    }),
});
