import axiosInstance from "./axiosInstance";

export interface KakaoTokenRequest {
  ticket: string;
}

export interface KakaoTokenResponse {
  accessToken: string;
  refreshToken: string;
  newUser: boolean;
  onboardingCompleted: boolean;
}

export const postKakaoTokens = async (ticket: string) => {
  const response = await axiosInstance.post("/api/v1/auth/kakao/tokens", {
    ticket,
  });

  return response.data;
};
