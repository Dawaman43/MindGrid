import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";

import { grid, member, project } from "@MindGrid/db/schema";

import { protectedProcedure, router } from "../index";
import { normalizePagination, paginationInput } from "./pagination";
import { requireWorkspaceAdmin } from "./rbac";

export const gridRouter = router({
  list: protectedProcedure
    .input(
      z
        .object({
          projectId: z.string().min(1),
        })
        .merge(paginationInput),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { limit, offset } = normalizePagination(input);
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
        )
        .orderBy(desc(grid.createdAt))
        .limit(limit)
        .offset(offset);
    }),
  update: protectedProcedure
    .input(
      z
        .object({
          gridId: z.string().min(1),
          name: z.string().min(1).optional(),
          layout: z.string().optional(),
        })
        .refine((data) => data.name !== undefined || data.layout !== undefined, {
          message: "Provide at least one field to update.",
        }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const [membership] = await ctx.db
        .select({ gridId: grid.id, role: member.role })
        .from(grid)
        .innerJoin(project, eq(project.id, grid.projectId))
        .innerJoin(member, eq(member.workspaceId, project.workspaceId))
        .where(
          and(eq(grid.id, input.gridId), eq(member.userId, userId), eq(member.isActive, true)),
        )
        .limit(1);
      if (!membership) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this grid.",
        });
      }
      requireWorkspaceAdmin(membership.role);
      const [updated] = await ctx.db
        .update(grid)
        .set({
          name: input.name,
          layout: input.layout,
        })
        .where(eq(grid.id, input.gridId))
        .returning({
          id: grid.id,
          projectId: grid.projectId,
          name: grid.name,
          layout: grid.layout,
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
  archive: protectedProcedure
    .input(
      z.object({
        gridId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const [membership] = await ctx.db
        .select({ gridId: grid.id, role: member.role })
        .from(grid)
        .innerJoin(project, eq(project.id, grid.projectId))
        .innerJoin(member, eq(member.workspaceId, project.workspaceId))
        .where(
          and(eq(grid.id, input.gridId), eq(member.userId, userId), eq(member.isActive, true)),
        )
        .limit(1);
      if (!membership) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this grid.",
        });
      }
      requireWorkspaceAdmin(membership.role);
      const [updated] = await ctx.db
        .update(grid)
        .set({
          archivedAt: new Date(),
        })
        .where(eq(grid.id, input.gridId))
        .returning({
          id: grid.id,
          archivedAt: grid.archivedAt,
        });
      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Grid not found.",
        });
      }
      return updated;
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
      const [membership] = await ctx.db
        .select({ workspaceId: project.workspaceId, role: member.role })
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
      if (!membership) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this project.",
        });
      }
      requireWorkspaceAdmin(membership.role);
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
