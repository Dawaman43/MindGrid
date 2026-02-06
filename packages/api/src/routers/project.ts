import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { and, eq } from "drizzle-orm";

import { member, project } from "@MindGrid/db/schema";

import { protectedProcedure, router } from "../index";

export const projectRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
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
        );
    }),
  update: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const membership = await ctx.db
        .select({ projectId: project.id })
        .from(project)
        .innerJoin(member, eq(member.workspaceId, project.workspaceId))
        .where(
          and(eq(project.id, input.projectId), eq(member.userId, userId), eq(member.isActive, true)),
        )
        .limit(1);
      if (membership.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this project.",
        });
      }
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
      const membership = await ctx.db
        .select({ workspaceId: member.workspaceId })
        .from(member)
        .where(
          and(
            eq(member.workspaceId, input.workspaceId),
            eq(member.userId, userId),
            eq(member.isActive, true),
          ),
        )
        .limit(1);
      if (membership.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this workspace.",
        });
      }
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
