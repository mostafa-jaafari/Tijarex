// /components/SingleProductPage/ProductReviews.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, User } from "lucide-react";
import { toast } from "sonner";
import { useUserInfos } from "@/context/UserInfosContext";
import { ReviewTypes } from "@/types/product";


// --- Component Props ---
type ProductReviewsProps = {
  id: string;
  initialReviews: ReviewTypes[]; // This now correctly uses the global type
  averageRating: number;
};

// --- Star Rating Input Sub-Component (No changes needed) ---
const StarRatingInput = ({ rating, setRating }: { rating: number; setRating: (r: number) => void; }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={24}
          className={`cursor-pointer transition-colors ${
            (hover || rating) >= star
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        />
      ))}
    </div>
  );
};

// --- Main Reviews Component ---
export function ProductReviews({
  id,
  initialReviews,
  averageRating,
}: ProductReviewsProps) {
  const { userInfos } = useUserInfos();
  const [reviews, setReviews] = useState<ReviewTypes[]>(initialReviews);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitReview = async (e: React.FormEvent) => {
  e.preventDefault();
  // --- Client-side validation remains the same ---
  if (newRating === 0) {
    setError("Please select a star rating.");
    return;
  }
  if (!newComment.trim()) {
    setError("Please write a comment.");
    return;
  }
  
  setIsSubmitting(true);
  setError(null);

  try {
    // API call to the backend we just created
    const response = await fetch(`/api/products/${id}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: newRating, comment: newComment.trim() }),
    });

    // --- ⭐️ Improved Error Handling ---
    // Check if the response was not successful
    if (!response.ok) {
      // Try to parse the error message from the API, or use a default
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to submit review.");
    }
    
    // The API returns the successfully created review object
    const submittedReview: ReviewTypes = await response.json();

    // Optimistic UI update: Add the new review to the top of the list
    setReviews((currentReviews) => [submittedReview, ...currentReviews]);
    toast.success("Thank you! Your review has been submitted.");

    // Reset form state
    setNewRating(0);
    setNewComment("");

  } catch (err: unknown) { // Use `unknown` for better type safety
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
    setError(errorMessage);
    toast.error(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <section id="reviews" className="scroll-mt-20 bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
          Customer Reviews
        </h2>

        {/* --- Review Summary --- */}
        <div className="mt-4 flex items-center">
          <p className="text-sm text-gray-700">{averageRating.toFixed(1)}</p>
          <div className="ml-2 flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-5 w-5 flex-shrink-0 ${averageRating > i ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
            ))}
          </div>
          <p className="ml-4 text-sm text-gray-500">Based on {reviews.length} reviews</p>
        </div>

        {/* --- Add Review Form --- */}
        <div className="mt-10">
          <h3 className="text-lg font-medium text-gray-900">Share your thoughts</h3>
          <p className="mt-1 text-sm text-gray-600">If you’ve used this product, share your thoughts with other customers.</p>
          {userInfos ? (
            <form onSubmit={handleSubmitReview} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-800">Your Rating</label>
                <StarRatingInput rating={newRating} setRating={setNewRating} />
              </div>
              <div>
                <label htmlFor="comment" className="text-sm font-medium text-gray-800">Your Review</label>
                <textarea 
                  id="comment" 
                  name="comment" 
                  rows={4} 
                  value={newComment} 
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mt-1 block w-full rounded-md border-neutral-400 
                    shadow-sm focus:border-b-2 focus:border-teal-600 
                    sm:text-sm p-3 outline-none border-b ring ring-neutral-200
                    focus:ring-teal-600 text-teal-700 
                    placeholder:text-neutral-500"
                  placeholder="Tell us what you liked or disliked..."
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-teal-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400">
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          ) : (
            <div className="mt-6 rounded-md border-2 border-dashed border-gray-300 p-6 text-center">
              <p className="text-sm text-gray-600">You must be logged in to post a review.</p>
            </div>
          )}
        </div>

        <hr className="my-12 border-gray-200" />

        {/* --- List of Existing Reviews --- */}
        <div className="space-y-10">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  {/* --- UPDATED: User Image with Fallback --- */}
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200 flex items-center justify-center">
                    {review.image ? (
                      <Image src={review.image} alt={review.fullname || 'User avatar'} fill className="object-cover" />
                    ) : (
                      <User className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{review.fullname}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${3 > i ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 prose">{review.reviewtext}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-gray-500">No reviews yet. Be the first to share your thoughts!</p>
          )}
        </div>
      </div>
    </section>
  );
}