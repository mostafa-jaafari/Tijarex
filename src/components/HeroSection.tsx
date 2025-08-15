import Image from "next/image";
import { InputHero } from "./HeroInput";


export function HeroSection(){
    return (
        <section
            className="relative px-6 w-full flex flex-col 
                justify-center items-center"
        >
            <div
                className="relative w-full h-80 bg-gray-50 
                    overflow-hidden rounded-xl"
            >
                <Image
                    src="/Hero-Image-1.png"
                    alt=""
                    fill
                    className="object-cover"
                    quality={100}
                    priority
                />
                <div
                    className="absolute left-0 bottom-0 z-20 w-full 
                        h-full flex flex-col justify-end pb-12 
                        items-center bg-black/50 space-y-12"
                >
                    <h1
                        className="max-w-xl text-center text-3xl font-semibold text-white"
                    >
                        Discover, Buy, and Sell Handmade, Vintage, 
                            and Local Treasures – All in One Place!
                    </h1>
                    <InputHero />
                </div>
            </div>
        </section>
    )
}