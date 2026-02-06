import { relations } from "drizzle-orm";
import { boolean, index, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth";

export const workspace = pgTable("workspace", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const member = pgTable(
  "member",
  {
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: text("role").notNull().default("member"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.workspaceId, table.userId] }),
    index("member_userId_idx").on(table.userId),
  ],
);

export const project = pgTable(
  "project",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("project_workspaceId_idx").on(table.workspaceId)],
);

export const grid = pgTable(
  "grid",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    layout: text("layout"),
    archivedAt: timestamp("archived_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("grid_projectId_idx").on(table.projectId)],
);

export const node = pgTable(
  "node",
  {
    id: text("id").primaryKey(),
    gridId: text("grid_id")
      .notNull()
      .references(() => grid.id, { onDelete: "cascade" }),
    type: text("type").notNull().default("note"),
    title: text("title"),
    content: text("content"),
    position: text("position"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("node_gridId_idx").on(table.gridId)],
);

export const edge = pgTable(
  "edge",
  {
    id: text("id").primaryKey(),
    gridId: text("grid_id")
      .notNull()
      .references(() => grid.id, { onDelete: "cascade" }),
    sourceNodeId: text("source_node_id")
      .notNull()
      .references(() => node.id, { onDelete: "cascade" }),
    targetNodeId: text("target_node_id")
      .notNull()
      .references(() => node.id, { onDelete: "cascade" }),
    type: text("type").notNull().default("link"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("edge_gridId_idx").on(table.gridId),
    index("edge_sourceNodeId_idx").on(table.sourceNodeId),
    index("edge_targetNodeId_idx").on(table.targetNodeId),
  ],
);

export const tag = pgTable(
  "tag",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    color: text("color"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("tag_workspaceId_idx").on(table.workspaceId)],
);

export const nodeTag = pgTable(
  "node_tag",
  {
    nodeId: text("node_id")
      .notNull()
      .references(() => node.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.nodeId, table.tagId] }),
    index("node_tag_tagId_idx").on(table.tagId),
  ],
);

export const workspaceRelations = relations(workspace, ({ many }) => ({
  members: many(member),
  projects: many(project),
}));

export const memberRelations = relations(member, ({ one }) => ({
  workspace: one(workspace, {
    fields: [member.workspaceId],
    references: [workspace.id],
  }),
  user: one(user, {
    fields: [member.userId],
    references: [user.id],
  }),
}));

export const projectRelations = relations(project, ({ one, many }) => ({
  workspace: one(workspace, {
    fields: [project.workspaceId],
    references: [workspace.id],
  }),
  grids: many(grid),
}));

export const gridRelations = relations(grid, ({ one }) => ({
  project: one(project, {
    fields: [grid.projectId],
    references: [project.id],
  }),
}));

export const nodeRelations = relations(node, ({ one, many }) => ({
  grid: one(grid, {
    fields: [node.gridId],
    references: [grid.id],
  }),
  edgesFrom: many(edge, { relationName: "edgeSource" }),
  edgesTo: many(edge, { relationName: "edgeTarget" }),
  tags: many(nodeTag),
}));

export const edgeRelations = relations(edge, ({ one }) => ({
  grid: one(grid, {
    fields: [edge.gridId],
    references: [grid.id],
  }),
  sourceNode: one(node, {
    fields: [edge.sourceNodeId],
    references: [node.id],
    relationName: "edgeSource",
  }),
  targetNode: one(node, {
    fields: [edge.targetNodeId],
    references: [node.id],
    relationName: "edgeTarget",
  }),
}));

export const tagRelations = relations(tag, ({ one, many }) => ({
  workspace: one(workspace, {
    fields: [tag.workspaceId],
    references: [workspace.id],
  }),
  nodes: many(nodeTag),
}));

export const nodeTagRelations = relations(nodeTag, ({ one }) => ({
  node: one(node, {
    fields: [nodeTag.nodeId],
    references: [node.id],
  }),
  tag: one(tag, {
    fields: [nodeTag.tagId],
    references: [tag.id],
  }),
}));
