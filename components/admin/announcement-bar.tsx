"use client";

import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { Megaphone } from "lucide-react";
import type { AnnouncementItem } from "@/lib/types";

interface AnnouncementBarProps {
  announcements: AnnouncementItem[];
}

const COPY_GAP_PX = 64;

const useIsomorphicLayoutEffect =
  typeof window !== "undefined"
    ? useLayoutEffect
    : useEffect;

export function AnnouncementBar({
  announcements
}: AnnouncementBarProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const lastScrollYRef = useRef(0);

  const [repeatCount, setRepeatCount] = useState(1);
  const [isMeasured, setIsMeasured] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const baseAnnouncements = useMemo(
    () => announcements.map((item) => item.message),
    [announcements]
  );

  const repeatedAnnouncements = useMemo(() => {
    return Array.from({ length: repeatCount }, (_, repetitionIndex) => (
      <Fragment key={`repetition-${repetitionIndex}`}>
        {announcements.map((item, itemIndex) => (
          <span
            key={`${item.id}-${repetitionIndex}-${itemIndex}`}
            className="inline-flex items-center gap-3"
          >
            <span className="text-blue-200">*</span>
            <span>{item.message}</span>
          </span>
        ))}
      </Fragment>
    ));
  }, [announcements, repeatCount]);

  useIsomorphicLayoutEffect(() => {
    if (announcements.length === 0) {
      return;
    }

    const container = containerRef.current;
    const measure = measureRef.current;

    if (!container || !measure) {
      return;
    }

    const updateRepeatCount = () => {
      const containerWidth = container.clientWidth;
      const baseWidth = measure.scrollWidth;

      if (containerWidth <= 0 || baseWidth <= 0) {
        return;
      }

      let nextRepeatCount = 1;

      while (
        baseWidth * nextRepeatCount + COPY_GAP_PX <=
        containerWidth
      ) {
        nextRepeatCount += 1;
      }

      setRepeatCount((current) =>
        current === nextRepeatCount ? current : nextRepeatCount
      );
      setIsMeasured(true);
    };

    updateRepeatCount();

    const resizeObserver = new ResizeObserver(() => {
      updateRepeatCount();
    });

    resizeObserver.observe(container);
    resizeObserver.observe(measure);

    return () => {
      resizeObserver.disconnect();
    };
  }, [announcements]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    lastScrollYRef.current = window.scrollY;
    setIsVisible(true);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const previousScrollY = lastScrollYRef.current;

      if (currentScrollY <= 0) {
        setIsVisible(true);
      } else if (currentScrollY > previousScrollY) {
        setIsVisible(false);
      } else if (currentScrollY < previousScrollY) {
        setIsVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (announcements.length === 0) {
    return null;
  }

  return (
    <>
      <div
        className={`fixed inset-x-0 top-0 z-40 border-b border-blue-400/30 bg-blue-700 text-white shadow-lg transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex h-[52px] w-full items-center gap-4 overflow-hidden px-4 lg:px-6">
          <div className="flex shrink-0 items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
            <Megaphone className="h-3.5 w-3.5" />
            <span>Announcements</span>
          </div>

          <div
            ref={containerRef}
            className="announcement-marquee-container relative min-w-0 flex-1 overflow-hidden"
          >
            <div
              className={`announcement-marquee-track flex w-max min-w-max will-change-transform ${
                isMeasured ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="shrink-0 pr-16">
                <div className="flex w-max items-center gap-8 whitespace-nowrap text-[17px] leading-none text-blue-50">
                  {repeatedAnnouncements}
                </div>
              </div>

              <div
                aria-hidden="true"
                className="shrink-0 pr-16"
              >
                <div className="flex w-max items-center gap-8 whitespace-nowrap text-[17px] leading-none text-blue-50">
                  {repeatedAnnouncements}
                </div>
              </div>
            </div>

            <div
              ref={measureRef}
              aria-hidden="true"
              className="pointer-events-none absolute -left-[9999px] top-0 opacity-0"
            >
              <div className="flex w-max items-center gap-8 whitespace-nowrap text-[17px] leading-none">
                {baseAnnouncements.map((message, index) => (
                  <span
                    key={`measure-${index}`}
                    className="inline-flex items-center gap-3"
                  >
                    <span>*</span>
                    <span>{message}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .announcement-marquee-track {
          animation: announcement-marquee-scroll 24s linear infinite;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
        }

        .announcement-marquee-container:hover .announcement-marquee-track {
          animation-play-state: paused;
        }

        @keyframes announcement-marquee-scroll {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }
      `}</style>
    </>
  );
}
