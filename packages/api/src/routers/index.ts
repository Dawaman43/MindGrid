import { protectedProcedure, publicProcedure, router } from "../index";
import { edgeRouter } from "./edge";
import { gridRouter } from "./grid";
import { nodeRouter } from "./node";
import { projectRouter } from "./project";
import { tagRouter } from "./tag";
import { workspaceRouter } from "./workspace";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  workspace: workspaceRouter,
  project: projectRouter,
  grid: gridRouter,
  node: nodeRouter,
  edge: edgeRouter,
  tag: tagRouter,
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
});
export type AppRouter = typeof appRouter;
