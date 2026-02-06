CREATE TABLE "user" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "email_verified" boolean DEFAULT false NOT NULL,
  "image" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX "user_email_unique" ON "user" ("email");

CREATE TABLE "session" (
  "id" text PRIMARY KEY NOT NULL,
  "expires_at" timestamp NOT NULL,
  "token" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp NOT NULL,
  "ip_address" text,
  "user_agent" text,
  "user_id" text NOT NULL REFERENCES "user" ("id") ON DELETE cascade
);

CREATE UNIQUE INDEX "session_token_unique" ON "session" ("token");
CREATE INDEX "session_userId_idx" ON "session" ("user_id");

CREATE TABLE "account" (
  "id" text PRIMARY KEY NOT NULL,
  "account_id" text NOT NULL,
  "provider_id" text NOT NULL,
  "user_id" text NOT NULL REFERENCES "user" ("id") ON DELETE cascade,
  "access_token" text,
  "refresh_token" text,
  "id_token" text,
  "access_token_expires_at" timestamp,
  "refresh_token_expires_at" timestamp,
  "scope" text,
  "password" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp NOT NULL
);

CREATE INDEX "account_userId_idx" ON "account" ("user_id");

CREATE TABLE "verification" (
  "id" text PRIMARY KEY NOT NULL,
  "identifier" text NOT NULL,
  "value" text NOT NULL,
  "expires_at" timestamp NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");

CREATE TABLE "workspace" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "member" (
  "workspace_id" text NOT NULL REFERENCES "workspace" ("id") ON DELETE cascade,
  "user_id" text NOT NULL REFERENCES "user" ("id") ON DELETE cascade,
  "role" text DEFAULT 'member' NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  PRIMARY KEY ("workspace_id", "user_id")
);

CREATE INDEX "member_userId_idx" ON "member" ("user_id");

CREATE TABLE "project" (
  "id" text PRIMARY KEY NOT NULL,
  "workspace_id" text NOT NULL REFERENCES "workspace" ("id") ON DELETE cascade,
  "name" text NOT NULL,
  "description" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX "project_workspaceId_idx" ON "project" ("workspace_id");

CREATE TABLE "grid" (
  "id" text PRIMARY KEY NOT NULL,
  "project_id" text NOT NULL REFERENCES "project" ("id") ON DELETE cascade,
  "name" text NOT NULL,
  "layout" text,
  "archived_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX "grid_projectId_idx" ON "grid" ("project_id");

CREATE TABLE "node" (
  "id" text PRIMARY KEY NOT NULL,
  "grid_id" text NOT NULL REFERENCES "grid" ("id") ON DELETE cascade,
  "type" text DEFAULT 'note' NOT NULL,
  "title" text,
  "content" text,
  "position" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX "node_gridId_idx" ON "node" ("grid_id");

CREATE TABLE "edge" (
  "id" text PRIMARY KEY NOT NULL,
  "grid_id" text NOT NULL REFERENCES "grid" ("id") ON DELETE cascade,
  "source_node_id" text NOT NULL REFERENCES "node" ("id") ON DELETE cascade,
  "target_node_id" text NOT NULL REFERENCES "node" ("id") ON DELETE cascade,
  "type" text DEFAULT 'link' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX "edge_gridId_idx" ON "edge" ("grid_id");
CREATE INDEX "edge_sourceNodeId_idx" ON "edge" ("source_node_id");
CREATE INDEX "edge_targetNodeId_idx" ON "edge" ("target_node_id");

CREATE TABLE "tag" (
  "id" text PRIMARY KEY NOT NULL,
  "workspace_id" text NOT NULL REFERENCES "workspace" ("id") ON DELETE cascade,
  "name" text NOT NULL,
  "color" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX "tag_workspaceId_idx" ON "tag" ("workspace_id");

CREATE TABLE "node_tag" (
  "node_id" text NOT NULL REFERENCES "node" ("id") ON DELETE cascade,
  "tag_id" text NOT NULL REFERENCES "tag" ("id") ON DELETE cascade,
  PRIMARY KEY ("node_id", "tag_id")
);

CREATE INDEX "node_tag_tagId_idx" ON "node_tag" ("tag_id");
