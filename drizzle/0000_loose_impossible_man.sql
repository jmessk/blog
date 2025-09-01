CREATE TABLE `posts` (
	`post_id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`thumbnail` text,
	`content` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text,
	`deleted_at` text
);
