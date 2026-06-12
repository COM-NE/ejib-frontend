import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import BottomNavigation from "../components/NavigationBar";
import Dropdown from "../components/common/Dropdown";
import BottomButton from "../components/common/BottomButton";
import AiLoadingPage from "./ai-loading-page";
// import { getAiRecommendation } from "../api/aiApi";

const REGION_DATA: Record<string, string[]> = {
  서울특별시: [
    "종로구",
    "중구",
    "용산구",
    "성동구",
    "광진구",
    "동대문구",
    "중랑구",
    "성북구",
    "강북구",
    "도봉구",
    "노원구",
    "은평구",
    "서대문구",
    "마포구",
    "양천구",
    "강서구",
    "구로구",
    "금천구",
    "영등포구",
    "동작구",
    "관악구",
    "서초구",
    "강남구",
    "송파구",
    "강동구",
  ],
  부산광역시: ["중구", "서구", "동구", "영도구", "부산진구", "동래구", "남구", "북구", "해운대구"],
  경기도:["수원시", "용인시","고양시", "화성시", "성남시", "부천시", "남양주시", "안산시", "평택시","안양시"],
  인천광역시: [
    "중구",
    "동구",
    "미추홀구",
    "연수구",
    "남동구",
    "부평구",
    "계양구",
    "서구",
    "강화군",
    "옹진군",
  ],
  대구광역시: ["중구", "동구", "서구", "남구", "북구", "수성구", "달서구", "달성군", "군위군"],
  대전광역시: ["동구", "중구", "서구", "유성구", "대덕구"],
  광주광역시: ["동구", "서구", "남구", "북구", "광산구"],
  울산광역시: ["중구", "남구", "동구", "북구", "울주군"],
};

export default function AiPage() {
  const navigate = useNavigate();
  const [region1, setRegion1] = useState("");
  const [region2, setRegion2] = useState("");
  const [requirements, setRequirements] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const region1Options = Object.keys(REGION_DATA);
  const region2Options = region1 ? REGION_DATA[region1] : [];

  const isFormValid = region1 && region2 && requirements.trim();

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setIsLoading(true);

    // AI 추천 결과 목업 데이터
    const MOCK_RESULT = {
      propertyId: 1,
      propertyName: "관악산 뜨란채 아파트",
      address: "서울특별시 관악구 신림동 1735",
      latitude: 37.4715,
      longitude: 126.9232,
      averageScore: 4.5,
      reviewCount: 128,
      aiSummary: "이 매물은 조용하고 쾌적한 주거 환경을 자랑합니다. 관악산 인근에 위치하여 공기가 맑으며, 단지 내 편의시설이 잘 갖춰져 있어 생활이 편리합니다. 특히 채광이 좋고 방음이 잘 된다는 입주민들의 긍정적인 평가가 많습니다.",
    };

    try {
      // 로딩 화면
      await new Promise((resolve) => setTimeout(resolve, 2000));

      /* 기존 API 연결 코드 (주석 처리)
      const region = `${region1} ${region2}`;
      console.log("[AiPage] 추천 요청 시작:", { region, userRequest: requirements });
      const result = await getAiRecommendation({
        region,
        userRequest: requirements,
      });
      console.log("[AiPage] 추천 요청 성공. 결과 데이터:", result);

      if (!result || (typeof result === "object" && Object.keys(result).length === 0)) {
        console.warn("[AiPage] 유효한 결과 데이터가 없습니다.");
        alert("조건에 맞는 추천 매물을 찾지 못했습니다. 조건을 조금 다르게 입력해보세요.");
        setIsLoading(false);
        return;
      }
      navigate("/ai/result", { state: { result } });
      */

      // 목업 데이터로 이동
      navigate("/ai/result", { state: { result: MOCK_RESULT } });
    } catch (error) {
      console.error("AI 추천 과정 중 오류 발생:", error);
      navigate("/ai/result", { state: { result: MOCK_RESULT } });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <AiLoadingPage />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-white pb-[160px]">
      <Header variant="detail" title="AI 추천" showLike={false} />

      <main className="flex-1 px-4 pt-4">
        {/* Greeting */}
        <div className="mb-10 mt-2">
          <h2 className="text-xl font-bold leading-snug text-[#1f1f1f]">
            반가워요! <br />
            딱 맞는 매물을 추천해드릴게요!
          </h2>
        </div>

        {/* Region Selectors */}
        <div className="mb-8 flex flex-col gap-6">
          <Dropdown
            label="지역 선택"
            placeholder="시/도"
            options={region1Options}
            value={region1}
            onChange={(val) => {
              setRegion1(val);
              setRegion2(""); // Reset region2 when region1 changes
            }}
          />
          <Dropdown
            label="상세 지역 선택"
            placeholder="시/군/구"
            options={region2Options}
            value={region2}
            onChange={setRegion2}
          />
        </div>

        {/* Requirements */}
        <div className="mb-10 flex flex-col gap-3">
          <label htmlFor="requirements" className="text-sm font-medium text-[#2c2c2c]">
            어떤 조건을 원하시는지 구체적으로 알려주세요
          </label>
          <textarea
            id="requirements"
            className="h-[172px] w-full resize-none rounded-[15px] bg-[#f4f7fb] p-4 text-sm text-[#2c2c2c] placeholder-[#ababab] focus:outline-none focus:ring-1 focus:ring-[#5060fe]"
            placeholder="원하는 매물의 조건을 구체적으로 작성해주세요"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
          />
        </div>
      </main>

      <div className="[&>div]:bottom-[90px]">
        <BottomButton
          buttons={[
            {
              text: "추천 받기",
              onClick: handleSubmit,
              disabled: !isFormValid,
            },
          ]}
        />
      </div>

      <BottomNavigation />
    </div>
  );
}