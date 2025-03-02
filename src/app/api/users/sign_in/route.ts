import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { users, orgs } from "../../db";
import { serialize } from "cookie";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Try finding the user in `users`, if not found, search in `orgs`
    const user =
      (await users.findOne({ email })) || (await orgs.findOne({ email }));

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Set an HTTP-only cookie with the user's email
    const response = NextResponse.json({ success: true, email: user.email });
    response.headers.set(
      "Set-Cookie",
      serialize("session", user.email, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      }),
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
