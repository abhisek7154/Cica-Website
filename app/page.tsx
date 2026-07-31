import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { AnnouncementBar } from "@/components/admin/announcement-bar";
import { HeroSection } from "@/components/hero-section";
import { NoticeBoard } from "@/components/notice-board";
import { CounterSection } from "@/components/counter-section";
import { CourseSection } from "@/components/course-section";

import { listActiveAnnouncements } from "@/lib/announcement-service";
import { listNotices } from "@/lib/events-notices-service";
import type { AnnouncementItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let announcements: AnnouncementItem[] = [];

  try {
    announcements = await listActiveAnnouncements();
  } catch (error) {
    console.error("Failed to load announcements for homepage", error);
  }

  const notices = await listNotices();

  return (
    <>
      {/* Top Announcement */}
      <AnnouncementBar announcements={announcements} />

      {/* Floating Navbar */}
      <Navbar />

      {/* Hero */}
      <HeroSection />

      {/* Notice Board */}
      <NoticeBoard initialNotices={notices.slice(0, 4)} />

      {/* Counter */}
      <CounterSection />

      {/* Courses */}
      <CourseSection />

      <main id="main-content">
        {/* Future Homepage Sections */}

        {/* Running Course Cards */}

        {/* Course Details */}

        {/* Google Map */}

        {/* Gallery */}

        {/* Testimonials */}

        {/* Contact */}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp */}
      <WhatsAppButton />
    </>
  );
}
