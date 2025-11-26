"use client";

export default function PublicReviews({
  listingId,
  reviews,
}: {
  listingId: number;
  reviews: any[];
}) {
  const listingName = reviews[0]?.listingName ?? `Property ${listingId}`;

  const heroImage =
    reviews[0]?.image ??
    "https://picsum.photos/id/1018/1200/500"; // fallback only if no review image exists

  return (
    <div className="max-w-4xl mx-auto">
      <a href="/properties" className="text-blue-600 underline text-sm">
        ← Back
      </a>

      <h1 className="text-3xl font-bold mt-4">{listingName}</h1>

      <img
        src={heroImage}
        className="w-full h-64 object-cover rounded-xl my-6"
      />

      <h2 className="text-2xl font-semibold mb-4">Approved Guest Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-600 text-sm">No approved reviews yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {reviews.map((review: any) => (
            <div
              key={review.id}
              className="bg-white border rounded-lg p-4 shadow"
            >
              <div className="flex justify-between mb-2">
                <div>
                  <div className="font-semibold">{review.guestName}</div>
                  <div className="text-xs text-gray-500">
                    {review.channel} •{" "}
                    {new Date(review.submittedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-yellow-500 font-bold">
                  ⭐ {review.rating}
                </div>
              </div>

              <p className="text-gray-700">{review.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
