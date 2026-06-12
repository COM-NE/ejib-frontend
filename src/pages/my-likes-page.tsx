import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/common/Header";
import BottomNavigation from "../components/NavigationBar";
import starIcon from "../assets/star.svg";
import filledHeartIcon from "../assets/home/filled-heart.svg";
import { getMyScrappedProperties, type ScrappedProperty } from "../api/user";
import { togglePropertyScrap } from "../api/property";

export default function MyLikesPage() {
  const navigate = useNavigate();

  const [likedProperties, setLikedProperties] = useState<ScrappedProperty[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unlikeLoadingId, setUnlikeLoadingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchLikedProperties = async () => {
      try {
        setLoading(true);
        setError("");

        const scraps = await getMyScrappedProperties();
        setLikedProperties(scraps);
      } catch (err) {
        console.error(err);
        setError("찜한 매물을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchLikedProperties();
  }, []);

  const handleUnlikeClick = async (propertyId: number) => {
    if (unlikeLoadingId !== null) return;

    const previousLikedProperties = likedProperties;

    try {
      setUnlikeLoadingId(propertyId);

      // 화면에서 먼저 제거
      setLikedProperties((prev) =>
        prev.filter((property) => property.id !== propertyId),
      );

      const scrapped = await togglePropertyScrap(propertyId);

      // 찜 페이지에서 하트를 누르면 보통 false가 와야 정상
      // 만약 true가 오면 아직 찜 상태라는 뜻이므로 다시 복구
      if (scrapped) {
        setLikedProperties(previousLikedProperties);
      }
    } catch (err) {
      console.error(err);

      // 실패하면 원래 목록 복구
      setLikedProperties(previousLikedProperties);

      alert("찜 해제에 실패했습니다.");
    } finally {
      setUnlikeLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header variant="page" title="내가 찜한 매물" showBack />

      <main className="pb-36">
        <section>
          {loading ? (
            <div className="flex min-h-[360px] items-center justify-center">
              <p className="font-[PretendardVariable] text-sm text-gray-400">
                찜한 매물을 불러오는 중입니다...
              </p>
            </div>
          ) : error ? (
            <div className="flex min-h-[360px] items-center justify-center">
              <p className="font-[PretendardVariable] text-sm text-red-500">
                {error}
              </p>
            </div>
          ) : likedProperties.length > 0 ? (
            likedProperties.map((property) => (
              <LikedPropertyListItem
                key={property.id}
                property={property}
                isUnlikeLoading={unlikeLoadingId === property.id}
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
  property: ScrappedProperty;
  isUnlikeLoading: boolean;
  onClick: () => void;
  onLikeClick: () => void;
}

function LikedPropertyListItem({
  property,
  isUnlikeLoading,
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

            <span className="mt-1 leading-none">
              {property.rating.toFixed(1)}
            </span>

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
          disabled={isUnlikeLoading}
          aria-label="찜 해제"
          className="pt-1 transition active:scale-90 disabled:opacity-50"
        >
          <img src={filledHeartIcon} alt="찜됨" className="h-6 w-6" />
        </button>
      </div>
    </article>
  );
}
