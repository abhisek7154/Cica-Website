"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Clock,
  GraduationCap,
  BookOpen,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";

import { Course } from "./course-card";
import { siteConfig } from "@/lib/site-config";

interface CourseModalProps {
  course: Course | null;
  open: boolean;
  onClose: () => void;
}

export function CourseModal({
  course,
  open,
  onClose,
}: CourseModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!course) return null;

  const message = encodeURIComponent(
`Hello CICA Institute,

I am interested in the "${course.title}" course.

Please share the admission details.

Thank you.`
  );

  const rawPhone = siteConfig.socials.whatsapp.replace(/\D/g, "");
  const phone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 30,
            }}
            transition={{
              duration: 0.25,
            }}
            onClick={(e) => e.stopPropagation()}
            className="
              relative
              w-full
              max-w-5xl
              max-h-[90vh]
              overflow-y-auto
              rounded-3xl
              bg-white
              shadow-2xl
            "
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="
                absolute
                right-5
                top-5
                z-20
                rounded-full
                bg-white/90
                p-2
                shadow-lg
                transition
                hover:rotate-90
                hover:bg-white
              "
            >
              <X size={22} />
            </button>

            {/* Hero Image */}
            <div className="relative h-72 w-full overflow-hidden">
              <Image
                src={
                  course.imageUrl ||
                  "/images/course-placeholder.jpg"
                }
                alt={course.title}
                fill
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-8 left-8 text-white">
                <h2 className="text-4xl font-bold">
                  {course.title}
                </h2>

                <p className="mt-2 text-lg text-white/90">
                  Professional Computer Training Program
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="space-y-8 p-8">

              {/* Duration & Eligibility */}
              <div className="grid gap-5 md:grid-cols-2">

                <div className="rounded-xl bg-blue-50 p-5">
                  <div className="mb-2 flex items-center gap-3">
                    <Clock className="text-blue-600" />

                    <span className="font-semibold">
                      Duration
                    </span>
                  </div>

                  <p className="text-lg font-medium">
                    {course.duration}
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-5">
                  <div className="mb-2 flex items-center gap-3">
                    <GraduationCap className="text-emerald-600" />

                    <span className="font-semibold">
                      Eligibility
                    </span>
                  </div>

                  <p className="text-lg font-medium">
                    {course.eligibility}
                  </p>
                </div>

              </div>

              {/* Description */}
              <div>

                <h3 className="mb-3 text-2xl font-bold">
                  About this Course
                </h3>

                <p className="leading-8 text-slate-600">
                  {course.description}
                </p>

              </div>

              {/* Course Contents */}
              <div>

                <div className="mb-5 flex items-center gap-3">
                  <BookOpen className="text-blue-600" />

                  <h3 className="text-2xl font-bold">
                    Course Contents
                  </h3>
                </div>

                <div className="grid gap-4 md:grid-cols-2">

                  {course.contents.map((item) => (
                    <div
                      key={item.id}
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        p-4
                      "
                    >
                      <CheckCircle2
                        className="text-green-600"
                        size={20}
                      />

                      <span>{item.title}</span>
                    </div>
                  ))}

                </div>

              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-4 border-t pt-8 md:flex-row">

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex-1
                    rounded-xl
                    bg-green-600
                    py-4
                    text-center
                    text-lg
                    font-semibold
                    text-white
                    transition
                    hover:bg-green-700
                  "
                >
                  <div className="flex items-center justify-center gap-3">
                    <MessageCircle />
                    Enquire on WhatsApp
                  </div>
                </a>

                <button
                  onClick={onClose}
                  className="
                    rounded-xl
                    border
                    border-slate-300
                    px-8
                    py-4
                    font-semibold
                    transition
                    hover:bg-slate-100
                  "
                >
                  Close
                </button>

              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
