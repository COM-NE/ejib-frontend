import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RegisterLayout from "../../layouts/register-layout";
import { useOnboardingStore } from "../../store/onboardingStore";
import type { UserStatusType } from "../../types/user";

const statusOptions: Array<{ id: UserStatusType; label: string }> = [
  {
    id: "student",
    label: "대학생",
  },
  {
    id: "job-seeker",
    label: "취준생",
  },
  {
    id: "worker",
    label: "직장인",
  },
  {
    id: "etc",
    label: "기타",
  },
];

export default function StatusPage() {
  const navigate = useNavigate();
  const selectedStatus = useOnboardingStore((state) => state.userStatus);
  const setUserStatus = useOnboardingStore((state) => state.setUserStatus);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleNext = () => {
    if (!selectedStatus) return;

    navigate("/register/requirement");
  };

  return (
    <RegisterLayout
      step={4}
      title={<>지금 어떤 환경에서 집을 찾고 계신가요?</>}
      subtitle="선택하신 그룹에 맞춰 나만의 맞춤형 정보를 구성할게요"
      onNext={handleNext}
      buttonContext="다음"
      disabled={!selectedStatus}
    >
      <div className="mt-10 grid grid-cols-2 gap-3">
        {statusOptions.map((option) => {
          const isSelected = selectedStatus === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setUserStatus(option.id)}
              className={`
                h-16 rounded-[20px] border bg-white
                flex items-center justify-center
                font-[PretendardVariable] text-[18px] font-bold text-[#111111]
                transition active:scale-[0.98]
                ${
                  isSelected
                    ? "border-2 border-[#5060FE]"
                    : "border-2 border-[#D1D5DA]"
                }
              `}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </RegisterLayout>
  );
}
