ALTER TABLE "departments" ADD CONSTRAINT "departments_code_unique" UNIQUE("code");--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_code_unique" UNIQUE("code");