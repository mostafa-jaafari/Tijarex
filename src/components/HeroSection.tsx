import Image from "next/image";




export function HeroSection(){
    return (
        <section
            className="w-full flex px-6 gap-6 pb-6
                bg-gradient-to-b from-white to-gray-100"
        >
            {/* --- LEFT SECTION --- */}
            <div
                className="grow"
            >
                {/* --- LEFT TOP SECTION --- */}
                <div
                    className="w-full flex gap-6"
                >
                    <div
                        className="relative group w-1/2 h-60 rounded-2xl
                            shadow-lg overflow-hidden"
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1519415943484-9fa1873496d4?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGZhc2hpb258ZW58MHwwfDB8fHwy"
                            alt="Product hero image"
                            fill
                            className="object-cover group-hover:scale-110 transition-all duration-300"
                            quality={100}
                            priority
                        />
                        <div
                            className="absolute bg-gradient-to-t from-black via-black/50 to-transparent 
                                w-full left-0 bottom-0 p-6 z-20"
                        >
                            <button
                                className="py-2 px-6 font-cinzel rounded shadow-lg 
                                    bg-white hover:bg-white/90 text-black cursor-pointer"
                            >
                                Women Clothes
                            </button>
                        </div>
                    </div>
                    <div
                        className="relative group w-1/2 h-60 rounded-2xl
                            shadow-lg overflow-hidden"
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1559127452-cb4ef7888fa1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjF8fGZhc2hpb258ZW58MHwwfDB8fHwy"
                            alt="hero image product"
                            fill
                            className="object-cover group-hover:scale-110 transition-all duration-300"
                            quality={100}
                            priority
                        />
                        <div
                            className="absolute bg-gradient-to-t from-black via-black/50 to-transparent 
                                w-full left-0 bottom-0 p-6 z-20"
                        >
                            <button
                                className="py-2 px-6 font-cinzel rounded shadow-lg 
                                    bg-white hover:bg-white/90 text-black cursor-pointer"
                            >
                                Men Clothes
                            </button>
                        </div>
                    </div>
                </div>
                {/* --- BOTTOM LEFT SECTION --- */}
                <div
                    className="pt-6 w-full flex flex-col items-start 
                        max-w-[70%] space-y-6"
                >
                    <h1
                        className="text-5xl font-bold uppercase"
                    >
                        Good Mood Shopping Starts Here
                    </h1>
                    <p
                        className="text-md text-gray-500"
                    >
                        Discover unique products, unbeatable deals, 
                        and a shopping experience made just for you.
                    </p>
                    <button
                        className="px-6 py-2 rounded-xl bg-teal-600 primary-button
                        cursor-pointer"
                    >
                        Start Shopping Now
                    </button>
                </div>
            </div>
            {/* --- RIGHT SECTION --- */}
            <div
                className="relative flex-shrink-0"
            >
                <div
                    className="relative group w-80 h-[70vh] shadow-lg
                        rounded-2xl overflow-hidden border border-gray-200"
                >
                    <Image
                        src="https://images.unsplash.com/photo-1596993100471-c3905dafa78e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGZhc2hpb258ZW58MHwxfDB8fHwy"
                        alt="Hero Product Image"
                        fill
                        quality={100}
                        priority
                        className="object-cover group-hover:scale-110 transition-all duration-300"
                    />
                    <div
                        className="absolute bg-gradient-to-t from-black via-black/50 to-transparent 
                            w-full left-0 bottom-0 p-6 z-20"
                    >
                        <button
                            className="w-full py-2 px-6 font-cinzel rounded shadow-lg 
                                bg-white hover:bg-white/90 text-black cursor-pointer"
                        >
                            Shop Now
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}