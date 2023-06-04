import { ReviewInputType } from "./reviewsSlice";

export function apiGetReviewsByMovieId(movieId: string) {
  return fetch(`${process.env.REACT_APP_BASE_URL}/reviews/${movieId}`);
}

export function apiUploadReview(review: ReviewInputType) {
  const myHeaders = new Headers();

  myHeaders.append("Authorization", `Bearer ${review.tokenStr}`);
  myHeaders.append("Content-type", "application/json");

  const raw = JSON.stringify({
    rating: review.rating,
    comment: review.comment,
    userId: review.userId,
    username: review.username,
  });

  return fetch(`${process.env.REACT_APP_BASE_URL}/reviews/${review.movieId}`, {
    method: "POST",
    headers: myHeaders,
    body: raw,
  });
}
