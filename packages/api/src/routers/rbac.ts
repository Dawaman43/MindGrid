import { TRPCError } from "@trpc/server";

export const WORKSPACE_ADMIN_ROLES = ["owner", "admin"] as const;

export type WorkspaceRole = (typeof WORKSPACE_ADMIN_ROLES)[number] | "member";

export const isWorkspaceAdmin = (role?: string | null): role is WorkspaceRole =>
  role === "owner" || role === "admin";

export const requireWorkspaceAdmin = (role?: string | null, message?: string) => {
  if (!isWorkspaceAdmin(role)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: message ?? "You do not have permission to perform this action.",
    });
  }
};
