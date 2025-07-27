import { getServerSession } from "next-auth"
import Image from "next/image";




export async function EmailNameImageSSR(){
    const session = await getServerSession();
    return (
        <div
            className="flex gap-2 items-center"
        >
            <div
                className='relative w-12 h-12 rounded-full border overflow-hidden'
            >
                <Image
                    src={session?.user?.image as string || ""}
                    alt={session?.user?.name as string || ""}
                    fill
                    className="object-cover"
                />
            </div>
            <div
                className="flex flex-col items-start"
            >
                <span className="text-sm font-medium text-gray-900">
                    {session?.user?.name}
                </span>
                <span className="text-sm font-medium text-gray-500">
                    {session?.user?.email}
                </span>
            </div>
        </div>
    )
}