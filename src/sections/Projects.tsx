import scapeFlow from "@/assets/images/scrapeFlow.png";
import drakeStudio from "@/assets/images/drakestudio.png";
import playingMarket from "@/assets/images/playing-market.png";
import CheckIcon from "@/assets/icons/check-circle.svg"
import ArrowUpRightIcon from '@/assets/icons/arrow-up-right.svg'

import Image from "next/image";
import { SectionHeader } from "@/components/SectionHeadet";
import { Card } from "@/components/card";

const portfolioProjects = [
  {
    technology: "Next.js, TypeSciprt, Shad/cn, Tanstack, Prisma",
    year: "Jan 2024",
    title: "Scrap Flow",
    results: [
      { title: "Web scraping with puppeteer." },
      { title: "Implemented the OpenAI." },
      { title: "Automation done easy way." },
    ],
    link: "https://scrap-flow.vercel.app/",
    image: scapeFlow,
  },
  {
    technology: "React, Locomotion, framermotion, styled compoent.",
    year: "Jan 2024",
    title: "Drake Studio",
    results: [
      { title: "Smooth scrolling animation with locomotion." },
      { title: "Customer engaging website with cool ui." },
      { title: "Responsive with all devices." },
    ],
    link: "https://drake-studio.vercel.app/",
    image: drakeStudio,
  },
  {
    technology: "React, tailwind, framermotion,",
    year: "Dec 2023",
    title: "Playing Market",
    results: [
      { title: "Playing Market delivers dynamic, animated shopping." },
      { title: "Hover effects bring titles and cards to life." },
      { title: "Interactive icons add a unique twist to every hover." },
    ],
    link: "https://headphones-webpage.vercel.app/",
    image: playingMarket,
  },
];

export const ProjectsSection = () => {
  return <section id="projects" className="pb-16 lg:py-24 pt-20">
    <div className="container ">
      <SectionHeader eyebrow="Real-world Results" title="Best Three Projects" description="See how I transformed concepts into engaging digital experiences." />
      <div className="flex flex-col mt-10 md:mt-20 gap-20">
        {portfolioProjects.map((project, projectIndex) => (
          <Card key={project.title} className="p-8 pb-0 md:pt-12 md:px-10 lg:pt-16 lg:px-20 sticky"
            style={{
              top: `calc(64px + ${projectIndex * 40}px)`
            }}
          >
            <div className="lg:grid lg:grid-cols-2 lg:gap-16  ">
              <div className="lg:pb-16">
                <div className="bg-gradient-to-r gap-2 from-emerald-300 to-sky-400 inline-flex font-bold uppercase tracking-widest text-sm text-transparent bg-clip-text">
                  <span>{project.technology}</span>
                  <span>{project.year}</span>

                </div>
                <h3 className="font-serif text-2xl mt-2 md:mt-4  md:text-4xl">{project.title}</h3>
                <hr className="border-t-2 border-white/5 mt-4 md:mt-5" />
                <ul className="flex flex-col gap-4 mt-4 md:mt-5">
                  {project.results.map((result, index) => (
                    <li key={index} className="flex gap-2 text-sm md:text-base text-white/50">
                      <CheckIcon className='size-5 md:size-6' />
                      <span>{result.title}</span></li>
                  ))}
                </ul>
                <a href={project.link}>
                  <button className="bg-white text-gray-950 h-12 w-full rounded-xl font-semibold inline-flex justify-center items-center gap-2 mt-8 md:w-auto md:px-6">
                    <span>Visit Live Site</span>
                    <ArrowUpRightIcon className='size-4' />
                  </button>
                </a>
              </div>
              <div className="relative">
                <Image src={project.image} alt={project.title} className="mt-8 -mb-4 md:-mb-0 lg:mt-0 lg:absolute lg:h-full lg:w-auto lg:max-w-none rounded-xl border border-white/70 border-b-0" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  </section>;
};
