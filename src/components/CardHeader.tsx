import StarIcon from '@/assets/icons/star.svg'
import { TechIcon } from '@/components/TechIcon'
import { twMerge } from 'tailwind-merge';
export const CardHeader = ({ discription, title, className }: { title: string; discription: string; className?: string; }) => {
    return (
        <>
            <div className={twMerge("flex flex-col p-6 md:py-8 md:px-10", className)}>
                <div className="inline-flex items-center gap-2">
                    <TechIcon src={(StarIcon as any).src ?? (StarIcon as unknown as string)} className='size-9' bgClass='bg-gradient-to-r from-emerald-300 to-sky-400' />
                    <h3 className="font-sarif text-3xl">{title}</h3>
                </div>
                <p className="text-sm lg:text-base max-w-xs text-white/60 mt-2">{discription}</p>
            </div>
        </>
    )
}
