import { parse } from "cookie";
import { users } from "./db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    console.log(req);
    // const data = JSON.parse(req.cookies.get("session"));

    // const fellows = users.find({data.disease, data.country});

    // return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
