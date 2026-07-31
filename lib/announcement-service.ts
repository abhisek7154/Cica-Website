import type { AnnouncementItem } from "@/lib/types";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

interface AnnouncementRow {
  id: string;
  message: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

interface AnnouncementInput {
  message: string;
  displayOrder: number;
  isActive: boolean;
}

const ANNOUNCEMENT_COLUMNS = `
id,
message,
display_order,
is_active,
created_at
`;

function formatSupabaseError(scope: string, message?: string) {
  return new Error(message ? `${scope}: ${message}` : scope);
}

function normalizeMessage(value: string) {
  return value.trim();
}

function toAnnouncementItem(row: AnnouncementRow): AnnouncementItem {
  return {
    id: row.id,
    message: row.message,
    displayOrder: row.display_order,
    isActive: row.is_active,
    createdAt: row.created_at
  };
}

export async function listAnnouncements(): Promise<AnnouncementItem[]> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("announcements")
    .select(ANNOUNCEMENT_COLUMNS)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw formatSupabaseError("Failed to fetch announcements", error.message);
  }

  return (data ?? []).map((row) => toAnnouncementItem(row as AnnouncementRow));
}

export async function listActiveAnnouncements(): Promise<AnnouncementItem[]> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("announcements")
    .select(ANNOUNCEMENT_COLUMNS)
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw formatSupabaseError(
      "Failed to fetch active announcements",
      error.message
    );
  }

  return (data ?? []).map((row) => toAnnouncementItem(row as AnnouncementRow));
}

export async function createAnnouncement(
  input: AnnouncementInput
): Promise<AnnouncementItem> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("announcements")
    .insert({
      message: normalizeMessage(input.message),
      display_order: input.displayOrder,
      is_active: input.isActive
    })
    .select(ANNOUNCEMENT_COLUMNS)
    .single();

  if (error) {
    throw formatSupabaseError("Failed to create announcement", error.message);
  }

  return toAnnouncementItem(data as AnnouncementRow);
}

export async function updateAnnouncement(
  id: string,
  input: AnnouncementInput
): Promise<AnnouncementItem | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("announcements")
    .update({
      message: normalizeMessage(input.message),
      display_order: input.displayOrder,
      is_active: input.isActive
    })
    .eq("id", id)
    .select(ANNOUNCEMENT_COLUMNS)
    .maybeSingle();

  if (error) {
    throw formatSupabaseError("Failed to update announcement", error.message);
  }

  if (!data) {
    return null;
  }

  return toAnnouncementItem(data as AnnouncementRow);
}

export async function deleteAnnouncement(id: string): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("announcements")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    throw formatSupabaseError("Failed to delete announcement", error.message);
  }

  return Boolean(data);
}
