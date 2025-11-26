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
}

export default function PropertiesPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [channelFilter, setChannelFilter] = useState("all");
  const [minRating, setMinRating] = useState("");
  const [sortBy, setSortBy] = useState("rating-desc");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/reviews/hostaway");
      const data = await res.json();
      setReviews(data.reviews);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading…</div>;

  const grouped: Record<number, Review[]> = {};
  reviews.forEach((r) => {
    if (!grouped[r.listingId]) grouped[r.listingId] = [];
    grouped[r.listingId].push(r);
  });

  let properties = Object.entries(grouped).map(([id, items]) => {
    const listingId = Number(id);
    const name = items[0].listingName;

    const image =
      items.find((i) => i.image && i.image.trim() !== "")?.image ||
      "https://picsum.photos/id/1018/800/400";

    const approved = items.filter((i) => i.approved);
    const avgRating =
      approved.length > 0
        ? approved.reduce((sum, r) => sum + r.rating, 0) / approved.length
        : null;

    const channels = Array.from(new Set(items.map((i) => i.channel)));

    return {
      id: listingId,
      name,
      image,
      channels,
      total: items.length,
      approved: approved.length,
      avgRating,
    };
  });

  properties = properties.filter((p) => {
    if (channelFilter !== "all" && !p.channels.includes(channelFilter))
      return false;

    if (minRating && p.avgRating !== null && p.avgRating < Number(minRating)) {
      return false;
    }

    return true;
  });

  properties.sort((a, b) => {
    if (sortBy === "rating-desc") return (b.avgRating || 0) - (a.avgRating || 0);
    if (sortBy === "rating-asc") return (a.avgRating || 0) - (b.avgRating || 0);
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    return 0;
  });

  return (
    <div>
      <h1 className="page-title">Properties Overview</h1>
      <p className="page-subtitle">
        Quickly scan how each property is performing and jump into detailed
        reviews or the public page.
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
          <div style={{ fontSize: 13 }}>Minimum rating</div>
          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
          >
            <option value="">None</option>
            <option value="4">4.0+</option>
            <option value="4.5">4.5+</option>
          </select>
        </div>

        <div>
          <div style={{ fontSize: 13 }}>Sort</div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="rating-desc">Rating high → low</option>
            <option value="rating-asc">Rating low → high</option>
            <option value="name-asc">Name A → Z</option>
            <option value="name-desc">Name Z → A</option>
          </select>
        </div>
      </div>

      <div className="grid grid-3">
        {properties.map((p) => (
          <div key={p.id} className="card">
            <img src={p.image} alt={p.name} className="card-image" />
            <h2 className="card-title" style={{ marginBottom: 4 }}>
              {p.name}
            </h2>

            <div className="stats-row" style={{ marginBottom: 6 }}>
              <span>
                ⭐ Avg:{" "}
                <strong>{p.avgRating ? p.avgRating.toFixed(1) : "N/A"}</strong>
              </span>
              <span>
                ✔ Approved: <strong>{p.approved}</strong>
              </span>
              <span>
                📝 Total: <strong>{p.total}</strong>
              </span>
            </div>

            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>
              Channels: {p.channels.join(", ")}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <a
                href={`/property/${p.id}`}
                className="btn btn-primary"
              >
                View reviews
              </a>
              <a
                href={`/property/${p.id}/public`}
                className="btn btn-secondary"
              >
                Public view
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
