import { protectedProcedure, publicProcedure, router } from "../index";
import { gridRouter } from "./grid";
import { projectRouter } from "./project";
import { workspaceRouter } from "./workspace";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  workspace: workspaceRouter,
  project: projectRouter,
  grid: gridRouter,
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
});
export type AppRouter = typeof appRouter;
