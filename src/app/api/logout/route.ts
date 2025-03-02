import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  // Create a response and remove the session cookie
  const response = NextResponse.json({ success: true });

  response.headers.set(
    "Set-Cookie",
    serialize("session", "", {
      path: "/", // Apply to the entire site
      httpOnly: true, // Prevent JavaScript from accessing it
      secure: process.env.NODE_ENV === "production", // Only secure in production
      sameSite: "lax", // Helps with CSRF protection
      maxAge: 0, // Delete the cookie immediately
    })
  );

  return response;
}
