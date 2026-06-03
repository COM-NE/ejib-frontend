export interface AiRecommendationRequest {
  region: string;
  userRequest: string;
}

export interface AiRecommendationResponse {
  propertyId: number;
  address: string;
  latitude: number;
  longitude: number;
  averageScore: number;
  aiSummary: string;
  propertyName?: string; // 백엔드 응답에 없을 수 있지만 UI 표시용으로 추가
  imageUrl?: string; // UI 표시용 이미지 URL
  reviewCount?: number; // UI 표시용 리뷰 개수
}
