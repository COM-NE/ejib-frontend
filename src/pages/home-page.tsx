import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../components/common/Header";
import SearchBar from "../components/common/SearchBar";
import banner from "../assets/home/banner.png";
import dictionaryIcon from "../assets/home/book.svg";
import locationIcon from "../assets/home/location.svg";
import penIcon from "../assets/home/pen.svg";
import aiIcon from "../assets/home/ai.svg";
import heartIcon from "../assets/home/filled-heart.svg";
import verifiedIcon from "../assets/home/verified.svg";
import BottomNavigation from "../components/NavigationBar";

type Review = {
  id: number;
  image: string;
  roomType: string;
  title: string;
  location: string;
  content: string;
};

const reviews: Review[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267d?w=800&auto=format&fit=crop",
    roomType: "일반 원룸",
    title: "가톨릭대까지 160m",
    location: "서울 성북구 정릉동",
    content:
      "학교랑 가까워서 통학이 편했고, 주변이 조용해서 생활하기 좋았어요.",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop",
    roomType: "일반 원룸",
    title: "가톨릭대까지 200m",
    location: "서울 성북구 길음동",
    content: "건물 입구가 깨끗하고 CCTV가 있어서 혼자 살기에도 안심됐어요.",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop",
    roomType: "일반 원룸",
    title: "역이 가까워서 이동하기 정말 편했어요",
    location: "서울 강북구 미아동",
    content:
      "주변에 편의점이랑 식당이 많아서 자취 처음 하는 사람에게도 괜찮아요.",
  },
];

const quickMenus = [
  {
    title: "자취백과사전",
    icon: dictionaryIcon,
    path: "/dictionary",
  },
  {
    title: "내주변매물",
    icon: locationIcon,
    path: "/map",
  },
  {
    title: "후기작성",
    icon: penIcon,
    path: "/reviews/new",
  },
  {
    title: "AI매물추천",
    icon: aiIcon,
    path: "/ai",
  },
  {
    title: "찜리스트",
    icon: heartIcon,
    path: "/wishlist",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  return (
    <div className="min-h-screen bg-white">
      <Header
        variant="home"
        onNotificationClick={() => {
          console.log("알림 클릭");
        }}
      />

      <main className="px-5 pb-24">
        <section className="pt-4">
          <SearchBar
            value={keyword}
            onChange={setKeyword}
            onSubmit={() => {
              if (keyword.trim()) {
                navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
              } else {
                navigate("/search");
              }
            }}
          />
        </section>

        <section className="mt-6">
          <button
            type="button"
            onClick={() => navigate("/event")}
            className="block w-full overflow-hidden rounded-3xl"
          >
            <img
              src={banner}
              alt="실거주 후기 배너"
              className="w-full object-cover"
            />
          </button>
        </section>

        <section className="mt-5">
          <div className="grid grid-cols-5 gap-2">
            {quickMenus.map((menu) => (
              <button
                key={menu.title}
                type="button"
                onClick={() => navigate(menu.path)}
                className="flex flex-col items-center gap-2"
              >
                <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-[#F4F7FB]">
                  <img
                    src={menu.icon}
                    alt={menu.title}
                    className="h-8 w-8 object-contain"
                  />
                </div>

                <span className="whitespace-nowrap text-center text-xs font-[PretendardVariable] font-medium leading-tight text-gray-800">
                  {menu.title}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-[PretendardVariable] font-bold text-gray-900">
                최신 후기
              </h3>
            </div>

            <button
              type="button"
              onClick={() => navigate("/search")}
              className="text-sm font-[PretendardVariable] font-medium text-gray-500"
            >
              전체보기
            </button>
          </div>

          <div className="-mx-5 overflow-x-auto px-5 scrollbar-hide">
            <div className="flex gap-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onClick={() => navigate(`/reviews/${review.id}`)}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}

interface ReviewCardProps {
  review: Review;
  onClick: () => void;
}

function ReviewCard({ review, onClick }: ReviewCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-64 shrink-0 overflow-hidden rounded-3xl border border-gray-100 bg-white text-left shadow-sm hover:bg-gray-50"
    >
      <img
        src={review.image}
        alt={review.title}
        className="h-36 w-full object-cover"
      />

      <div className="p-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-[PretendardVariable] font-medium text-gray-700">
            {review.roomType}
          </span>

          <span className="flex items-center gap-1 rounded-full bg-[#EAF3FF] px-2 py-1 text-[11px] font-[PretendardVariable] font-medium text-[#2F80ED]">
            <img src={verifiedIcon} alt="실거주 인증" className="h-3.5 w-3.5" />
            실거주 인증
          </span>
        </div>

        <h4 className="mt-3 line-clamp-2 font-[PretendardVariable] font-semibold leading-snug text-gray-900">
          {review.title}
        </h4>

        <p className="mt-2 font-[PretendardVariable] text-xs text-gray-500">
          {review.location}
        </p>

        <p className="mt-2 font-[PretendardVariable] line-clamp-2 text-xs leading-relaxed text-gray-600">
          {review.content}
        </p>
      </div>
    </button>
  );
}
