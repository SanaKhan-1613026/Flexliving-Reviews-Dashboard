"use client";

import { useEffect, useState } from "react";

interface Review {
  id: number;
  listingId: number;
  listingName: string;
  guestName: string;
  rating: number;
  channel: string;
  submittedAt: string;
  approved: boolean;
  categories: { category: string; rating: number }[];
  text: string;
  type: string;
}

export default function Dashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [channelFilter, setChannelFilter] = useState("all");
  const [listingFilter, setListingFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [reviewType, setReviewType] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    async function loadReviews() {
      const res = await fetch("/api/reviews/hostaway");
      const data = await res.json();
      setReviews(data.reviews);
      setLoading(false);
    }
    loadReviews();
  }, []);

  async function toggleApprove(id: number) {
    await fetch("/api/reviews/hostaway", {
      method: "POST",
      body: JSON.stringify({ id }),
    });

    const res = await fetch("/api/reviews/hostaway");
    const data = await res.json();
    setReviews(data.reviews);
  }

  if (loading) return <div className="p-10 text-xl">Loading reviews...</div>;

  const filteredReviews = reviews.filter((r) => {
    if (channelFilter !== "all" && r.channel !== channelFilter) return false;
    if (listingFilter !== "all" && r.listingName !== listingFilter) return false;

    if (ratingFilter !== "all") {
      const minRating = parseFloat(ratingFilter);
      if (r.rating < minRating) return false;
    }

    if (reviewType !== "all" && r.type !== reviewType) return false;

    return true;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    }
    if (sortOption === "oldest") {
      return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
    }
    return 0;
  });

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-8">Reviews Dashboard</h1>

      <div className="grid gap-6">
        {sortedReviews.map((review) => (
          <div key={review.id} className="border p-6 rounded-xl shadow bg-white">

            <h2 className="text-2xl font-semibold">{review.listingName}</h2>
            <p className="text-sm text-gray-600">
              Guest: {review.guestName} • {review.rating} ★ • Channel: {review.channel}
            </p>

            <p className="mt-4">{review.text}</p>

            {/* BUTTONS ROW — Always Visible */}
            <div className="flex gap-4 mt-5">
              <button
                onClick={() => toggleApprove(review.id)}
                className={`px-5 py-2 rounded text-white ${
                  review.approved ? "bg-green-600" : "bg-gray-600"
                }`}
              >
                {review.approved ? "Approved ✔" : "Approve"}
              </button>

              <a
                href={`/property/${review.listingId}`}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                View Property →
              </a>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
