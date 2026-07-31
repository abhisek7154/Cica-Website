"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { NoticeItem, NoticeType } from "@/lib/types";

type ToastType = "success" | "error";

interface ConfirmState {
  title: string;
  message: string;
  confirmLabel: string;
  action: () => Promise<void> | void;
}

interface AdminNoticesProps {
  apiRequest: <T,>(url: string, init?: RequestInit) => Promise<T>;
  addToast: (type: ToastType, message: string) => void;
  requestConfirm: (next: ConfirmState) => void;
}

const noticeTypes: NoticeType[] = [
  "general",
  "holiday",
  "exam",
  "admission"
];

const noticeTypeClasses: Record<NoticeType, string> = {
  general: "bg-blue-50 text-blue-700 border-blue-200",
  holiday: "bg-emerald-50 text-emerald-700 border-emerald-200",
  exam: "bg-amber-50 text-amber-700 border-amber-200",
  admission: "bg-rose-50 text-rose-700 border-rose-200"
};

const initialForm = {
  title: "",
  content: "",
  date: "",
  type: "general" as NoticeType
};

export function AdminNotices({
  apiRequest,
  addToast,
  requestConfirm
}: AdminNoticesProps) {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);

  const loadNotices = useCallback(async () => {
    setLoading(true);

    try {
      const payload = await apiRequest<{ notices?: NoticeItem[] }>("/api/notices", {
        cache: "no-store"
      });

      setNotices(payload.notices ?? []);
    } catch (error) {
      addToast(
        "error",
        error instanceof Error ? error.message : "Unable to load notices."
      );
    } finally {
      setLoading(false);
    }
  }, [addToast, apiRequest]);

  useEffect(() => {
    void loadNotices();
  }, [loadNotices]);

  function resetForm() {
    setEditingId(null);
    setForm(initialForm);
  }

  function startEdit(item: NoticeItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      content: item.content,
      date: item.date,
      type: item.type
    });
  }

  async function saveNotice() {
    if (!form.title.trim() || !form.content.trim() || !form.date) {
      addToast("error", "Title, content, and date are required.");
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await apiRequest(`/api/notices/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        });

        addToast("success", "Notice updated.");
      } else {
        await apiRequest("/api/notices", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        });

        addToast("success", "Notice added.");
      }

      resetForm();
      await loadNotices();
    } catch (error) {
      addToast(
        "error",
        error instanceof Error ? error.message : "Unable to save notice."
      );
    } finally {
      setSaving(false);
    }
  }

  function removeNotice(id: string) {
    requestConfirm({
      title: "Delete Notice",
      message: "This notice will be removed from the homepage notice section.",
      confirmLabel: "Delete",
      action: async () => {
        try {
          const payload = await apiRequest<{ message?: string }>(`/api/notices/${id}`, {
            method: "DELETE"
          });

          if (editingId === id) {
            resetForm();
          }

          setNotices((current) => current.filter((item) => item.id !== id));
          addToast("success", payload.message ?? "Notice deleted.");
        } catch (error) {
          addToast(
            "error",
            error instanceof Error ? error.message : "Unable to delete notice."
          );
        }
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold">Homepage Notices</h2>
        <p className="mt-2 text-slate-600">
          Add and update the notices shown on the homepage notice board.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                title: event.target.value
              }))
            }
            placeholder="Notice title"
            className="min-h-[44px] rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
          />

          <input
            type="date"
            value={form.date}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                date: event.target.value
              }))
            }
            className="min-h-[44px] rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
          />

          <select
            value={form.type}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                type: event.target.value as NoticeType
              }))
            }
            className="min-h-[44px] rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
          >
            {noticeTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <div className="flex items-center rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-600">
            Notices appear on the homepage after save.
          </div>

          <textarea
            value={form.content}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                content: event.target.value
              }))
            }
            placeholder="Notice content"
            rows={5}
            className="md:col-span-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={saveNotice}
            disabled={saving}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving
              ? editingId
                ? "Updating..."
                : "Saving..."
              : editingId
                ? "Update Notice"
                : "Add Notice"}
          </button>

          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-slate-300 px-5 py-2 text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          [0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-xl bg-slate-200"
            />
          ))
        ) : notices.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
            No notices found.
          </p>
        ) : (
          notices.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.15em] ${noticeTypeClasses[item.type]}`}
                    >
                      {item.type}
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(item.date)}
                    </span>
                  </div>

                  <h3 className="mt-3 text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-600">
                    {item.content}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="inline-flex min-h-[36px] items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => removeNotice(item.id)}
                    className="inline-flex min-h-[36px] items-center gap-1 rounded-md border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
