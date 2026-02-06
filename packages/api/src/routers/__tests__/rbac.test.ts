import { describe, expect, it } from "bun:test";

import { isWorkspaceAdmin, requireWorkspaceAdmin } from "../rbac";

describe("rbac helpers", () => {
  it("identifies workspace admins", () => {
    expect(isWorkspaceAdmin("owner")).toBe(true);
    expect(isWorkspaceAdmin("admin")).toBe(true);
    expect(isWorkspaceAdmin("member")).toBe(false);
  });

  it("throws for non-admin roles", () => {
    expect(() => requireWorkspaceAdmin("member")).toThrow();
    expect(() => requireWorkspaceAdmin(undefined)).toThrow();
  });
});
