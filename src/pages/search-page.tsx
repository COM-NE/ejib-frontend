import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchProperties, togglePropertyScrap } from "../api/property";
import SearchBar from "../components/common/SearchBar";
import BottomNavigation from "../components/NavigationBar";
import starIcon from "../assets/star.svg";
import emptyHeartIcon from "../assets/home/empty-heart.svg";
import filledHeartIcon from "../assets/home/filled-heart.svg";

type RentType = "월세" | "전세";

export type Property = {
  id: number;
  rentType: RentType;
  title: string;
  rating: number;
  reviewCount: number;
  address: string;
  isLiked: boolean;
};

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const keywordFromUrl = searchParams.get("keyword") ?? "";

  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchProperties = useCallback(async (searchKeyword: string) => {
    const trimmedKeyword = searchKeyword.trim();

    if (!trimmedKeyword) return;

    try {
      setLoading(true);
      setError("");
      setHasSearched(true);

      const result = await searchProperties(trimmedKeyword);

      if (result.length === 0) {
        setProperties([]);
        setError("검색 결과가 없습니다.");
        return;
      }

      setProperties(result);
    } catch (err) {
      console.error(err);
      setProperties([]);
      setError("매물 검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const trimmedKeyword = keywordFromUrl.trim();

    if (!trimmedKeyword) return;

    setKeyword(trimmedKeyword);
    fetchProperties(trimmedKeyword);
  }, [keywordFromUrl, fetchProperties]);

  const handleLikeClick = async (propertyId: number) => {
    const targetProperty = properties.find(
      (property) => property.id === propertyId,
    );

    if (!targetProperty) return;

    const previousLiked = targetProperty.isLiked;

    try {
      // 먼저 화면에서 바로 바뀌게 처리
      setProperties((prev) =>
        prev.map((property) =>
          property.id === propertyId
            ? { ...property, isLiked: !property.isLiked }
            : property,
        ),
      );

      // 서버에 찜 상태 변경 요청
      const scrapped = await togglePropertyScrap(propertyId);

      // 서버 응답 기준으로 최종 반영
      setProperties((prev) =>
        prev.map((property) =>
          property.id === propertyId
            ? { ...property, isLiked: scrapped }
            : property,
        ),
      );
    } catch (err) {
      console.error(err);

      // 실패하면 원래 상태로 되돌림
      setProperties((prev) =>
        prev.map((property) =>
          property.id === propertyId
            ? { ...property, isLiked: previousLiked }
            : property,
        ),
      );

      alert("찜 상태 변경에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 bg-white px-5 pb-8 pt-6">
        <SearchBar
          value={keyword}
          onChange={setKeyword}
          onSubmit={() => {
            const trimmedKeyword = keyword.trim();

            if (!trimmedKeyword) return;

            setSearchParams({ keyword: trimmedKeyword });
          }}
        />
      </header>

      <main className="pb-36">
        {loading && (
          <p className="px-5 py-4 text-[15px] text-[#666666]">
            매물을 검색하는 중입니다...
          </p>
        )}

        {!loading && error && (
          <p className="px-5 py-4 text-[15px] text-red-500">{error}</p>
        )}

        {!loading && !error && !hasSearched && (
          <p className="px-5 py-4 text-[15px] text-[#666666]">
            매물명을 검색해보세요.
          </p>
        )}

        {!loading && !error && properties.length > 0 && (
          <section>
            {properties.map((property) => (
              <PropertyListItem
                key={property.id}
                property={property}
                onClick={() => navigate(`/properties/${property.id}`)}
                onLikeClick={() => handleLikeClick(property.id)}
              />
            ))}
          </section>
        )}
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
          onClick={(e) => {
            e.stopPropagation();
            onLikeClick();
          }}
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
