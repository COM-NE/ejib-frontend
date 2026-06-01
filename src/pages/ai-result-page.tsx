import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import BottomNavigation from "../components/NavigationBar";
import BottomButton from "../components/common/BottomButton";
import { getOnboardingData } from "../utils/userStorage";
import type { AiRecommendationResponse } from "../types/ai";
import star from "../assets/star.svg";

// 목데이터 
const MOCK_RESULT: AiRecommendationResponse = {
  propertyId: 1,
  propertyName: "라일락 가든하우스",
  address: "경기도 부천시 원미구 지봉로45번길 14",
  latitude: 37.199,
  longitude: 126.831,
  averageScore: 4.5,
  reviewCount: 10,
  aiSummary:
    "계절이 지나가는 하늘에는 가을로 가득 차 있습니다. 어머님, 그리고 당신은 멀리 북간도에 계십니다. 사용자의 요구사항인 '깨끗한 집', '치안 좋음'에 가장 부합하는 매물입니다.",
};

export default function AiResultPage() {
  const navigate = useNavigate();
  const { nickname } = getOnboardingData();
  const result = MOCK_RESULT;

  const handleReRecommend = () => {
    navigate("/ai");
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white pb-[180px]">
      <Header variant="detail" title="AI 추천" showLike={false} />

      <main className="flex-1 px-4 pt-4">
        {/* Greeting */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#1f1f1f]">
            {nickname || "사용자"}님을 위한 매물이에요
          </h2>
        </div>

    

        {/* Property Card */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-[#d1d1d1] bg-white shadow-sm">
          <div className="h-[197px] w-full bg-gray-200">
             {/* 여기에 지도 */}
          </div>

          <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold text-black">
                {result.propertyName}
              </h3>
              <p className="text-xs text-[#2c2c2c]">{result.address}</p>
            </div>

            <div className="flex items-center gap-1">
              <img src={star} alt="별점" className="h-[18px] w-[19px]" />
              <span className="text-sm font-medium text-[#1f1f1f]">
                {result.averageScore}
              </span>
              <span className="text-sm font-medium text-[#1f1f1f] ml-1">
                후기 {result.reviewCount}개
              </span>
            </div>

            {/* AI Summary 아이콘 수정*/}
          
              <div className="flex items-center gap-1">
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.58925 4.53984C8.08759 3.0815 10.1026 3.03734 10.6934 4.40734L10.7434 4.54067L11.4159 6.50734C11.57 6.95837 11.8191 7.3711 12.1463 7.71769C12.4735 8.06428 12.8712 8.33668 13.3126 8.5165L13.4934 8.584L15.4601 9.25567C16.9184 9.754 16.9626 11.769 15.5934 12.3598L15.4601 12.4098L13.4934 13.0823C13.0422 13.2364 12.6293 13.4854 12.2826 13.8126C11.9359 14.1397 11.6633 14.5375 11.4834 14.979L11.4159 15.159L10.7443 17.1265C10.2459 18.5848 8.23092 18.629 7.64092 17.2598L7.58925 17.1265L6.91759 15.1598C6.76357 14.7087 6.51456 14.2958 6.18737 13.949C5.86018 13.6023 5.46241 13.3298 5.02092 13.1498L4.84092 13.0823L2.87425 12.4107C1.41509 11.9123 1.37092 9.89734 2.74092 9.30734L2.87425 9.25567L4.84092 8.584C5.29195 8.42988 5.70468 8.18083 6.05127 7.85365C6.39787 7.52646 6.67026 7.12875 6.85009 6.68734L6.91759 6.50734L7.58925 4.53984Z"
                    fill="url(#paint0_linear)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear"
                      x1="10"
                      y1="2"
                      x2="10"
                      y2="18"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#FF7171" />
                      <stop offset="1" stopColor="#5788F9" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="text-sm font-medium text-[#1f1f1f]">AI 리뷰 요약</span>
              </div>
              <p className="text-xs leading-relaxed text-[#2c2c2c] text-justify">
                {result.aiSummary}
              </p>
            </div>
          </div>
       
      </main>

      {/* Bottom Buttons */}
      <BottomButton
        buttons={[
          {
            text: "다시 추천 받기",
            onClick: handleReRecommend,
            variant: "primary",
          },
        ]}
      />

      <BottomNavigation />
    </div>
  );
}
