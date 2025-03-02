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
    const hash_pwd = await hash(body.password, 11);

    let country: string;
    const lat = body.latitude;
    const long = body.longitude;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`,
      );
      const data = await res.json();

      // Ensure we correctly extract the country name
      if (data.address && data.address.country) {
        country = data.address.country;
      } else {
        console.error("Country not found in response:", data);
        country = "unknown";
      }
    } catch (error) {
      console.error("Error fetching country:", error);
      country = "unknown";
    }

    // Insert new user into the database
    const result = await users.insertOne({
      email: email,
      name: body.name,
      password: hash_pwd,
      country: country,
      disease: body.disease,
      latitude: body.latitude,
      longitude: body.longitude,
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
