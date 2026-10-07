ALTER TABLE "payments" ADD COLUMN "provider" text DEFAULT 'Mpesa' NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "provider_transaction_id" text;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "wifi_token" text;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "token_issued_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "activated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "expires_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_wifi_token_unique" UNIQUE("wifi_token");
