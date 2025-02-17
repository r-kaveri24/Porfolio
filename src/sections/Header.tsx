"use client"
import Link from "next/link";
import { useState, useEffect } from "react";

export const Header = () => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "projects", "about", "contact"];
      const scrollPosition = window.scrollY + window.innerHeight;

      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const sectionTop = element.offsetTop;
          const sectionHeight = element.offsetHeight;

          const sectionMiddle = sectionTop + sectionHeight;

          if (
            scrollPosition >= sectionMiddle - sectionHeight / 4 &&
            scrollPosition <= sectionMiddle + sectionHeight / 4
          ) {
            setActiveSection(section);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex justify-center items-center fixed top-3 w-full z-50">
      <nav className="flex gap-1 p-0.5 border border-white/15 bg-white/10 backdrop-blur rounded-full">
        <Link
          href="#home"
          className={`nav-item ${activeSection === "home" ? "bg-white text-gray-900" : ""}`}
        >
          Home
        </Link>
        <Link
          href="#projects"
          className={`nav-item ${activeSection === "projects" ? "bg-white text-gray-900" : ""}`}
        >
          Projects
        </Link>
        <Link
          href="#about"
          className={`nav-item ${activeSection === "about" ? "bg-white text-gray-900" : ""}`}
        >
          About
        </Link>
        <Link
          href="#contact"
          className={`nav-item ${activeSection === "contact" ? "bg-white text-gray-900" : ""}`}
        >
          Contact
        </Link>
      </nav>
    </div>
  );
};
