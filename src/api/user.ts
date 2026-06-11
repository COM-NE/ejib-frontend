import type {
  ProfileImageType,
  RequirementType,
  UserStatusType,
} from "../types/user";

import axiosInstance from "./axiosInstance";

export type ProfileColor = "blue" | "red" | "yellow";

export type UserStatus = "student" | "job-seeker" | "worker" | "etc";

export type UserRequirement =
  | "water"
  | "cleanliness"
  | "option"
  | "noise"
  | "lighting"
  | "access"
  | "maintenance"
  | "public-space"
  | "convenience"
  | "safety"
  | "cctv"
  | "landlord";

export type MyProfile = {
  nickname: string;
  point: number;
  profile: ProfileColor;
};

type MyProfileDto = {
  nickname: string;
  point: number;
  profile: ProfileColor;
};

type ScrappedPropertyDto = {
  averageTotalScore: number;
  id: number;
  propertyAddress: string;
  propertyName: string;
  reviewCount: number;
  scrapped: boolean;
  transactionType: "월세" | "전세" | string;
};

export type ScrappedProperty = {
  id: number;
  rentType: string;
  title: string;
  rating: number;
  reviewCount: number;
  address: string;
  isLiked: boolean;
};

export type OnboardingRequest = {
  name: string;
  nickname: string;
  profile: ProfileImageType | null;
  status: UserStatusType | null;
  requirement: RequirementType[];
};

type OnboardingResponseDto = {
  onboardingCompleted: boolean;
};

export async function getMyProfile(): Promise<MyProfile> {
  const response = await axiosInstance.get<MyProfileDto>("/api/v1/users/me");

  return {
    nickname: response.data.nickname,
    point: response.data.point,
    profile: response.data.profile,
  };
}

export async function getMyScrappedProperties(): Promise<ScrappedProperty[]> {
  const response = await axiosInstance.get<ScrappedPropertyDto[]>(
    "/api/v1/users/me/scraps",
  );

  return response.data.map((item) => ({
    id: item.id,
    rentType: item.transactionType,
    title: item.propertyName,
    rating: item.averageTotalScore,
    reviewCount: item.reviewCount,
    address: item.propertyAddress,
    isLiked: item.scrapped,
  }));
}

export async function submitOnboarding(
  data: OnboardingRequest,
): Promise<boolean> {
  const response = await axiosInstance.patch<OnboardingResponseDto>(
    "/api/v1/users/me/onboarding",
    data,
  );

  return response.data.onboardingCompleted;
}
