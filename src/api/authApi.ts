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

export const postKakaoTokens = async (
  ticket: string,
): Promise<KakaoTokenResponse> => {
  const response = await axiosInstance.post("/api/v1/auth/kakao/tokens", {
    ticket,
  });

  console.log("[카카오 토큰 원본 응답]", response.data);

  return response.data.data ?? response.data;
};
