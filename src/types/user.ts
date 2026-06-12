/** 사용자 프로필 이미지 타입 */
export type ProfileImageType = "blue" | "red" | "yellow";

/** 사용자 상태 */
export type UserStatusType = "student" | "job-seeker" | "worker" | "etc";

/** 주거 조건 */
export type RequirementType =
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

/** 회원가입 중인 사용자 데이터 */
export interface OnboardingData {
  name: string;
  nickname: string;
  profileImage: ProfileImageType | null;
  userStatus: UserStatusType | null;
  requirements: RequirementType[];
}

/** 완성된 사용자 프로필 */
export interface UserProfile extends OnboardingData {
  id?: string;
  createdAt?: Date;
}
