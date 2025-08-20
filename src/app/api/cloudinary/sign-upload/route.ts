import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// Configure Cloudinary with your credentials from .env.local
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { paramsToSign } = body;

        // Generate the secure signature using the parameters from the client
        const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET!);

        return NextResponse.json({ signature });

    } catch (error) {
        console.error("Cloudinary Signature Error:", error);
        return NextResponse.json({ error: "Failed to generate upload signature." }, { status: 500 });
    }
}