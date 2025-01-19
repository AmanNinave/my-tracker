CREATE TABLE IF NOT EXISTS "eventTaskData" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"planned_start_time" timestamp NOT NULL,
	"planned_end_time" timestamp,
	"actual_start_time" timestamp,
	"actual_end_time" timestamp,
	"category" text NOT NULL,
	"sub_category" text,
	"status" text,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"remark" text,
	"rating" integer,
	"breaks" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "tasks";