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

type KakaoTokenRawPayload = {
  accessToken?: string;
  access_token?: string;
  access?: string;

  refreshToken?: string;
  refresh_token?: string;
  refresh?: string;

  newUser?: boolean;
  new_user?: boolean;
  isNewUser?: boolean;

  onboardingCompleted?: boolean;
  onboarding_completed?: boolean;

  result?: KakaoTokenRawPayload;
};

export const postKakaoTokens = async (
  ticket: string,
): Promise<KakaoTokenResponse> => {
  const response = await axiosInstance.post<KakaoTokenRawPayload>(
    "/api/v1/auth/kakao/tokens",
    {
      ticket,
    },
  );

  console.log("[카카오 토큰 원본 응답]", response.data);

  const payload: KakaoTokenRawPayload = response.data ?? {};
  const result = payload.result ?? payload;

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
  };
};
