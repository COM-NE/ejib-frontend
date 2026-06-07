import axiosInstance from "./axiosInstance";
import type { ReviewRequest, ReviewResponse } from "../types/review";

export interface PropertySearchResponse {
  averageTotalScore: number;
  id: number;
  propertyAddress: string;
  propertyName: string;
  reviewCount: number;
  scrapped: boolean;
  transactionType: string;
}

export const searchPropertiesForReview = async (name: string): Promise<PropertySearchResponse[]> => {
  const response = await axiosInstance.get<PropertySearchResponse[]>("/api/v1/properties", {
    params: { name },
  });
  return response.data;
};

export const registerReview = async (
  reviewData: ReviewRequest,
  images: File[]
): Promise<ReviewResponse> => {
  const formData = new FormData();

  formData.append(
    "request",
    new Blob([JSON.stringify(reviewData)], {
      type: "application/json",
    })
  );

  images.forEach((file) => {
    formData.append("images", file);
  });

  const response = await axiosInstance.post<ReviewResponse>(
    "/api/v1/reviews",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
