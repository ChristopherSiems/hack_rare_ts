"use server";

import { compare } from "bcryptjs";
import { serialize } from "cookie";
import { users } from "../../db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Ensure the database query doesn't fail silently
    const found = await users.findOne({ email: body.email });
    if (!found) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!found.password) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 500 });
    }

    const isMatch = await compare(body.password, found.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 },
      );
    }

    // Remove password before storing in session
    const { password, ...userData } = found;

    // Create session cookie
    const sessionCookie = serialize("session", JSON.stringify(userData), {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Protect against CSRF attacks
      maxAge: 60 * 60 * 24 * 7, // Expires in 7 days
      path: "/",
    });

    // Check if the cookie is correctly set in response
    const response = new NextResponse(null, { status: 302 }); // Redirect response
    response.headers.set("Location", "/"); // Redirect to home page
    response.headers.append("Set-Cookie", sessionCookie);

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
