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
  image: string;
  reply?: string;
}

export default function PropertyReviewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [listingId, setListingId] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  // 🔥 FIX: unwrap async params
  useEffect(() => {
    async function unwrap() {
      const resolved = await params;
      const id = Number(resolved.id);
      console.log("PROPERTY PARAMS →", resolved);
      setListingId(id);
    }
    unwrap();
  }, [params]);

  // load reviews AFTER we know listingId
  useEffect(() => {
    if (!listingId) return;

    async function load() {
      const res = await fetch("/api/reviews/hostaway");
      const data = await res.json();

      const propertyReviews = (data.reviews as Review[]).filter(
        (r) => r.listingId === listingId
      );

      setReviews(propertyReviews);
      setLoading(false);
    }

    load();
  }, [listingId]);

  async function toggleApproved(id: number) {
    setSavingId(id);
    await fetch("/api/reviews/hostaway", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const res = await fetch("/api/reviews/hostaway");
    const data = await res.json();

    const updated = (data.reviews as Review[]).filter(
      (r) => r.listingId === listingId
    );

    setReviews(updated);
    setSavingId(null);
  }

  if (loading || listingId === null)
    return <div style={{ padding: 20 }}>Loading…</div>;

  const listingName = reviews[0]?.listingName ?? `Property ${listingId}`;
  const image =
    reviews.find((r) => r.image && r.image.trim() !== "")?.image ||
    "https://picsum.photos/id/1018/1000/400";

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <a href="/properties" style={{ fontSize: 14, color: "#3b82f6" }}>
        ← Back to properties
      </a>

      <h1 style={{ fontSize: 32, fontWeight: 700, marginTop: 10 }}>
        {listingName}
      </h1>

      <img
        src={image}
        alt={listingName}
        style={{
          width: "100%",
          height: 240,
          objectFit: "cover",
          borderRadius: 12,
          marginTop: 16,
        }}
      />

      <div style={{ marginTop: 20 }}>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews
            .sort(
              (a, b) =>
                new Date(b.submittedAt).getTime() -
                new Date(a.submittedAt).getTime()
            )
            .map((review) => (
              <div
                key={review.id}
                style={{
                  background: "white",
                  border: "1px solid #ddd",
                  borderRadius: 12,
                  padding: 16,
                  marginTop: 16,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <strong>{review.guestName}</strong>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      {review.channel} •{" "}
                      {new Date(review.submittedAt).toLocaleDateString()}
                    </div>
                    <div style={{ color: "#fbbf24" }}>
                      ⭐ {review.rating.toFixed(1)}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleApproved(review.id)}
                    disabled={savingId === review.id}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 6,
                      border: "1px solid #ccc",
                      background: review.approved ? "#e6ffe6" : "#eee",
                      cursor: "pointer",
                    }}
                  >
                    {savingId === review.id
                      ? "Saving…"
                      : review.approved
                      ? "Approved ✔"
                      : "Approve"}
                  </button>
                </div>

                <p style={{ marginTop: 8 }}>{review.text}</p>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
