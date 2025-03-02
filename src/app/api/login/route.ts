"use server";

import { compare } from "bcryptjs";
import { users } from "../db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await users.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Store session (simple example)
    const response = NextResponse.json({ success: true, user }, { status: 200 });
    response.headers.set("Set-Cookie", `userEmail=${email}; Path=/; HttpOnly; Secure`);

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
