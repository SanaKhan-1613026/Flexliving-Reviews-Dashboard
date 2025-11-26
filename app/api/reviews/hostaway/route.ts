import { NextResponse } from "next/server";
import mockReviews from "../../../../mockReviews.json";

// 🚀 Matches EXACTLY your mockReviews.json structure
interface RawReview {
  id: number;
  listingId: number;
  listingName: string;
  guestName: string;
  rating: number;
  channel: string;
  submittedAt: string;
  approved: boolean;
  categories: { category: string; rating: number }[];
  text: string;     // <-- your JSON uses "text"
  type: string;
  image: string;
  reply?: string;
}

// 🚀 Convert JSON → state (add reply if missing)
let reviewsState: RawReview[] = (mockReviews as RawReview[]).map((r) => ({
  ...r,
  reply: r.reply ?? "",
}));

// 🔵 GET — return all reviews
export async function GET() {
  return NextResponse.json({ reviews: reviewsState });
}

// 🟣 POST — toggle approved OR update reply
export async function POST(request: Request) {
  const body = await request.json();
  const { id, reply } = body as { id: number; reply?: string };

  reviewsState = reviewsState.map((review) => {
    if (review.id !== id) return review;

    if (typeof reply === "string") {
      return { ...review, reply };
    }

    return { ...review, approved: !review.approved };
  });

  return NextResponse.json({ reviews: reviewsState });
}
