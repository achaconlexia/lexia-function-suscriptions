ALTER TABLE "payments" ALTER COLUMN "gateway_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "type" text NOT NULL;