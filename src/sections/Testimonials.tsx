"use client"
import summarization from "@/assets/images/summarization.png";
import chatwithsearch from "@/assets/images/chatwithsearch.png";
import playingMarket from "@/assets/images/playing-market.png";
import mesium from "@/assets/images/mesium.png";
import devcook from "@/assets/images/devcook.png"
import { SectionHeader } from "@/components/SectionHeadet";
import Image from "next/image";
import { Card } from "@/components/card";
import { Fragment } from "react";

const testimonials = [
  {
    name: "JEE Question Generator",
    src: "YOUR_JEE_PROJECT_LINK",
    image: mesium,
  },
  {
    name: "Next Word Prediction",
    src: "YOUR_NEXT_WORD_PROJECT_LINK",
    image: playingMarket,
  },
  {
    name: "AI Search Engine",
    src: "https://searchengine-ruszhtxdtiwrc9y99dag3s.streamlit.app/",
    image: chatwithsearch,
  },
  {
    name: "Summarize Text From Website",
    src: "https://summarizationytwebsite-medfhys6hfntk3zu2rszpr.streamlit.app/",
    image: summarization,
  },
  {
    name: "DevCook",
    src: "https://devcook.app/",
    image: devcook,
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
