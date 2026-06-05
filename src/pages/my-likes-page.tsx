import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/common/Header";
import BottomNavigation from "../components/NavigationBar";
import starIcon from "../assets/star.svg";
import filledHeartIcon from "../assets/home/filled-heart.svg";

type RentType = "월세" | "전세";

type LikedProperty = {
  id: number;
  rentType: RentType;
  title: string;
  rating: number;
  reviewCount: number;
  address: string;
  isLiked: boolean;
};

const mockLikedProperties: LikedProperty[] = [
  {
    id: 1,
    rentType: "전세",
    title: "소사역힐스센텀",
    rating: 4.5,
    reviewCount: 10,
    address: "주소가 들어갑니다",
    isLiked: true,
  },
  {
    id: 2,
    rentType: "전세",
    title: "소사역힐스센텀",
    rating: 4.5,
    reviewCount: 10,
    address: "주소가 들어갑니다",
    isLiked: true,
  },
  {
    id: 3,
    rentType: "월세",
    title: "역곡역 더하우스",
    rating: 4.3,
    reviewCount: 8,
    address: "경기도 부천시 역곡동",
    isLiked: true,
  },
];

export default function MyLikesPage() {
  const navigate = useNavigate();
  const [likedProperties, setLikedProperties] = useState(mockLikedProperties);

  const handleUnlikeClick = (propertyId: number) => {
    setLikedProperties((prev) =>
      prev.filter((property) => property.id !== propertyId),
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header variant="page" title="내가 찜한 매물" showBack />

      <main className="pb-36">
        <section>
          {likedProperties.length > 0 ? (
            likedProperties.map((property) => (
              <LikedPropertyListItem
                key={property.id}
                property={property}
                onClick={() => navigate(`/properties/${property.id}`)}
                onLikeClick={() => handleUnlikeClick(property.id)}
              />
            ))
          ) : (
            <div className="flex min-h-[360px] items-center justify-center">
              <p className="font-[PretendardVariable] text-sm text-gray-400">
                찜한 매물이 없습니다.
              </p>
            </div>
          )}
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}

interface LikedPropertyListItemProps {
  property: LikedProperty;
  onClick: () => void;
  onLikeClick: () => void;
}

function LikedPropertyListItem({
  property,
  onClick,
  onLikeClick,
}: LikedPropertyListItemProps) {
  const isMonthly = property.rentType === "월세";

  return (
    <article className="border-b border-[#D9D9D9] px-5 py-4">
      <div className="flex items-start justify-between gap-4">
        <button
          type="button"
          onClick={onClick}
          className="min-w-0 flex-1 text-left"
        >
          <div className="flex items-center gap-3">
            <span
              className={`rounded-md px-2 py-0.5 font-[PretendardVariable] text-[16px] font-medium ${
                isMonthly
                  ? "bg-[#F1EDF8] text-[#7768BA]"
                  : "bg-[#F8F0E7] text-[#8F8067]"
              }`}
            >
              {property.rentType}
            </span>

            <h2 className="truncate font-[PretendardVariable] text-[18px] font-medium text-[#1F1F1F]">
              {property.title}
            </h2>
          </div>

          <div className="mt-3 flex items-center gap-1 font-[PretendardVariable] text-[16px] text-[#1F1F1F]">
            <img
              src={starIcon}
              alt="별점"
              className="relative top-[1px] h-5 w-5 object-contain"
            />
            <span className="mt-1 leading-none">{property.rating}</span>
            <span className="ml-2 mt-1 leading-none">
              후기 {property.reviewCount}개
            </span>
          </div>

          <p className="mt-3 truncate font-[PretendardVariable] text-[16px] text-[#666666]">
            {property.address}
          </p>
        </button>

        <button
          type="button"
          onClick={onLikeClick}
          aria-label="찜 해제"
          className="pt-1 transition active:scale-90"
        >
          <img src={filledHeartIcon} alt="찜됨" className="h-6 w-6" />
        </button>
      </div>
    </article>
  );
}
