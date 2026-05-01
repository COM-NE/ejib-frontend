import type {
  OnboardingData,
  ProfileImageType,
  RequirementType,
  UserStatusType,
} from "../types/user";

const STORAGE_KEY = "onboarding_data";

const defaultOnboardingData: OnboardingData = {
  nickname: "",
  profileImage: null,
  userStatus: null,
  requirements: [],
};

// localStorage에서 회원가입 데이터를 조회합니다.

export const getOnboardingData = (): OnboardingData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as OnboardingData;
    }

    // 기존 저장 방식(각 항목별로 저장)에서 마이그레이션
    const legacyData: OnboardingData = {
      nickname: localStorage.getItem("nickname") ?? "",
      profileImage: (localStorage.getItem("profileImage") ??
        null) as ProfileImageType | null,
      userStatus: (localStorage.getItem("userStatus") ??
        null) as UserStatusType | null,
      requirements: JSON.parse(
        localStorage.getItem("requirements") ?? "[]",
      ) as RequirementType[],
    };

    return legacyData;
  } catch {
    return defaultOnboardingData;
  }
};

/**
 * 회원가입 데이터를 localStorage에 저장합니다.
 */
export const setOnboardingData = (data: Partial<OnboardingData>): void => {
  try {
    const current = getOnboardingData();
    const updated = { ...current, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // 기존 키들도 함께 업데이트 (호환성 유지)
    localStorage.setItem("nickname", updated.nickname);
    if (updated.profileImage)
      localStorage.setItem("profileImage", updated.profileImage);
    if (updated.userStatus)
      localStorage.setItem("userStatus", updated.userStatus);
    localStorage.setItem("requirements", JSON.stringify(updated.requirements));
  } catch {
    console.error("Failed to save onboarding data");
  }
};

/**
 * 특정 필드만 업데이트합니다.
 */
export const updateOnboardingField = <K extends keyof OnboardingData>(
  field: K,
  value: OnboardingData[K],
): void => {
  const current = getOnboardingData();
  setOnboardingData({ ...current, [field]: value });
};

/**
 * 회원가입 데이터를 모두 삭제합니다.
 */
export const clearOnboardingData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("nickname");
    localStorage.removeItem("profileImage");
    localStorage.removeItem("userStatus");
    localStorage.removeItem("requirements");
  } catch {
    console.error("Failed to clear onboarding data");
  }
};
