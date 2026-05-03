import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/common/SearchBar";
import BottomNavigation from "../components/NavigationBar";
import starIcon from "../assets/star.svg";
import emptyHeartIcon from "../assets/home/empty-heart.svg";
import filledHeartIcon from "../assets/home/filled-heart.svg";

type RentType = "월세" | "전세";

type Property = {
  id: number;
  rentType: RentType;
  title: string;
  rating: number;
  reviewCount: number;
  address: string;
  isLiked: boolean;
};

const mockProperties: Property[] = [
  {
    id: 1,
    rentType: "월세",
    title: "소사역힐스센텀",
    rating: 4.5,
    reviewCount: 10,
    address: "경기도 부천시 소사구 소사본동 123-4",
    isLiked: false,
  },
  {
    id: 2,
    rentType: "전세",
    title: "소사역힐스센텀",
    rating: 4.5,
    reviewCount: 10,
    address: "경기도 부천시 소사구 소사본동 45-7",
    isLiked: true,
  },
  {
    id: 3,
    rentType: "월세",
    title: "소사역힐스센텀",
    rating: 4.5,
    reviewCount: 10,
    address: "주소가 들어갑니다",
    isLiked: false,
  },
  {
    id: 4,
    rentType: "월세",
    title: "역곡역 더하우스",
    rating: 4.3,
    reviewCount: 8,
    address: "경기도 부천시 역곡동",
    isLiked: false,
  },
  {
    id: 5,
    rentType: "월세",
    title: "역곡 자취빌",
    rating: 4.7,
    reviewCount: 13,
    address: "경기도 부천시 역곡로 12",
    isLiked: false,
  },
  {
    id: 6,
    rentType: "월세",
    title: "소사역 원룸타운",
    rating: 4.2,
    reviewCount: 6,
    address: "주소가 들어갑니다",
    isLiked: false,
  },
  {
    id: 7,
    rentType: "전세",
    title: "역곡 스테이하우스",
    rating: 4.6,
    reviewCount: 11,
    address: "경기도 부천시 역곡동 88-2",
    isLiked: true,
  },
];

export default function SearchPage() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("역곡");
  const [properties, setProperties] = useState(mockProperties);

  const filteredProperties = useMemo(() => {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) return properties;

    return properties.filter(
      (property) =>
        property.title.includes(trimmedKeyword) ||
        property.address.includes(trimmedKeyword),
    );
  }, [keyword, properties]);

  const handleLikeClick = (propertyId: number) => {
    setProperties((prev) =>
      prev.map((property) =>
        property.id === propertyId
          ? { ...property, isLiked: !property.isLiked }
          : property,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 bg-white px-5 pb-5 pt-6">
        <SearchBar
          value={keyword}
          onChange={setKeyword}
          onSubmit={() => {
            console.log("검색어:", keyword);
          }}
        />
      </header>

      <main className="pb-36">
        <section>
          {filteredProperties.map((property) => (
            <PropertyListItem
              key={property.id}
              property={property}
              onClick={() => navigate(`/properties/${property.id}`)}
              onLikeClick={() => handleLikeClick(property.id)}
            />
          ))}
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}

interface PropertyListItemProps {
  property: Property;
  onClick: () => void;
  onLikeClick: () => void;
}

function PropertyListItem({
  property,
  onClick,
  onLikeClick,
}: PropertyListItemProps) {
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
              className="h-5 w-5 object-contain relative top-[1px]"
            />
            <span className="leading-none mt-1">{property.rating}</span>
            <span className="leading-none mt-1 ml-2">
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
          aria-label="찜하기"
          className="pt-1 transition active:scale-90"
        >
          <img
            src={property.isLiked ? filledHeartIcon : emptyHeartIcon}
            alt={property.isLiked ? "찜됨" : "찜하기"}
            className="h-6 w-6"
          />
        </button>
      </div>
    </article>
  );
}
