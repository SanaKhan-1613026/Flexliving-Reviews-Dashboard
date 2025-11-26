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
  text: string;
  image: string;
}

export default function PublicPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const [listingId, setListingId] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // FIX: unwrap params since it is a Promise in Next.js 15/16
  useEffect(() => {
    async function unwrap() {
      const resolved = await params;           // ⬅ FIX
      const id = Number(resolved.id);
      console.log("UNWRAPPED PARAMS →", resolved);
      console.log("listingId →", id);
      setListingId(id);
    }
    unwrap();
  }, [params]);

  // Load reviews AFTER listingId is set
  useEffect(() => {
    if (!listingId) return;

    async function load() {
      const res = await fetch("/api/reviews/hostaway");
      const data = await res.json();

      const approved = (data.reviews as Review[]).filter(
        (r) => r.listingId === listingId && r.approved
      );

      setReviews(approved);
      setLoading(false);
    }

    load();
  }, [listingId]);

  if (loading || listingId === null) {
    return <div style={{ padding: 20 }}>Loading…</div>;
  }

  const listingName =
    reviews.length > 0 ? reviews[0].listingName : `Property ${listingId}`;

  const heroImage =
    reviews.find((r) => r.image)?.image ||
    "https://picsum.photos/id/1018/1200/500";

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <a href="/properties" style={{ fontSize: 14, color: "#3b82f6" }}>
        ← Back to properties
      </a>

      <h1 style={{ fontSize: 32, fontWeight: 700, marginTop: 10 }}>
        {listingName}
      </h1>

      <img
        src={heroImage}
        alt={listingName}
        style={{
          width: "100%",
          height: 260,
          objectFit: "cover",
          borderRadius: 12,
          marginTop: 20,
        }}
      />

      <h2 style={{ fontSize: 22, fontWeight: 600, marginTop: 25 }}>
        Guest Reviews
      </h2>

      {reviews.length === 0 ? (
        <p style={{ color: "#777" }}>No approved reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div
            key={review.id}
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #ddd",
              padding: 16,
              marginTop: 16,
            }}
          >
            <strong>{review.guestName}</strong>
            <div style={{ fontSize: 12, color: "#666" }}>
              {review.channel} •{" "}
              {new Date(review.submittedAt).toLocaleDateString()}
            </div>

            <p style={{ marginTop: 8 }}>{review.text}</p>
          </div>
        ))
      )}
    </div>
  );
}
