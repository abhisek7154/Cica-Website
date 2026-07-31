"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { AnnouncementItem } from "@/lib/types";

interface Props {
  apiRequest: <T>(
    url: string,
    init?: RequestInit
  ) => Promise<T>;

  addToast: (
    type: "success" | "error",
    message: string
  ) => void;

  requestConfirm: (options: {
    title: string;
    message: string;
    confirmLabel: string;
    action: () => Promise<void>;
  }) => void;
}

export function AdminAnnouncementManager(props: Props) {
  const {
    apiRequest,
    addToast,
    requestConfirm
  } = props;

  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const loadAnnouncements = useCallback(async () => {
    setLoading(true);

    try {
      const response = await apiRequest<{
        announcements: AnnouncementItem[];
      }>("/api/admin/announcements");

      setAnnouncements(response.announcements ?? []);
    } catch {
      addToast("error", "Failed to load announcements.");
    } finally {
      setLoading(false);
    }
  }, [apiRequest, addToast]);

  useEffect(() => {
    void loadAnnouncements();
  }, [loadAnnouncements]);

  function resetForm() {
    setEditingId(null);
    setMessage("");
    setDisplayOrder(0);
    setIsActive(true);
  }

  function startEdit(item: AnnouncementItem) {
    setEditingId(item.id);
    setMessage(item.message);
    setDisplayOrder(item.displayOrder);
    setIsActive(item.isActive);
  }

  async function saveAnnouncement() {
    if (!message.trim()) {
      addToast("error", "Message cannot be empty.");
      return;
    }

    setSaving(true);

    try {
      await apiRequest("/api/admin/announcements", {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: editingId ?? undefined,
          message,
          displayOrder,
          isActive
        })
      });

      addToast(
        "success",
        editingId
          ? "Announcement updated."
          : "Announcement created."
      );

      resetForm();
      await loadAnnouncements();
    } catch {
      addToast(
        "error",
        editingId
          ? "Unable to update announcement."
          : "Unable to create announcement."
      );
    } finally {
      setSaving(false);
    }
  }

  function deleteAnnouncement(id: string) {
    requestConfirm({
      title: "Delete Announcement",
      message: "Are you sure you want to delete this announcement?",
      confirmLabel: "Delete",
      action: async () => {
        try {
          await apiRequest("/api/admin/announcements", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ id })
          });

          addToast("success", "Announcement deleted.");

          if (editingId === id) {
            resetForm();
          }

          await loadAnnouncements();
        } catch {
          addToast("error", "Delete failed.");
        }
      }
    });
  }

  async function toggleAnnouncement(item: AnnouncementItem) {
    try {
      await apiRequest("/api/admin/announcements", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: item.id,
          message: item.message,
          displayOrder: item.displayOrder,
          isActive: !item.isActive
        })
      });

      addToast("success", "Announcement updated.");
      await loadAnnouncements();
    } catch {
      addToast("error", "Update failed.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold">
          Homepage Announcement Bar
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Create, edit, reorder, and toggle the announcements shown above the homepage hero.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_140px]">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Announcement message"
            className="rounded-lg border p-3"
          />

          <input
            type="number"
            min={0}
            value={displayOrder}
            onChange={(e) =>
              setDisplayOrder(Number(e.target.value))
            }
            className="rounded-lg border p-3"
          />
        </div>

        <label className="mt-4 inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Show this announcement on the homepage
        </label>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={saveAnnouncement}
            disabled={saving}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving
              ? editingId
                ? "Updating..."
                : "Creating..."
              : editingId
                ? "Update Announcement"
                : "Add Announcement"}
          </button>

          {editingId ? (
            <button
              onClick={resetForm}
              className="rounded-lg border border-slate-300 px-5 py-2 text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow">
        <table className="min-w-full">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="p-3 text-left">Message</th>
              <th className="p-3 text-center">Order</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-6 text-center"
                >
                  Loading...
                </td>
              </tr>
            ) : announcements.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-6 text-center"
                >
                  No announcements found.
                </td>
              </tr>
            ) : (
              announcements.map((item) => (
                <tr
                  key={item.id}
                  className="border-b last:border-0"
                >
                  <td className="p-3">
                    {item.message}
                  </td>

                  <td className="p-3 text-center">
                    {item.displayOrder}
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() =>
                        toggleAnnouncement(item)
                      }
                      className={`rounded-full px-3 py-1 text-sm ${
                        item.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.isActive
                        ? "Active"
                        : "Inactive"}
                    </button>
                  </td>

                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => startEdit(item)}
                        className="inline-flex items-center gap-1 rounded border border-slate-300 px-3 py-1 text-sm text-slate-700 transition hover:bg-slate-50"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteAnnouncement(item.id)
                        }
                        className="inline-flex items-center gap-1 rounded bg-red-600 px-3 py-1 text-white transition hover:bg-red-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
