import ArrowUp from '@/assets/icons/arrow-up-right.svg'
import { TechIcon } from '@/components/TechIcon'

const footerLinks = [
  {
    title: "LinkdIN",
    link: "https://www.linkedin.com/in/kaveri-raut-7a4945255?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_apps",
  },
  {
    title: "Twitter",
    link: "https://x.com/KaveriRaut16194",
  },
  {
    title: "Github",
    link: "https://github.com/r-kaveri24",
  },
  {
    title: "Best Project",
    link: "https://scrap-flow.vercel.app/",
  },
]

export const Footer = () => {
  return <footer className='relative z-5 overflow-x-clip'>
    <div className='absolute -z-10 h-[400px] w-[1600px] bottom-0 left-1/2 -translate-x-1/2 bg-emerald-300/30 [mask-image:radial-gradient(50%_50%_at_bottom_center,black,transparent)] '></div>
    <div className="container">
      <div className='border-t border-white/15 py-6 text-sm flex flex-col md:flex-row md:justify-between items-center gap-8'>
        <div className='text-white/40'>&copy; 2025. All rights reserved.</div>
        <nav className='flex flex-col md:flex-row items-center gap-8'>
          {footerLinks.map(link => (
            <a href={link.link} key={link.title} className='inline-flex items-center gap-1.5 cursor-pointer'>
              <span className='font-semibold'>{link.title}</span>
              <TechIcon src={(ArrowUp as any).src ?? (ArrowUp as unknown as string)} className='size-4' bgClass='bg-white' />
            </a>
          ))}
        </nav>
      </div>
    </div>
  </footer>;
};
