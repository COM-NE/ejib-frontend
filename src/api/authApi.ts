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

  // Normalize backend response shape. Some backends nest under `result` or use snake_case.
  const payload = response.data ?? {};
  const result = (payload.result as any) ?? payload;

  const accessToken =
    result.accessToken ?? result.access_token ?? result.access ?? "";
  const refreshToken =
    result.refreshToken ?? result.refresh_token ?? result.refresh ?? "";

  const newUser =
    result.newUser ?? result.new_user ?? result.isNewUser ?? false;

  const onboardingCompleted =
    result.onboardingCompleted ?? result.onboarding_completed ?? true;

  return {
    accessToken,
    refreshToken,
    newUser,
    onboardingCompleted,
  } as KakaoTokenResponse;
};
