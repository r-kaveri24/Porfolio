"use client"

import memojiImage from '@/assets/images/memoji-computer.png'
import grainImage from '@/assets/images/grain.jpg'
import StarIcon from "@/assets/icons/star.svg"
import SparkleIcon from '@/assets/icons/sparkle.svg'
import ArrowDown from '@/assets/icons/arrow-down.svg'
import { TechIcon } from '@/components/TechIcon'
import Image from 'next/image';
import { HeroOrbit } from '@/components/HeroOrbit';
import { useRouter } from 'next/navigation'



export const HeroSection = () => {
  const router = useRouter();

  const handleDownload = () => {

    const downloadLink = 'https://dl.dropboxusercontent.com/scl/fi/aad7kjum8trldeg9rjmut/Kaveri-Raut-7220813813.pdf?rlkey=m7vsaai27mhi0pt8ccy678o2a&st=0fgyzkxi';


    const link = document.createElement('a');
    link.href = downloadLink;
    link.download = 'Kaveri-Raut-Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (<div id='home' className='py-32 md:py-48 lg:py-60 relative z-0 overflow-x-clip'>
    <div className='absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_70%,transparent)] -z-1'>
      <div
        className='absolute inset-0 -z-30 opacity-5'
        style={{
          backgroundImage: `url(${(typeof grainImage === 'string' ? grainImage : (grainImage as any).src)})`
        }}></div>
      <div className='size-[620px] hero-ring'></div>
      <div className='size-[820px] hero-ring'></div>
      <div className='size-[1020px] hero-ring'></div>
      <div className='size-[1220px] hero-ring'></div>
      <HeroOrbit size={430} rotation={-14} orbit orbitDuration='30s' spin spinDuration='3s'>
        <TechIcon src={(SparkleIcon as any).src ?? (SparkleIcon as unknown as string)} className='size-8' bgClass='bg-emerald-300/20' />
      </HeroOrbit>
      <HeroOrbit size={440} rotation={79} orbit orbitDuration='32s' spin spinDuration='3s'>
        <TechIcon src={(SparkleIcon as any).src ?? (SparkleIcon as unknown as string)} className='size-5' bgClass='bg-emerald-300/20' />
      </HeroOrbit>
      <HeroOrbit size={520} rotation={-41} orbit orbitDuration='34s'>
        <div className='size-2 rounded-full bg-emerald-300/20' />
      </HeroOrbit>
      <HeroOrbit size={530} rotation={178} orbit orbitDuration='36s' spin spinDuration='3s'>
        <TechIcon src={(SparkleIcon as any).src ?? (SparkleIcon as unknown as string)} className='size-10' bgClass='bg-emerald-300/20' />
      </HeroOrbit>
      <HeroOrbit size={550} rotation={20} orbit orbitDuration='38s' spin spinDuration='6s'>
        <TechIcon src={(StarIcon as any).src ?? (StarIcon as unknown as string)} className='size-12' bgClass='bg-emerald-300' />
      </HeroOrbit>
      <HeroOrbit size={590} rotation={98} orbit orbitDuration='40s' spin spinDuration='6s'>
        <TechIcon src={(StarIcon as any).src ?? (StarIcon as unknown as string)} className='size-8' bgClass='bg-emerald-300' />
      </HeroOrbit>
      <HeroOrbit size={650} rotation={-5} orbit orbitDuration='42s' spin spinDuration='3s'>
        <TechIcon src={(SparkleIcon as any).src ?? (SparkleIcon as unknown as string)} className='size-14' bgClass='bg-emerald-300/20' />
      </HeroOrbit>
      <HeroOrbit size={710} rotation={144} orbit orbitDuration='44s'>
        <div className='size-2 rounded-full bg-emerald-300/20' />
      </HeroOrbit>
      <HeroOrbit size={720} rotation={85} orbit orbitDuration='46s'>
        <div className='size-3 rounded-full bg-emerald-300/20' />
      </HeroOrbit>
      <HeroOrbit size={800} rotation={-72} orbit orbitDuration='48s' spin spinDuration='6s'>
        <TechIcon src={(StarIcon as any).src ?? (StarIcon as unknown as string)} className='size-28' bgClass='bg-emerald-300' />
      </HeroOrbit>
    </div>
    <div className="container">
      <div className='flex flex-col items-center relative z-8'>
        <Image src={memojiImage} className='size-[100px]' alt="Person peeking from behind laptop" />
        <div className='bg-gray-950 border border-gray-800 px-4 py-1.5 inline-flex items-center gap-4 rounded-lg'>
          <div className='bg-green-500 size-2.5 rounded-full relative'>
            <div className='bg-green-500 absolute inset-0 rounded-full animate-ping-large '></div>
          </div>
          <div className='text-sm font-medium'>Available For the Position</div>
        </div>
      </div>
      <div className='max-w-lg mx-auto'>
        <h1 className='font-serif text-3xl md:text-5xl text-center mt-8 tracking-wide'>Kaveri Raut (FullStack developer)</h1>
        <p className='mt-4 text-center md:text-lg text-white/60'>I specialize in transforming designs into, functional, high-performance web applications. Hoping to do same in industry..</p>
      </div>
      <div className='relative flex flex-col md:flex-row justify-center items-center mt-8 gap-4'>
        <button onClick={handleDownload} className='  inline-flex items-center gap-2 border border-white/15 px-6 h-12 rounded-xl '>
          <span className='font-semibold'>Explore My Resume</span>
          <TechIcon src={(ArrowDown as any).src ?? (ArrowDown as unknown as string)} className='size-4' bgClass='bg-white' />
        </button>
        <a href='#contact'
          className=' w-full inline-flex items-center justify-center min-w-fit gap-2 border sm:w-fit border-white bg-white text-gray-900 h-12 px-6 rounded-xl cursor-pointer '>
          <span>👋</span>
          <span className='font-semibold'>Let&apos;s Connect</span>
        </a>
      </div>
    </div>
  </div>
  )
};
