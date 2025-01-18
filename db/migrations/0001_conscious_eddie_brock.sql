ALTER TABLE "events" ADD COLUMN "type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "planned_start_time" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "planned_end_time" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "actual_start_time" timestamp;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "actual_end_time" timestamp;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "category" text NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "sub_category" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "remark" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "rating" integer;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "breaks" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN IF EXISTS "date";