export interface ReviewRequest {
  propertyId: number;
  reviewType: string; 
  residenceDuration: number;
  totalScore: number;
  houseScore: number;
  facilityScore: number;
  infraScore: number;
  safetyScore: number;
  envScore: number;
  content: string;
  deposit: number;
  monthlyRent: number;
}

export interface ReviewResponse {
  id: number;
  propertyId: number;
  reviewType: string;
  residenceDuration: number;
  totalScore: number;
  houseScore: number;
  facilityScore: number;
  infraScore: number;
  safetyScore: number;
  envScore: number;
  content: string;
  deposit: number;
  monthlyRent: number;
  imageUrls: string[];
  createdAt: string;
}

export interface OCRVerifyResponse {
  verified: boolean;
  message: string;
}

export interface OCRVerifyError {
  code: string;
  message: string;
  status: number;
}
