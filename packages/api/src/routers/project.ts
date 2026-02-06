import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";

import { member, project } from "@MindGrid/db/schema";

import { protectedProcedure, router } from "../index";
import { normalizePagination, paginationInput } from "./pagination";
import { requireWorkspaceAdmin } from "./rbac";

export const projectRouter = router({
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
          id: project.id,
          name: project.name,
          description: project.description,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        })
        .from(project)
        .innerJoin(member, eq(member.workspaceId, project.workspaceId))
        .where(
          and(
            eq(project.workspaceId, input.workspaceId),
            eq(member.userId, userId),
            eq(member.isActive, true),
          ),
        )
        .orderBy(desc(project.createdAt))
        .limit(limit)
        .offset(offset);
    }),
  update: protectedProcedure
    .input(
      z
        .object({
          projectId: z.string().min(1),
          name: z.string().min(1).optional(),
          description: z.string().optional(),
        })
        .refine((data) => data.name !== undefined || data.description !== undefined, {
          message: "Provide at least one field to update.",
        }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const [membership] = await ctx.db
        .select({ projectId: project.id, role: member.role })
        .from(project)
        .innerJoin(member, eq(member.workspaceId, project.workspaceId))
        .where(
          and(eq(project.id, input.projectId), eq(member.userId, userId), eq(member.isActive, true)),
        )
        .limit(1);
      if (!membership) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this project.",
        });
      }
      requireWorkspaceAdmin(membership.role);
      const [updated] = await ctx.db
        .update(project)
        .set({
          name: input.name,
          description: input.description,
        })
        .where(eq(project.id, input.projectId))
        .returning({
          id: project.id,
          workspaceId: project.workspaceId,
          name: project.name,
          description: project.description,
          updatedAt: project.updatedAt,
        });
      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found.",
        });
      }
      return updated;
    }),
  create: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().min(1),
        name: z.string().min(1),
        description: z.string().optional(),
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
      const projectId = randomUUID();
      await ctx.db.insert(project).values({
        id: projectId,
        workspaceId: input.workspaceId,
        name: input.name,
        description: input.description,
      });
      return {
        id: projectId,
        workspaceId: input.workspaceId,
        name: input.name,
        description: input.description ?? null,
      };
    }),
});
