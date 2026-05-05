import apiClient from "./api";

/* GET ALL */
export const getAllReviews = async () => {
  const res = await apiClient.get("/api/reviews");
  return res.data;
};

/* GET BY PRODUCT */
export const getReviewsByProduct = async (productId) => {
  const res = await apiClient.get(`/api/reviews/product/${productId}`);
  return res.data;
};

/* ADD */
export const createReview = async (data) => {
  const res = await apiClient.post("/api/reviews", data);
  return res.data;
};