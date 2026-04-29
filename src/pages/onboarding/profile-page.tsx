import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterLayout from "../../layouts/register-layout";
import { useOnboardingStore } from "../../store/onboardingStore";

import zibiblue from "../../assets/onboarding/zibi-blue.png";
import zibired from "../../assets/onboarding/zibi-red.png";
import zibiyellow from "../../assets/onboarding/zibi-yellow.png";

const profileOptions = [
  {
    id: "blue" as const,
    image: zibiblue,
    alt: "파란 지비",
  },
  {
    id: "red" as const,
    image: zibired,
    alt: "빨간 지비",
  },
  {
    id: "yellow" as const,
    image: zibiyellow,
    alt: "노란 지비",
  },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const nickname = useOnboardingStore((state) => state.nickname);
  const profileImage = useOnboardingStore((state) => state.profileImage);
  const setProfileImage = useOnboardingStore((state) => state.setProfileImage);

  const defaultProfile =
    profileOptions.find((p) => p.id === profileImage) || profileOptions[0];
  const [selectedProfile, setSelectedProfile] = useState(defaultProfile);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleNext = () => {
    setProfileImage(selectedProfile.id);
    navigate("/register/status");
  };

  return (
    <RegisterLayout
      step={2}
      title={<>반가워요! 당신의 프로필을 완성해주세요</>}
      subtitle="마음에 드는 프로필을 선택해주세요"
      onNext={handleNext}
      buttonContext="다음"
      disabled={false}
    >
      <div className="mt-10 flex flex-col items-center">
        {/* 선택된 프로필 */}
        <div className="flex h-[156px] w-[156px] items-center justify-center rounded-full bg-[#F4F6FF]">
          <img
            src={selectedProfile.image}
            alt={selectedProfile.alt}
            className="w-[112px] h-auto"
          />
        </div>

        {/* 닉네임 */}
        <p className="mt-5 text-[22px] font-bold text-[#111111]">
          {nickname || "닉네임"}
        </p>

        {/* 프로필 선택 리스트 */}
        <div className="mt-10 flex items-center justify-center gap-4">
          {profileOptions.map((profile) => {
            const isSelected = selectedProfile.id === profile.id;

            return (
              <button
                key={profile.id}
                type="button"
                onClick={() => setSelectedProfile(profile)}
                className={`
                  flex h-[84px] w-[84px] items-center justify-center rounded-full
                  bg-[#F7F8FA] transition active:scale-[0.96]
                  ${
                    isSelected
                      ? "border-[3px] border-[#5060FE]"
                      : "border-[3px] border-transparent"
                  }
                `}
              >
                <img
                  src={profile.image}
                  alt={profile.alt}
                  className="w-[58px] h-auto"
                />
              </button>
            );
          })}
        </div>
      </div>
    </RegisterLayout>
  );
}
