import zibi from "../assets/onboarding/zibi.svg";
import BottomButton from "../components/common/BottomButton";

const KakaoIcon = () => (
  <svg
    width="20"
    height="18"
    viewBox="0 0 20 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 0C15.5227 0 19.9998 3.45096 20 7.70801C20 11.9652 15.5228 15.417 10 15.417C9.00121 15.417 8.03705 15.3019 7.12695 15.0918L4.76465 17.4561C4.43444 17.7864 3.87198 17.5238 3.91309 17.0586L4.18457 13.9775C1.65156 12.5791 0 10.2929 0 7.70801C0.000228331 3.45096 4.47729 0 10 0Z"
      fill="#1A1A1C"
    />
  </svg>
);

export default function LoginPage() {
  const K_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const K_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${K_REST_API_KEY}&redirect_uri=${K_REDIRECT_URI}&prompt=login`;

  const handleKakaoLogin = () => {
    window.location.href = kakaoURL;
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col overflow-hidden pb-[100px]">
      {/* 가운데 콘텐츠 */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-4">
        <div className="flex flex-col items-center text-center">
          <h1 className="malang-font text-[40px] leading-none tracking-[-0.01em]">
            <span className="text-[#5060FE]">이</span>
            <span className="text-[#FFD95C]">집</span>
            <span className="text-[#5060FE]">어때</span>
          </h1>

          <p className="mt-1 text-[18px] font-bold text-[#222222] mb-10">
            속지 않는 집 찾기의 시작
          </p>

          <img src={zibi} alt="이집어때 캐릭터" className="w-34 h-auto" />
        </div>
      </main>

      <BottomButton
        buttons={[
          {
            text: "카카오톡으로 시작하기",
            onClick: handleKakaoLogin,
            variant: "kakao",
            leftIcon: <KakaoIcon />,
          },
        ]}
      />
    </div>
  );
}
