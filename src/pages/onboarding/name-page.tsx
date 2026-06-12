import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterLayout from "../../layouts/register-layout";
import { useOnboardingStore } from "../../store/onboardingStore";

export default function NamePage() {
  const navigate = useNavigate();
  const name = useOnboardingStore((state) => state.name);
  const setName = useOnboardingStore((state) => state.setName);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const nameIsValid = name.trim().length > 0;

  const handleNext = () => {
    setHasSubmitted(true);
    if (!nameIsValid) return;

    setName(name.trim());
    navigate("/register/nickname");
  };

  return (
    <RegisterLayout
      step={1}
      title={<>반가워요! 당신의 프로필을 완성해주세요</>}
      subtitle="실제 이름을 입력해주세요"
      onNext={handleNext}
      buttonContext="다음"
      disabled={!nameIsValid}
    >
      <div className="mt-10">
        <input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="이름을 입력해주세요"
          maxLength={10}
          className={`
            w-full rounded-[16px] border px-4 py-4
            font-[PretendardVariable] text-[16px] text-[#111111]
            placeholder:text-[#AEB3B9]
            outline-none transition
            ${
              isFocused
                ? "border-[#5060FE] bg-white"
                : "border-transparent bg-[#F4F7FB]"
            }
          `}
        />

        <div className="mt-2 flex items-center justify-between">
          <div>
            {hasSubmitted && !nameIsValid ? (
              <p className="font-[PretendardVariable] text-sm text-[#E05F5F]">
                이름을 입력해야 다음으로 넘어갈 수 있어요.
              </p>
            ) : null}
          </div>

          <p className="font-[PretendardVariable] text-sm font-medium text-[#AEB3B9]">
            {name.length}/10
          </p>
        </div>
      </div>
    </RegisterLayout>
  );
}
