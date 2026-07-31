"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Bell,
  Megaphone,
  BarChart3,
  GraduationCap,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  type LucideIcon
} from "lucide-react";

import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminAnnouncementManager } from "./admin-announcement-manager";
import { AdminNotices } from "@/components/admin/admin-notices";
import { AdminStatistics } from "@/components/admin/admin-statistics";
import { AdminCourseManager } from "@/components/admin/admin-course-manager";
import { AdminDocumentsManager } from "@/components/admin/admin-documents-manager";
import { AdminSettings } from "@/components/admin/admin-settings";

type Section =
  | "dashboard"
  | "announcements"
  | "notices"
  | "statistics"
  | "courses"
  | "documents"
  | "settings";

type ToastType = "success" | "error";

interface ConfirmState {
  title: string;
  message: string;
  confirmLabel: string;
  action: () => Promise<void> | void;
}

interface SidebarItem {
  key: Section;
  label: string;
  icon: LucideIcon;
}

const sidebarItems: SidebarItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard
  },
  {
    key: "announcements",
    label: "Announcements",
    icon: Megaphone
  },
  {
    key: "notices",
    label: "Notices",
    icon: Bell
  },
  {
    key: "statistics",
    label: "Statistics",
    icon: BarChart3
  },
  {
    key: "courses",
    label: "Courses",
    icon: GraduationCap
  },
  {
    key: "documents",
    label: "Documents",
    icon: FileText
  },
  {
    key: "settings",
    label: "Settings",
    icon: Settings
  }
];

export function AdminPanel() {
  const [activeSection, setActiveSection] =
    useState<Section>("dashboard");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const [pin, setPin] = useState("");
  const [pinLoading, setPinLoading] = useState(false);
  const [pinError, setPinError] = useState("");

  const [confirmState, setConfirmState] =
    useState<ConfirmState | null>(null);

  const [confirmLoading, setConfirmLoading] =
    useState(false);

  const [toasts, setToasts] = useState<
    {
      id: number;
      type: ToastType;
      message: string;
    }[]
  >([]);

  const addToast = (
    type: ToastType,
    message: string
  ) => {
    const id = Date.now();

    setToasts((current) => [
      ...current,
      {
        id,
        type,
        message
      }
    ]);

    setTimeout(() => {
      setToasts((current) =>
        current.filter((toast) => toast.id !== id)
      );
    }, 3000);
  };

  const requestConfirm = (
    next: ConfirmState
  ) => {
    setConfirmState(next);
  };

  const runConfirmAction = async () => {
    if (!confirmState) return;

    setConfirmLoading(true);

    try {
      await confirmState.action();
      setConfirmState(null);
    } finally {
      setConfirmLoading(false);
    }
  };

  const apiRequest = async <T,>(
    url: string,
    init?: RequestInit
  ): Promise<T> => {
    const response = await fetch(url, init);

    const payload = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        setAuthenticated(false);
      }

      throw new Error(payload.message ?? "Request failed.");
    }

    return payload;
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-72
          transform bg-white shadow-xl transition-transform
          md:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-16 items-center justify-between border-b px-6">
          <h1 className="text-lg font-bold">CICA Admin</h1>

          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        <nav className="space-y-2 p-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.key}
                onClick={() => {
                  setActiveSection(item.key);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
                  activeSection === item.key
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-100"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto border-t p-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-600 hover:bg-red-50">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 md:ml-72">
        <header className="sticky top-0 flex h-16 items-center border-b bg-white px-5">
          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu />
          </button>

          <h2 className="ml-4 text-xl font-semibold">
            {
              sidebarItems.find(
                (item) => item.key === activeSection
              )?.label
            }
          </h2>
        </header>

        <main className="p-6">
          {activeSection === "dashboard" && (
            <AdminDashboard />
          )}

          {activeSection === "announcements" && (
            <AdminAnnouncementManager
              apiRequest={apiRequest}
              addToast={addToast}
              requestConfirm={requestConfirm}
            />
          )}

          {activeSection === "notices" && (
            <AdminNotices
              apiRequest={apiRequest}
              addToast={addToast}
              requestConfirm={requestConfirm}
            />
          )}

          {activeSection === "statistics" && (
            <AdminStatistics />
          )}

          {activeSection === "courses" && (
            <AdminCourseManager
              apiRequest={apiRequest}
              addToast={addToast}
              requestConfirm={requestConfirm}
            />
          )}

          {activeSection === "documents" && (
            <AdminDocumentsManager
              apiRequest={apiRequest}
              addToast={addToast}
              requestConfirm={requestConfirm}
            />
          )}

          {activeSection === "settings" && (
            <AdminSettings />
          )}
        </main>
      </div>
    </div>
  );
}
