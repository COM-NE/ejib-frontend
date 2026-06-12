export interface AiRecommendationRequest {
  region: string;
  userRequest: string;
}

export interface AiRecommendationResponse {
  propertyId: number;
  propertyName: string;
  address: string;
  latitude: number;
  longitude: number;
  averageScore: number;
  reviewCount: number;
  aiSummary: string;
  imageUrl?: string; 
}
