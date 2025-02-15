import { PropsWithChildren } from "react"
import { twMerge } from "tailwind-merge";

export const HeroOrbit = ({ children, size, rotation, spin = false, spinDuration, orbit = false, orbitDuration, }: PropsWithChildren<{ size: number; rotation: number; spinDuration?: string; orbit?: boolean; spin?: boolean; orbitDuration?: string }>) => {
    return (
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <div className={twMerge(orbit === true && "animate-spin")}
                style={{
                    animationDuration: orbitDuration
                }}>
                <div
                    className="flex items-start justify-start"
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        height: `${size}px`,
                        width: `${size}px`,

                    }}>
                    <div className={twMerge(spin === true && "animate-spin ")}
                        style={{
                            animationDuration: spinDuration
                        }}
                    >

                        <div className='inline-flex'
                            style={{
                                transform: `rotate(${rotation * -1}deg)`,
                            }}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}