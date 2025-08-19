import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    await resend.emails.send({
      from: "onboarding@resend.dev", // لازم يكون verified
      to: email,
      subject: "Your OTP Code",
      html: `<p>Your OTP is: <b>${otp}</b></p>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
