"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

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
  image?: string;
}

export default function AnalyticsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/reviews/hostaway");
      const data = await res.json();
      setReviews(data.reviews);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="p-10 text-xl">Loading Analytics...</div>;

  // Approved vs Pending
  const approved = reviews.filter((r) => r.approved).length;
  const pending = reviews.length - approved;

  const approvalData = [
    { name: "Approved", value: approved },
    { name: "Pending", value: pending },
  ];

  const colors = ["#22c55e", "#f43f5e", "#3b82f6"];

  // Channel distribution
  const channelCounts: Record<string, number> = reviews.reduce(
    (acc: Record<string, number>, r) => {
      acc[r.channel] = (acc[r.channel] || 0) + 1;
      return acc;
    },
    {}
  );

  const channelData = Object.entries(channelCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Property comparison
  const propertyMap: Record<string, number[]> = {};

  reviews.forEach((r) => {
    if (!propertyMap[r.listingName]) propertyMap[r.listingName] = [];
    propertyMap[r.listingName].push(r.rating);
  });

  const propertyData = Object.entries(propertyMap).map(([name, ratings]) => ({
    name,
    avgRating: ratings.reduce((sum, r) => sum + r, 0) / ratings.length,
  }));

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-10">Platform Analytics</h1>

      {/* ANALYTICS GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* PIE CHART - APPROVED VS PENDING */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            Review Approval Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={approvalData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {approvalData.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART - CHANNEL DISTRIBUTION */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            Channel Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={channelData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {channelData.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART - PROPERTY RATING COMPARISON */}
        <div className="bg-white p-6 rounded-xl shadow col-span-1 xl:col-span-2">
          <h2 className="text-xl font-semibold mb-4">
            Property Rating Comparison
          </h2>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={propertyData}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="avgRating" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
