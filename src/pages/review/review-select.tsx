import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import BottomNavigation from "../../components/NavigationBar";
import BottomButton from "../../components/common/BottomButton";
import { useReviewStore } from "../../store/reviewStore";
import { searchPropertiesForReview, type PropertySearchResponse } from "../../api/reviewApi";

export default function ReviewSelectPage() {
  const navigate = useNavigate();
  const { selectedProperty, reviewType, setSelectedProperty, setReviewType } = useReviewStore();
  const [searchQuery, setSearchQuery] = useState(selectedProperty?.name || "");
  const [isFocused, setIsFocused] = useState(false);
  const [properties, setProperties] = useState<PropertySearchResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim() && isFocused) {
        setLoading(true);
        try {
          const results = await searchPropertiesForReview(searchQuery);
          setProperties(results);
        } catch (error) {
          console.error("Failed to fetch properties:", error);
          setProperties([]);
        } finally {
          setLoading(false);
        }
      } else if (!searchQuery.trim()) {
        setProperties([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, isFocused]);

  const handlePropertySelect = (property: PropertySearchResponse) => {
    setSelectedProperty({
      id: property.id,
      name: property.propertyName,
      address: property.propertyAddress,
    });
    setSearchQuery(property.propertyName);
    setIsFocused(false);
  };

  const handleNext = () => {
    if (reviewType === "resident") {
      navigate("/reviews/ocr");
    } else {
      navigate("/reviews/contract");
    }
  };

  const isNextDisabled = !selectedProperty || !reviewType;

  return (
    <div className="relative min-h-screen bg-white pb-40">
      <Header variant="detail" title="후기 작성" showLike={false} />

      <main className="px-4 pt-6 flex flex-col gap-8">
        {/* 매물 선택 섹션 */}
        <section className="flex flex-col gap-3">
          <label className="text-sm font-medium text-[#2C2C2C]">
            매물을 선택해주세요
          </label>
          <div className="relative">
            <div
              className={`flex h-12 items-center justify-between rounded-[15px] border px-4 py-[18px] transition-colors ${
                isFocused ? "border-[#5060FE]" : "border-[#ABABAB]"
              }`}
            >
              <input
                type="text"
                placeholder="후기 매물을 선택해주세요"
                className="w-full text-base text-[#2C2C2C] placeholder-[#ABABAB] outline-none"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (selectedProperty && e.target.value !== selectedProperty.name) {
                    setSelectedProperty(null);
                  }
                }}
                onFocus={() => setIsFocused(true)}
              />
              <svg
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.91667 13.3333C6.40278 13.3333 5.12153 12.809 4.07292 11.7604C3.02431 10.7118 2.5 9.43056 2.5 7.91667C2.5 6.40278 3.02431 5.12153 4.07292 4.07292C5.12153 3.02431 6.40278 2.5 7.91667 2.5C9.43056 2.5 10.7118 3.02431 11.7604 4.07292C12.809 5.12153 13.3333 6.40278 13.3333 7.91667C13.3333 8.52778 13.2361 9.10417 13.0417 9.64583C12.8472 10.1875 12.5833 10.6667 12.25 11.0833L16.9167 15.75C17.0694 15.9028 17.1458 16.0972 17.1458 16.3333C17.1458 16.5694 17.0694 16.7639 16.9167 16.9167C16.7639 17.0694 16.5694 17.1458 16.3333 17.1458C16.0972 17.1458 15.9028 17.0694 15.75 16.9167L11.0833 12.25C10.6667 12.5833 10.1875 12.8472 9.64583 13.0417C9.10417 13.2361 8.52778 13.3333 7.91667 13.3333ZM7.91667 11.6667C8.95833 11.6667 9.84375 11.3021 10.5729 10.5729C11.3021 9.84375 11.6667 8.95833 11.6667 7.91667C11.6667 6.875 11.3021 5.98958 10.5729 5.26042C9.84375 4.53125 8.95833 4.16667 7.91667 4.16667C6.875 4.16667 5.98958 4.53125 5.26042 5.26042C4.53125 5.98958 4.16667 6.875 4.16667 7.91667C4.16667 8.95833 4.53125 9.84375 5.26042 10.5729C5.98958 11.3021 6.875 11.6667 7.91667 11.6667Z"
                  fill={isFocused ? "#2C2C2C" : "#AEB3B9"}
                />
              </svg>
            </div>

            {isFocused && (
              <div
                className="absolute left-0 top-[54px] z-10 w-full overflow-hidden rounded-[15px] bg-white shadow-[0px_3px_10px_2px_rgba(80,96,254,0.1)]"
              >
                <div className="max-h-[220px] overflow-y-auto py-4">
                  {loading ? (
                    <div className="px-4 py-2 text-sm text-[#ABABAB]">검색 중...</div>
                  ) : properties.length > 0 ? (
                    properties.map((property) => (
                      <div
                        key={property.id}
                        className="flex flex-col gap-1 px-4 py-2 hover:bg-[#5060FE]/10 cursor-pointer"
                        onClick={() => handlePropertySelect(property)}
                      >
                        <p className="text-base text-[#2C2C2C]">{property.propertyName}</p>
                        <p className="text-xs text-[#2C2C2C]">{property.propertyAddress}</p>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-[#ABABAB]">
                      {searchQuery.trim() ? "검색 결과가 없습니다." : "매물명을 입력해주세요."}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 후기 종류 선택 섹션 */}
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <label className="text-sm font-medium text-[#2C2C2C]">
              후기 종류를 선택해주세요
            </label>
            <p className="text-xs text-[#656565]">
              실거주 후기는{" "}
              <span className="font-semibold text-neutral-600">등본 등 서류 인증</span> 후
              작성이 가능합니다
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className={`flex h-12 flex-1 items-center justify-center rounded-[15px] border px-1.5 py-2 transition-all ${
                reviewType === "resident"
                  ? "border-[#5060FE] text-[#2C2C2C]"
                  : "border-[#ABABAB] text-[#ABABAB]"
              }`}
              onClick={() => setReviewType("resident")}
            >
              <span className="text-base font-bold">실거주 후기</span>
            </button>
            <button
              type="button"
              className={`flex h-12 flex-1 items-center justify-center rounded-[15px] border px-1.5 py-2 transition-all ${
                reviewType === "inspection"
                  ? "border-[#5060FE] text-[#2C2C2C]"
                  : "border-[#ABABAB] text-[#ABABAB]"
              }`}
              onClick={() => setReviewType("inspection")}
            >
              <span className="text-base font-bold">임장 후기</span>
            </button>
          </div>
        </section>
      </main>

      <div className="[&>div]:bottom-[90px]">
        <BottomButton
          buttons={[
            {
              text: "다음",
              onClick: handleNext,
              disabled: isNextDisabled,
            },
          ]}
        />
      </div>
      
      <BottomNavigation />
    </div>
  );
}
