"use client"
import scapeFlow from "@/assets/images/scrapeFlow.png";
import drakeStudio from "@/assets/images/drakestudio.png";
import playingMarket from "@/assets/images/playing-market.png";
import mesium from "@/assets/images/mesium.png";
import wingman from "@/assets/images/Wingman.png";
import { SectionHeader } from "@/components/SectionHeadet";
import Image from "next/image";
import { Card } from "@/components/card";
import { Fragment } from "react";

const testimonials = [
  {
    name: "Drake studio",
    src: "https://drake-studio.vercel.app/",
    image: drakeStudio,
  },
  {
    name: "Playing Market",
    src: "https://headphones-webpage.vercel.app/",
    image: playingMarket,

  },
  {
    name: "Scape Flow",
    src: "https://scrap-flow.vercel.app/",
    image: scapeFlow,

  },
  {
    name: "Mesium Website",
    src: "https://museum-website-five.vercel.app/",
    image: mesium,

  },
  {
    name: "Admin Panel",
    src: "https://wingman-assignment-snowy.vercel.app/",
    image: wingman,

  },
];

export const TestimonialsSection = () => {
  return <div className="py-16 lg:py-24">
    <div className="container">
      <SectionHeader eyebrow="All Projects" title="What Projects Say about Me" description="Don&apos;t just take my word for it. See what my project have to say about my work." />
      <div className="mt-16 lg:mt-24 flex overflow-x-clip [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-4 -my-4">
        <div className="flex gap-8 pr-8 flex-none animate-move-left [animation-duration:30s] hover:[animation-play-state:paused]">
          {[...new Array(2)].fill(0).map((_, index) => (
            <Fragment key={index}>
              {testimonials.map(testimonial => (
                <Card key={testimonial.name} className="max-w-xs md:p-8 p-6 md:max-w-md hover:-rotate-3 transition duration-300">
                  <a href={testimonial.src}>
                    <div className="flex flex-col gap-4 items-center justify-between ">
                      <div className="font-semibold">{testimonial.name}</div>
                      <Image src={testimonial.image} alt="drake studio Image" className="rounded-lg border border-white" />
                    </div>
                  </a>
                </Card>
              ))}
            </Fragment>
          ))}

        </div>
      </div>
    </div >
  </div >
};
