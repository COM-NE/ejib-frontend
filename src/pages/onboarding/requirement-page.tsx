import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterLayout from "../../layouts/register-layout";
import { useOnboardingStore } from "../../store/onboardingStore";
import type { RequirementType } from "../../types/user";
import { submitOnboarding } from "../../api/user";

import waterIcon from "../../assets/onboarding/water-pressure.svg";
import cleanlinessIcon from "../../assets/onboarding/cleanliness.svg";
import optionIcon from "../../assets/onboarding/option.svg";
import noiseIcon from "../../assets/onboarding/noise.svg";
import lightingIcon from "../../assets/onboarding/lighting.svg";
import securityIcon from "../../assets/onboarding/security.svg";
import maintenanceIcon from "../../assets/onboarding/maintenance.svg";
import publicSpaceIcon from "../../assets/onboarding/public-space.svg";
import convenienceIcon from "../../assets/onboarding/conveniences.svg";
import safetyIcon from "../../assets/onboarding/safety.svg";
import cctvIcon from "../../assets/onboarding/cctv.svg";
import landlordIcon from "../../assets/onboarding/landlord.svg";

const requirementOptions: Array<{
  id: RequirementType;
  label: string;
  icon: string;
}> = [
  { id: "water", label: "수압 및 배수", icon: waterIcon },
  { id: "cleanliness", label: "청결도", icon: cleanlinessIcon },
  { id: "option", label: "옵션", icon: optionIcon },
  { id: "noise", label: "소음", icon: noiseIcon },
  { id: "lighting", label: "채광", icon: lightingIcon },
  { id: "access", label: "출입관리", icon: securityIcon },
  { id: "maintenance", label: "시설유지보수", icon: maintenanceIcon },
  { id: "public-space", label: "공용공간", icon: publicSpaceIcon },
  { id: "convenience", label: "편의시설", icon: convenienceIcon },
  { id: "safety", label: "밤길 안전", icon: safetyIcon },
  { id: "cctv", label: "CCTV", icon: cctvIcon },
  { id: "landlord", label: "임대인", icon: landlordIcon },
];

export default function RequirementPage() {
  const navigate = useNavigate();
  const name = useOnboardingStore((state) => state.name);
  const nickname = useOnboardingStore((state) => state.nickname);
  const profileImage = useOnboardingStore((state) => state.profileImage);
  const userStatus = useOnboardingStore((state) => state.userStatus);
  const selectedRequirements = useOnboardingStore(
    (state) => state.requirements,
  );
  const setRequirements = useOnboardingStore((state) => state.setRequirements);
  const resetOnboarding = useOnboardingStore((state) => state.resetOnboarding);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSelect = (id: RequirementType) => {
    if (selectedRequirements.includes(id)) {
      setRequirements(selectedRequirements.filter((item) => item !== id));
      return;
    }

    if (selectedRequirements.length >= 3) return;

    setRequirements([...selectedRequirements, id]);
  };

  const handleNext = async () => {
    if (selectedRequirements.length < 1) return;

    if (!nickname || !profileImage || !userStatus) {
      alert("온보딩 정보가 부족합니다. 이전 단계를 다시 확인해주세요.");
      return;
    }

    try {
      setSubmitting(true);

      const completed = await submitOnboarding({
        name: name || nickname,
        nickname,
        profile: profileImage,
        status: userStatus,
        requirement: selectedRequirements,
      });

      if (completed) {
        resetOnboarding();
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
      alert("회원가입 정보 저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <RegisterLayout
      step={5}
      title={<>집 구할 때 절대 포기 못 하는 3가지는?</>}
      subtitle="꼼꼼하게 분석해서 실속 있는 정보만 모아 보여드릴게요"
      onNext={handleNext}
      buttonContext={submitting ? "저장 중..." : "완료"}
      disabled={selectedRequirements.length < 1 || submitting}
    >
      <div className="mt-[clamp(18px,3vh,28px)]">
        <div className="grid grid-cols-3 gap-x-3 gap-y-[clamp(10px,1.8vh,20px)]">
          {requirementOptions.map((option) => {
            const isSelected = selectedRequirements.includes(option.id);

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option.id)}
                className="flex min-w-0 flex-col items-center justify-start gap-[clamp(6px,1vh,10px)] transition active:scale-[0.97]"
              >
                <div
                  className={`
                    flex h-[clamp(56px,8.8vh,80px)] w-[clamp(56px,8.8vh,80px)]
                    items-center justify-center rounded-full border transition
                    ${
                      isSelected
                        ? "border-[2px] border-[#5060FE] bg-[#F4F7FB]"
                        : "border border-[#F4F7FB] bg-[#F4F7FB]"
                    }
                  `}
                >
                  <img
                    src={option.icon}
                    alt={option.label}
                    className="h-[clamp(24px,4.5vh,34px)] w-[clamp(24px,4.5vh,34px)] object-contain"
                  />
                </div>

                <span
                  className={`
                    h-[32px] text-center text-[clamp(11px,3.2vw,13px)]
                    font-[PretendardVariable] font-semibold leading-tight
                    ${isSelected ? "text-[#5060FE]" : "text-[#222222]"}
                  `}
                >
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </RegisterLayout>
  );
}
