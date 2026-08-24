import { getSetting } from "./siteSettings";

/** Admin-editable via /admin/settings. */
export async function getSupportEmail(): Promise<string> {
  return getSetting("supportEmail");
}

/** Admin-editable via /admin/settings. Digits only, no "+". */
export async function getWhatsappNumber(): Promise<string> {
  return getSetting("whatsappNumber");
}
