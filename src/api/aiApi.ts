import axiosInstance from "./axiosInstance";
import type { AiRecommendationRequest, AiRecommendationResponse } from "../types/ai";

export const getAiRecommendation = async (
  params: AiRecommendationRequest
): Promise<AiRecommendationResponse> => {
  const response = await axiosInstance.post<AiRecommendationResponse>(
    "/api/v1/ai/recommend",
    params
  );
  return response.data;
};
