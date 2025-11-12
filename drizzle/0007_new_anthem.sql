ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "campaign_image" text;