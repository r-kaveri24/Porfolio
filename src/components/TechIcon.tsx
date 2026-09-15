import { twMerge } from 'tailwind-merge'

export const TechIcon = ({ src, className, bgClass }: { src: string; className?: string; bgClass?: string }) => {
    return (
        <span
            className={twMerge('inline-block size-10', bgClass ?? 'bg-gradient-to-r from-emerald-300 to-sky-400', className)}
            style={{
                WebkitMaskImage: `url(${src})`,
                maskImage: `url(${src})`,
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
            }}
        />
    )
}
