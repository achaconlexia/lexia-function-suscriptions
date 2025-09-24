CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subscription_id" text,
	"customer_id" text,
	"subject_key" text,
	"user_id" text,
	"workspace_id" text,
	"organization_name" text,
	"plan_key" text,
	"status" text DEFAULT 'active',
	"start_date" timestamp,
	"end_date" timestamp,
	"currency" text DEFAULT 'USD',
	"payment_id" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_subscriptions_user_id" ON "subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_subscriptions_workspace_id" ON "subscriptions" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "idx_subscriptions_subscription_id" ON "subscriptions" USING btree ("subscription_id");--> statement-breakpoint
CREATE INDEX "idx_subscriptions_status" ON "subscriptions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_subscriptions_payment_id" ON "subscriptions" USING btree ("payment_id");