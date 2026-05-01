import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  OnboardingData,
  ProfileImageType,
  RequirementType,
  UserStatusType,
} from "../types/user";

interface OnboardingStore extends OnboardingData {
  // 액션 메서드
  setNickname: (nickname: string) => void;
  setProfileImage: (profileImage: ProfileImageType | null) => void;
  setUserStatus: (userStatus: UserStatusType | null) => void;
  setRequirements: (requirements: RequirementType[]) => void;

  // 한번에 여러 필드 업데이트
  updateOnboarding: (data: Partial<OnboardingData>) => void;

  // 전체 초기화
  resetOnboarding: () => void;
}

const initialState: OnboardingData = {
  nickname: "",
  profileImage: null,
  userStatus: null,
  requirements: [],
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      ...initialState,

      setNickname: (nickname) => set({ nickname }),

      setProfileImage: (profileImage) => set({ profileImage }),

      setUserStatus: (userStatus) => set({ userStatus }),

      setRequirements: (requirements) => set({ requirements }),

      updateOnboarding: (data) => set((state) => ({ ...state, ...data })),

      resetOnboarding: () => set(initialState),
    }),
    {
      name: "onboarding-storage", // localStorage 키 이름
      version: 1,
    },
  ),
);
