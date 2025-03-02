import { NextResponse } from "next/server";
import { parse } from "cookie";
import { users } from "../../db";

export async function GET(req: Request) {
  try {
    // Get cookies from the request headers
    const cookies = parse(req.headers.get("cookie") || "");
    const email = cookies.session;

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await users.findOne(
      { email },
      { projection: { password: 0 } },
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
