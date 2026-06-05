import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import NavigationBar from "../../components/NavigationBar";
import Dropdown from "../../components/common/Dropdown";
import Modal from "../../components/common/Modal";
import { useReviewStore } from "../../store/reviewStore";
import starIcon from "../../assets/star.svg";
import starFitIcon from "../../assets/starfit.svg";
import camIcon from "../../assets/cam.svg";

interface StarRatingProps {
  label: string;
  description?: string;
  ratingKey: "house" | "facility" | "infrastructure" | "security" | "environment" | "total";
  ratings: {
    house: number;
    facility: number;
    infrastructure: number;
    security: number;
    environment: number;
    total: number;
  };
  onRatingClick: (key: "house" | "facility" | "infrastructure" | "security" | "environment" | "total", index: number) => void;
}

const StarRating = ({
  label,
  description,
  ratingKey,
  ratings,
  onRatingClick,
}: StarRatingProps) => (
  <div className="flex flex-col gap-3">
    <div className="flex flex-col gap-0.5">
      <p className="text-sm font-medium text-[#2c2c2c]">{label}</p>
      {description && <p className="text-xs text-[#656565]">{description}</p>}
    </div>
    <div className="flex gap-3.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <button
          key={i}
          onClick={() => onRatingClick(ratingKey, i)}
          className="focus:outline-none"
        >
          <img
            src={i < ratings[ratingKey] ? starIcon : starFitIcon}
            alt="star"
            className={i < ratings[ratingKey] ? "w-[35px] h-[33px]" : "w-[31px] h-[30px] m-[2px]"}
            style={{ objectFit: "contain" }}
          />
        </button>
      ))}
    </div>
  </div>
);

export default function WriteReviewPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const {
    reviewType,
    selectedProperty,
    contractInfo,
    setContractInfo,
    ratings,
    setRating,
    detailedReview,
    setDetailedReview,
    photos,
    setPhotos,
    resetReview,
  } = useReviewStore();

  const isResident = reviewType === "resident";

  const handleRatingClick = (
    key: "house" | "facility" | "infrastructure" | "security" | "environment" | "total",
    index: number
  ) => {
    const newValue = index + 1;
    setRating(key, newValue);
  };

  const handlePhotoUploadClick = () => {
    if (isResident) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 5 - photos.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    const newPhotosPromises = filesToProcess.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    const newPhotos = await Promise.all(newPhotosPromises);
    setPhotos([...photos, ...newPhotos]);
    
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isSubmitDisabled =
    !contractInfo.duration ||
    ratings.house === 0 ||
    ratings.facility === 0 ||
    ratings.infrastructure === 0 ||
    ratings.security === 0 ||
    ratings.environment === 0 ||
    ratings.total === 0 ||
    !detailedReview;

  const handleSubmit = () => {
    setIsSuccessModalOpen(true);
  };

  const handleModalConfirm = () => {
    resetReview();
    navigate("/");
  };

  return (
    <div className="relative min-h-screen bg-white pb-32">
      <Header variant="detail" title="후기 작성" showLike={false} />

      <main className="px-4 pt-6 flex flex-col gap-8">
        {/* 거주 기간 */}
        <Dropdown
          label="거주 기간"
          placeholder="거주 기간을 선택해주세요"
          options={["6개월 미만", "6개월~1년", "1년~2년", "2년 이상"]}
          value={contractInfo.duration}
          onChange={(val) => setContractInfo({ duration: val })}
        />

        <div className="flex flex-col gap-8">
          <StarRating
            label="집상태"
            description="수압 및 배수, 청결도, 옵션"
            ratingKey="house"
            ratings={ratings}
            onRatingClick={handleRatingClick}
          />
          <StarRating
            label="시설물"
            description="출입 관리, 시설 유지보수, 공용 부분 청결"
            ratingKey="facility"
            ratings={ratings}
            onRatingClick={handleRatingClick}
          />
          <StarRating
            label="인프라"
            description="편의시설, 주변 시설"
            ratingKey="infrastructure"
            ratings={ratings}
            onRatingClick={handleRatingClick}
          />
          <StarRating
            label="치안"
            description="밤길 안전, CCTV, 가로등 유무, 근처 유흥가 유무"
            ratingKey="security"
            ratings={ratings}
            onRatingClick={handleRatingClick}
          />
          <StarRating
            label="환경"
            description="소음, 채광"
            ratingKey="environment"
            ratings={ratings}
            onRatingClick={handleRatingClick}
          />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-[#2c2c2c]">
            이집의 전체후기를 자세히 남겨주세요
          </p>
          <textarea
            className="w-full h-[172px] p-4 rounded-[15px] bg-[#f4f7fb] text-sm text-[#2c2c2c] placeholder-[#ababab] outline-none resize-none"
            placeholder="이 집의 장단점 등을 상세히 남겨주세요"
            value={detailedReview}
            onChange={(e) => setDetailedReview(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium text-[#2c2c2c]">
              집 사진을 공유해주세요
            </p>
            <p className="text-xs text-[#656565]">
              집 사진은 실거주인증만 첨부가능해요
            </p>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2">
            {isResident ? (
              <>
                <button 
                  className="flex-shrink-0 w-[106px] h-[106px] rounded-[15px] border border-[#d1d1d1] flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors"
                  onClick={handlePhotoUploadClick}
                >
                  <img src={camIcon} alt="camera" className="w-[30px] h-[30px]" />
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-[#ababab]">사진 추가</span>
                    <span className="text-[10px] text-[#ababab]">{photos.length}/5</span>
                  </div>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                />
                {photos.map((photo, idx) => (
                  <div key={idx} className="flex-shrink-0 w-[106px] h-[106px] rounded-[15px] overflow-hidden">
                    <img src={photo} alt={`room-${idx}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </>
            ) : (
              <div className="flex-shrink-0 w-[106px] h-[106px] rounded-[15px] border border-[#d1d1d1] bg-gray-50 flex flex-col items-center justify-center gap-1 opacity-50 cursor-not-allowed">
                <img src={camIcon} alt="camera" className="w-[30px] h-[30px] grayscale" />
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-[#ababab]">사진 추가</span>
                  <span className="text-[10px] text-[#ababab]">0/5</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <hr className="border-[#E7EAED]" />

        <div className="flex flex-col items-center gap-4 py-4">
          <p className="text-base font-semibold text-[#2c2c2c]">
            {selectedProperty?.name || "이 집"}의 총 별점은?
          </p>
          <div className="flex gap-3.5 justify-center">
            {[0, 1, 2, 3, 4].map((i) => (
              <button
                key={i}
                onClick={() => handleRatingClick("total", i)}
                className="focus:outline-none"
              >
                <img
                  src={i < ratings.total ? starIcon : starFitIcon}
                  alt="star"
                  className={i < ratings.total ? "w-[35px] h-[33px]" : "w-[31px] h-[30px] m-[2px]"}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 pb-10">
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className={`w-full h-[56px] rounded-[12px] font-semibold text-[16px] transition active:scale-[0.98] ${
              isSubmitDisabled
                ? "bg-[#DEE4EB] text-[#ABABAB] cursor-not-allowed"
                : "bg-[#5060FE] text-white cursor-pointer hover:brightness-95"
            }`}
          >
            제출 하기
          </button>
        </div>
      </main>

      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="후기 작성이 완료되었습니다!"
        description="정성스러운 후기 감사합니다.&#10;다른 사람들에게 큰 도움이 될 거예요!"
        buttonText="확인"
        onConfirm={handleModalConfirm}
      />

      <NavigationBar />
    </div>
  );
}
