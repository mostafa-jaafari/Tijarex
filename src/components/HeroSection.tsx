import Image from "next/image";
import { InputHero } from "./HeroInput";


export function HeroSection(){
    return (
        <section
            className="relative px-6 w-full flex flex-col 
                justify-center items-center mt-2"
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
            </div>
            <div
                className="absolute left-0 top-0 z-30 w-full 
                    h-full flex justify-center px-6"
            >
                <div
                    className="w-full flex flex-col rounded-xl
                        items-center justify-end pb-12 bg-black/50 space-y-12"
                >
                    <span
                        className="flex flex-col items-center gap-2"
                    >
                        <p
                            className="text-white bg-purple-700 text-sm px-3 rounded-full"
                        >
                            Tijarex – Morocco’s Marketplace for Unique Finds
                        </p>
                        <h1
                            className="max-w-xl text-center text-3xl font-semibold text-white"
                            >
                            Discover, Buy, and Sell Handmade, Vintage, 
                                and Local Treasures – All in One Place!
                        </h1>
                    </span>
                    <InputHero />
                </div>
            </div>
        </section>
    )
}