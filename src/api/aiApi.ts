import type { AiRecommendationRequest, AiRecommendationResponse } from "../types/ai";

export const getAiRecommendation = async (
  _params: AiRecommendationRequest
): Promise<AiRecommendationResponse> => {
  void _params;
  /*
  const response = await axiosInstance.post<AiRecommendationResponse>(
    "/api/v1/ai/recommend",
    _params
  );
  return response.data;
  */

  // Mock response
  return {
    propertyId: 1,
    propertyName: "남양 그린빌라",
    address: "경기도 화성시 남양읍 남양리 123",
    latitude: 37.1990000000,
    longitude: 126.8310000000,
    averageScore: 4.8,
    reviewCount: 4,
    aiSummary: "매물 ID 1 '남양 그린빌라'를 추천합니다. 사용자의 요구사항인 '치안이 좋고 배수가 잘 되며 깨끗한 집'에 가장 부합하는 매물입니다. 실거주자 리뷰에 따르면, 건물주가 매일 청소하여 건물 내부가 매우 깨끗하며(평점 5), 배수구 냄새가 없고 깔끔하다는 평가(평점 4)가 있습니다. 또한, 밤에 가로등이 많아 치안 걱정이 없다는 점(평점 5)은 여성 혼자 살기에도 좋다는 의견과 함께 사용자의 요구사항을 충족시킵니다."
  };
};
