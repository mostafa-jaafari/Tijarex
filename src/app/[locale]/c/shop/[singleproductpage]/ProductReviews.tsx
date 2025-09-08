// /components/SingleProductPage/ProductReviews.tsx

"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Loader2, Star, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { useUserInfos } from "@/context/UserInfosContext";
import { ReviewTypes } from "@/types/product";


// --- Component Props ---
type ProductReviewsProps = {
  id: string;
  initialReviews: ReviewTypes[]; // This now correctly uses the global type
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
              : "text-neutral-300"
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
const REVIEWS_PER_PAGE = 3;
export function ProductReviews({
  id,
  initialReviews,
}: ProductReviewsProps) {
  const { userInfos } = useUserInfos();
  const [reviews, setReviews] = useState<ReviewTypes[]>(initialReviews);

  // --- ⭐️ STEP 1: State to manage how many reviews are visible ---
  const [visibleReviewCount, setVisibleReviewCount] = useState(REVIEWS_PER_PAGE);

  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / reviews.length;
  }, [reviews]);

  const handleDeleteReview = async (reviewToDelete: ReviewTypes) => {
    // Confirm before deleting
    if (!window.confirm("Are you sure you want to delete your review? This action cannot be undone.")) {
      return;
    }

    setDeletingReviewId(reviewToDelete.createdAt); // Use createdAt as a unique ID

    try {
      const response = await fetch(`/api/products/${id}/reviews`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewToDelete }), // Send the entire review object
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete review.");
      }

      // Optimistic UI update: remove the review from the local state
      setReviews((currentReviews) =>
        currentReviews.filter((r) => r.createdAt !== reviewToDelete.createdAt)
      );
      toast.success("Your review has been deleted.");

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      toast.error(errorMessage);
    } finally {
      setDeletingReviewId(null); // Reset deleting state
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0) return setError("Please select a star rating.");
    if (!newComment.trim()) return setError("Please write a comment.");
    
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/products/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: newRating, comment: newComment.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit review.");
      }
      
      const submittedReview: ReviewTypes = await response.json();
      
      // A new review is added to the start of the list and will be instantly visible.
      setReviews((currentReviews) => [submittedReview, ...currentReviews]);
      toast.success("Thank you! Your review has been submitted.");
      setNewRating(0);
      setNewComment("");

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- ⭐️ STEP 2: Handler to show more reviews ---
  const handleLoadMore = () => {
    setVisibleReviewCount(prevCount => prevCount + REVIEWS_PER_PAGE);
  };

  return (
    <section id="reviews" className="scroll-mt-20 bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
          Customer Reviews
        </h2>

        {/* --- Review Summary (now correctly references the total number of reviews) --- */}
        <div className="mt-4 flex items-center">
          <p className="text-sm text-neutral-700">{averageRating.toFixed(1)}</p>
          <div className="ml-2 flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-5 w-5 flex-shrink-0 ${averageRating > i ? "text-yellow-400 fill-yellow-400" : "text-neutral-300"}`} /> 
            ))}
          </div>
          <p className="ml-4 text-sm text-neutral-500">Based on {reviews.length} reviews</p>
        </div>

        {/* --- Add Review Form --- */}
        <div className="mt-10">
          <h3 className="text-lg font-medium text-neutral-900">Share your thoughts</h3>
          <p className="mt-1 text-sm text-neutral-600">If you’ve used this product, share your thoughts with other customers.</p>
          {userInfos ? (
            <form onSubmit={handleSubmitReview} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-800">Your Rating</label>
                <StarRatingInput rating={newRating} setRating={setNewRating} />
              </div>
              <div>
                <label htmlFor="comment" className="text-sm font-medium text-neutral-800">Your Review</label>
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
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-teal-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-400">
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          ) : (
            <div className="mt-6 rounded-md border-2 border-dashed border-neutral-300 p-6 text-center">
              <p className="text-sm text-neutral-600">You must be logged in to post a review.</p>
            </div>
          )}
        </div>

        <hr className="my-12 border-neutral-200" />

        {/* --- List of Existing Reviews --- */}
        <div className="space-y-10">
          {reviews.length > 0 ? (
            // --- ⭐️ STEP 3: Render only the visible portion of reviews ---
            reviews.slice(0, visibleReviewCount).map((review, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-neutral-200 flex items-center justify-center">
                    {review.image ? (
                      <Image src={review.image} alt={review.fullname || 'User avatar'} fill className="object-cover" />
                    ) : (
                      <User className="h-5 w-5 text-neutral-600" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center gap-2"
                    >
                      <p className="font-medium text-sm text-neutral-900">{review.fullname}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3.5 w-3.5 ${review.rating > i ? "text-yellow-400 fill-yellow-400" : "text-neutral-300"}`} />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <p className="text-xs text-neutral-500">
                          {new Date(review.createdAt).toLocaleDateString(/* ... */)}
                        </p>
                        {/* ⭐️ NEW: Show Delete button if the user owns the review */}
                        {userInfos?.email === review.email && (
                          <button
                            onClick={() => handleDeleteReview(review)}
                            disabled={deletingReviewId === review.createdAt}
                            className="text-neutral-400 hover:text-red-600 disabled:cursor-not-allowed"
                            aria-label="Delete review"
                          >
                            {deletingReviewId === review.createdAt ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        )}
                    </div>
                  </div>
                  <p className="mt-1 px-3 text-sm text-neutral-500 prose">{review.reviewtext}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-neutral-500">No reviews yet. Be the first to share your thoughts!</p>
          )}
        </div>
        {visibleReviewCount < reviews.length && (
          <div className="mt-12 text-center">
            <button
              onClick={handleLoadMore}
              className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-6 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              Load More Reviews
            </button>
          </div>
        )}
      </div>
    </section>
  );
}