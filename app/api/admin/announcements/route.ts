import { NextRequest, NextResponse } from "next/server";
import {
  createAnnouncement,
  deleteAnnouncement,
  listAnnouncements,
  updateAnnouncement
} from "@/lib/announcement-service";
import {
  announcementSchema,
  announcementUpdateSchema
} from "@/lib/validation";

export const runtime = "nodejs";

export async function GET() {
  try {
    const announcements = await listAnnouncements();
    return NextResponse.json({ announcements });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to load announcements."
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const parsed = announcementSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message:
            parsed.error.issues[0]?.message ?? "Invalid announcement payload."
        },
        { status: 400 }
      );
    }

    const announcement = await createAnnouncement(parsed.data);
    return NextResponse.json({
      message: "Announcement created successfully.",
      announcement
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to create announcement."
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await request.json();
    const parsed = announcementUpdateSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message:
            parsed.error.issues[0]?.message ?? "Invalid announcement payload."
        },
        { status: 400 }
      );
    }

    const announcement = await updateAnnouncement(parsed.data.id, parsed.data);

    if (!announcement) {
      return NextResponse.json(
        { message: "Announcement not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Announcement updated successfully.",
      announcement
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to update announcement."
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (typeof id !== "string" || id.trim().length === 0) {
      return NextResponse.json(
        { message: "Announcement ID is required." },
        { status: 400 }
      );
    }

    const deleted = await deleteAnnouncement(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Announcement not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Announcement deleted successfully."
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete announcement."
      },
      { status: 500 }
    );
  }
}
