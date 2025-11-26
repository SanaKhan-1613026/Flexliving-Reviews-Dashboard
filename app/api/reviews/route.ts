import { NextResponse } from "next/server";
import mockReviews from "../../../mockReviews.json";

export async function GET() {
  return NextResponse.json({
    status: "success",
    reviews: mockReviews
  });
}
