import devcook from "@/assets/images/devcook.png";
import chatwithsearch from "@/assets/images/chatwithsearch.png";
import summarization from "@/assets/images/summarization.png";
import CheckIcon from "@/assets/icons/check-circle.svg"
import ArrowUpRightIcon from '@/assets/icons/arrow-up-right.svg'
import { TechIcon } from '@/components/TechIcon'

import Image from "next/image";
import { SectionHeader } from "@/components/SectionHeadet";
import { Card } from "@/components/card";

const portfolioProjects = [
{
technology: "React, Next.js, Python, LLMs, Prompt Engineering, REST APIs",

title: "DevCook",
results: [
{ title: "AI-powered developer assistant for generating and improving code." },
{ title: "Integrated LLMs with prompt engineering for intelligent responses." },
{ title: "Built a responsive interface with modern web technologies." },
],
link: "https://rational-travel-159996.framer.app/",
image: devcook,
},
{
technology: "Python, TensorFlow, Keras, NLP, RNN, LSTM",

title: "AI Search Engine",
results: [
{ title: "Built an NLP model for predicting the next word in a sequence." },
{ title: "Implemented tokenization, word embeddings, and LSTM networks." },
{ title: "Trained a deep learning model using TensorFlow and Keras." },
],
link: "https://searchengine-ruszhtxdtiwrc9y99dag3s.streamlit.app/",
image: chatwithsearch,
},
{
technology: "Python, LangChain, RAG, HuggingFace, ChromaDB, PyMuPDF",

title: "Summarize Text From Website",
results: [
{ title: "Built a RAG-based system for generating JEE-style questions." },
{ title: "Created a knowledge base from previous-year questions and textbooks." },
{ title: "Used embeddings, vector search, and topic mapping for relevant question generation." },
],
link: "https://summarizationytwebsite-medfhys6hfntk3zu2rszpr.streamlit.app/",
image: summarization,
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

                </div>
                <h3 className="font-serif text-2xl mt-2 md:mt-4  md:text-4xl">{project.title}</h3>
                <hr className="border-t-2 border-white/5 mt-4 md:mt-5" />
                <ul className="flex flex-col gap-4 mt-4 md:mt-5">
                  {project.results.map((result, index) => (
                    <li key={index} className="flex gap-2 text-sm md:text-base text-white/50">
                      <TechIcon src={(CheckIcon as any).src ?? (CheckIcon as unknown as string)} className='size-5 md:size-6' bgClass='bg-white' />
                      <span>{result.title}</span></li>
                  ))}
                </ul>
                <a href={project.link}>
                  <button className="bg-white text-gray-950 h-12 w-full rounded-xl font-semibold inline-flex justify-center items-center gap-2 mt-8 md:w-auto md:px-6">
                    <span>Visit Live Site</span>
                    <TechIcon src={(ArrowUpRightIcon as any).src ?? (ArrowUpRightIcon as unknown as string)} className='size-4' bgClass='bg-gray-900' />
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
