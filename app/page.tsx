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
  reply?: string;
}

export default function DashboardPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [channelFilter, setChannelFilter] = useState("all");
  const [listingFilter, setListingFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/reviews/hostaway");
      const data = await res.json();
      setReviews(data.reviews);
      setLoading(false);
    }
    load();
  }, []);

  async function toggleApprove(id: number) {
    await fetch("/api/reviews/hostaway", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const res = await fetch("/api/reviews/hostaway");
    const data = await res.json();
    setReviews(data.reviews);
  }

  function handleReplyChange(id: number, value: string) {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reply: value } : r))
    );
  }

  async function saveReply(id: number) {
    const review = reviews.find((r) => r.id === id);
    await fetch("/api/reviews/hostaway", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, reply: review?.reply || "" }),
    });
    const res = await fetch("/api/reviews/hostaway");
    const data = await res.json();
    setReviews(data.reviews);
  }

  if (loading) {
    return <div style={{ padding: 20, fontSize: 18 }}>Loading reviews…</div>;
  }

  let filtered = reviews.filter((r) => {
    if (channelFilter !== "all" && r.channel !== channelFilter) return false;
    if (listingFilter !== "all" && r.listingName !== listingFilter) return false;

    if (ratingFilter !== "all") {
      const min = parseFloat(ratingFilter);
      if (r.rating < min) return false;
    }
    return true;
  });

  filtered = filtered.sort((a, b) => {
    if (sortBy === "newest") {
      return (
        new Date(b.submittedAt).getTime() -
        new Date(a.submittedAt).getTime()
      );
    }
    if (sortBy === "oldest") {
      return (
        new Date(a.submittedAt).getTime() -
        new Date(b.submittedAt).getTime()
      );
    }
    if (sortBy === "rating-desc") return b.rating - a.rating;
    if (sortBy === "rating-asc") return a.rating - b.rating;
    return 0;
  });

  const uniqueListings = Array.from(new Set(reviews.map((r) => r.listingName)));

  return (
    <div>
      <h1 className="page-title">Reviews Dashboard</h1>
      <p className="page-subtitle">
        Approve, filter and reply to guest feedback across your portfolio.
      </p>

      {/* Filters */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 13 }}>Channel</div>
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Airbnb">Airbnb</option>
            <option value="Booking.com">Booking.com</option>
          </select>
        </div>

        <div>
          <div style={{ fontSize: 13 }}>Property</div>
          <select
            value={listingFilter}
            onChange={(e) => setListingFilter(e.target.value)}
          >
            <option value="all">All</option>
            {uniqueListings.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div style={{ fontSize: 13 }}>Min rating</div>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="all">Any</option>
            <option value="4">4.0+</option>
            <option value="4.5">4.5+</option>
            <option value="5">5 only</option>
          </select>
        </div>

        <div>
          <div style={{ fontSize: 13 }}>Sort</div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="rating-desc">Rating high → low</option>
            <option value="rating-asc">Rating low → high</option>
          </select>
        </div>
      </div>

      {/* Review cards */}
      <div className="grid">
        {filtered.map((r) => (
          <div key={r.id} className="card">
            <div className="card-header">
              <div>
                <div className="card-title">{r.listingName}</div>
                <div className="card-meta">
                  {r.guestName} • {r.channel} •{" "}
                  {new Date(r.submittedAt).toLocaleDateString()}
                </div>
              </div>
              <div style={{ color: "#fbbf24", fontWeight: 600 }}>
                ⭐ {r.rating.toFixed(1)}
              </div>
            </div>

            <p style={{ marginTop: 10, fontSize: 14 }}>{r.text}</p>

            <div style={{ marginTop: 8, fontSize: 12 }}>
              {r.categories.map((c) => (
                <span key={c.category} className="badge" style={{ marginRight: 6 }}>
                  {c.category}: {c.rating}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button
  onClick={() => toggleApprove(r.id)}
  className={
    r.approved
      ? "btn btn-success"      // green button
      : "btn btn-ghost"        // grey button
  }
  style={{
    backgroundColor: r.approved ? "#16a34a" : "",
    color: r.approved ? "white" : "",
    border: r.approved ? "1px solid #15803d" : "",
  }}
>
  {r.approved ? "Approved ✔" : "Approve"}
</button>

              <a
                href={`/property/${r.listingId}`}
                className="btn btn-primary"
              >
                View property
              </a>
            </div>

            <div style={{ marginTop: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600 }}>
                Your reply
              </label>
              <textarea
                value={r.reply || ""}
                onChange={(e) => handleReplyChange(r.id, e.target.value)}
                rows={3}
                style={{ width: "100%", marginTop: 4 }}
                placeholder="Write a reply to the guest…"
              />
              <button
                onClick={() => saveReply(r.id)}
                className="btn btn-primary"
                style={{ marginTop: 6 }}
              >
                Save reply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
