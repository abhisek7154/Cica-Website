"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { SlidingTabs } from "@/components/sliding-tabs";
import { Logo } from "@/components/logo";

const heroImages = [
  "/images/New Building.jpeg",
  "/images/indoor_corridor.jpeg",
  "/images/Republic_day.jpeg",
  "/images/X_mas.JPG",
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden">
      {/* Background Images */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            current === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image}
            alt={`Hero ${index + 1}`}
            fill
            priority={index === 0}
            className="object-cover"
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-black/70" />

      {/* Hero Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="max-w-4xl text-center text-white">
          <div className="mx-auto mb-6 flex justify-center">
            <Logo mode="light" variant="hero" size={110} />
          </div>

          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl lg:text-7xl">
            CICA Institute
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-gray-200 md:text-2xl">
            Accredited Training Institute for Professional Computer Education
          </p>
          <SlidingTabs />
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-3 rounded-full transition-all duration-300 ${
              current === index
                ? "w-10 bg-white"
                : "w-3 bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
