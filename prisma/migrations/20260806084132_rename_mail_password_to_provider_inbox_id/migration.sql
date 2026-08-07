-- Plain rename, not drop+add: preserves the 13 existing rows without
-- requiring a default value for a NOT NULL column. Old values (mail.tm
-- passwords) are meaningless now that we've switched providers to
-- Mailslurp, but those rows are all long-expired temp inboxes anyway —
-- nothing reads this column for anything but brand-new "pending" emails.
ALTER TABLE "GeneratedEmail" RENAME COLUMN "mailPassword" TO "providerInboxId";
