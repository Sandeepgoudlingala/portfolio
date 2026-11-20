import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    // Server-side validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Please enter your name." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json(
        { error: "Message must be at least 5 characters long." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL || "lingalasandeepgoud1234@gmail.com";

    // If API key is not yet configured, provide a helpful development response
    if (!apiKey || apiKey === "re_123456789_abcdefghijklmnopqrstuvwxyz") {
      console.log("Contact form submission (Mock/Dev Mode):", { name, email, message });
      return NextResponse.json({
        success: true,
        mock: true,
        message: "Message received! (Configure RESEND_API_KEY in .env.local for live email delivery).",
      });
    }

    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [toEmail],
      replyTo: email,
      subject: `New Portfolio Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    if (result.error) {
      console.error("Resend delivery error:", result.error);
      return NextResponse.json(
        { error: result.error.message || "Failed to send email." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your message has been sent.",
    });
  } catch (err: unknown) {
    console.error("API contact error:", err);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
