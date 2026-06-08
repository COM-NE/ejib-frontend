import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import Header from "../components/common/Header";
import BottomNavigation from "../components/NavigationBar";
import BottomButton from "../components/common/BottomButton";
import { getOnboardingData } from "../utils/userStorage";
import type { AiRecommendationResponse } from "../types/ai";
import star from "../assets/star.svg";
import aiIcon from "../assets/ai.svg";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    kakao: any;
  }
}

export default function AiResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { nickname } = getOnboardingData();
  
  const result = location.state?.result as AiRecommendationResponse;
  console.log("[AiResultPage] location.state:", location.state);
  console.log("[AiResultPage] result data:", result);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!result) {
      console.warn("[AiResultPage] 결과 데이터가 없어 ai 페이지로 리다이렉트합니다.");
      navigate("/ai", { replace: true });
      return;
    }

    if (!window.kakao || !mapRef.current) return;

    const { kakao } = window;
    kakao.maps.load(() => {
      const container = mapRef.current;
      const options = {
        center: new kakao.maps.LatLng(result.latitude, result.longitude),
        level: 3,
      };

      const map = new kakao.maps.Map(container, options);

      //핀 매물 이름 커스텀 오버레이
      const content = `
        <div style="display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.1));">
          <div style="width: 24px; height: 24px; background-color: #5060FE; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 2px solid white;">
            <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%; transform: rotate(45deg);"></div>
          </div>
          <div style="margin-top: 8px; background-color: white; padding: 4px 8px; border-radius: 12px; border: 1px solid #5060FE; font-size: 11px; font-weight: 600; color: #5060FE; white-space: nowrap;">
            ${result.propertyName}
          </div>
        </div>
      `;

      const position = new kakao.maps.LatLng(result.latitude, result.longitude);

      const customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: content,
        yAnchor: 1.1,
      });

      customOverlay.setMap(map);
    });
  }, [result, navigate]);

  if (!result) return null;

  const handleReRecommend = () => {
    navigate("/ai");
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white pb-[180px]">
      <Header variant="detail" title="AI 추천" showLike={false} />

      <main className="flex-1 px-4 pt-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#1f1f1f]">
            {nickname || "사용자"}님을 위한 매물이에요
          </h2>
        </div>

    

        {/* Property Card */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-[#d1d1d1] bg-white shadow-sm">
          <div ref={mapRef} className="h-[197px] w-full bg-gray-200">
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

          
              <div className="flex items-center gap-1">
                <img src={aiIcon} alt="AI Summary" className="h-5 w-5" />
                <span className="text-sm font-medium text-[#1f1f1f]">AI 리뷰 요약</span>
              </div>
              <p className="text-xs leading-relaxed text-[#2c2c2c] text-justify">
                {result.aiSummary}
              </p>
            </div>
          </div>
       
      </main>

      {/* Bottom Buttons */}
      <div className="[&>div]:bottom-[90px]">
        <BottomButton
          buttons={[
            {
              text: "다시 추천 받기",
              onClick: handleReRecommend,
              variant: "primary",
            },
          ]}
        />
      </div>

      <BottomNavigation />
    </div>
  );
}
