import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterLayout from "../../layouts/register-layout";
import { useOnboardingStore } from "../../store/onboardingStore";

export default function NicknamePage() {
  const navigate = useNavigate();
  const nickname = useOnboardingStore((state) => state.nickname);
  const setNickname = useOnboardingStore((state) => state.setNickname);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const nicknameIsValid = nickname.trim().length > 0;

  const handleNext = () => {
    setHasSubmitted(true);
    if (!nicknameIsValid) return;

    setNickname(nickname.trim());
    navigate("/register/profile");
  };

  return (
    <RegisterLayout
      step={1}
      title={<>반가워요! 당신의 프로필을 완성해주세요</>}
      subtitle="이집어때에서 사용할 닉네임을 알려주세요"
      onNext={handleNext}
      buttonContext="다음"
      disabled={!nicknameIsValid}
    >
      <div className="mt-10">
        <input
          id="nickname"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="닉네임을 입력해주세요"
          maxLength={10}
          className={`
            w-full rounded-[16px] border px-4 py-4
            text-[16px] text-[#111111]
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
            {hasSubmitted && !nicknameIsValid ? (
              <p className="text-sm text-[#E05F5F]">
                닉네임을 입력해야 다음으로 넘어갈 수 있어요.
              </p>
            ) : null}
          </div>

          <p className="text-sm font-medium text-[#AEB3B9]">
            {nickname.length}/10
          </p>
        </div>
      </div>
    </RegisterLayout>
  );
}
