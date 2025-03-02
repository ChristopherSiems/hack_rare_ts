"use server";

import { hash } from "bcryptjs";
import { users } from "../../db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email: string = body.email;

    if (await users.findOne({ email: email })) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 },
      );
    }

    // Hash the password (await is required)
    const hashedPassword = await hash(body.password, 11);

    // Insert new user into the database
    const result = await users.insertOne({
      email: email,
      password: hashedPassword,
      age: body.age,
      country: body.country,
      patient: body.patient,
      disease: body.disease,
    });

    return NextResponse.json(
      { success: true, userId: result.insertedId },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
