import { describe, expect, it } from "bun:test";

import { normalizePagination, paginationInput } from "../pagination";

describe("pagination helpers", () => {
  it("normalizes defaults when no input is provided", () => {
    expect(normalizePagination()).toEqual({ limit: 50, offset: 0 });
  });

  it("normalizes provided values", () => {
    expect(normalizePagination({ limit: 10, offset: 20 })).toEqual({ limit: 10, offset: 20 });
  });

  it("validates input bounds", () => {
    const result = paginationInput.safeParse({ limit: 200, offset: -1 });
    expect(result.success).toBe(false);
  });
});
