import { useEffect, useState } from "react";
import Header from "../components/common/Header";
import BottomNavigation from "../components/NavigationBar";
import zibiYellow from "../assets/onboarding/zibi-yellow.png";
import { useReviewStore } from "../store/reviewStore";
import { getMyProfile, type MyProfile } from "../api/user";
import { postLogout } from "../api/authApi";

const myActivities = [
  {
    label: "내가 쓴 리뷰",
    path: "/my/reviews",
  },
  {
    label: "내가 찜한 매물",
    path: "/my/likes",
  },
];

const myInfo = [
  {
    label: "회원 정보 수정",
    path: "/my/profile",
  },
];

export default function MyPage() {
  const [user, setUser] = useState<MyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { resetReview } = useReviewStore();

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const profile = await getMyProfile();
        setUser(profile);
      } catch (err) {
        console.error(err);
        setError("프로필 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyProfile();
  }, []);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      if (refreshToken) {
        await postLogout(refreshToken);
      }
    } catch (err) {
      console.error(err);
      alert("서버 로그아웃 요청에 실패했습니다.");
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("review-storage");

      resetReview();

      window.location.href = "/login";
    }
  };

  if (loading) {
    return (
      <main className="relative mx-auto flex min-h-screen max-w-[430px] items-center justify-center bg-white pb-28 text-[#111111]">
        <p className="font-[PretendardVariable] text-sm text-[#999999]">
          프로필 정보를 불러오는 중입니다...
        </p>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="relative mx-auto flex min-h-screen max-w-[430px] items-center justify-center bg-white pb-28 text-[#111111]">
        <p className="font-[PretendardVariable] text-sm text-red-500">
          {error || "프로필 정보가 없습니다."}
        </p>
      </main>
    );
  }

  return (
    <main className="relative mx-auto min-h-screen max-w-[430px] bg-white pb-28 text-[#111111]">
      <Header variant="page" title="마이페이지" />

      <div className="flex items-center justify-between px-5 pt-5">
        <div className="flex items-center gap-4">
          <div className="flex h-[66px] w-[66px] items-center justify-center rounded-full bg-[#F7F8FB]">
            <img
              src={zibiYellow}
              alt="프로필 이미지"
              className="h-12 w-12 object-contain"
            />
          </div>

          <p className="font-[PretendardVariable] text-xl font-semibold">
            {user.nickname}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full border border-[#E0E0E0] px-3 py-1 font-[PretendardVariable] text-[11px] font-medium text-[#B0B0B0] hover:bg-gray-100"
        >
          로그아웃
        </button>
      </div>

      <div className="mx-5 mt-7 rounded-lg bg-[#5060FE] px-4 py-4 text-white">
        <p className="font-[PretendardVariable] text-md opacity-90">
          내 포인트
        </p>
        <p className="mt-2 font-[PretendardVariable] text-lg font-bold">
          {user.point.toLocaleString()}원
        </p>
      </div>

      <div className="mx-5 mt-6 h-px bg-[#E5E5E5]" />

      <section className="px-5 py-8">
        <h2 className="font-[PretendardVariable] text-md font-medium">
          내 활동
        </h2>

        <div className="mt-5 space-y-6">
          {myActivities.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                window.location.href = item.path;
              }}
              className="block w-full text-left font-[PretendardVariable] text-base text-md"
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <div className="mx-5 h-px bg-[#E5E5E5]" />

      <section className="px-5 py-8">
        <h2 className="font-[PretendardVariable] text-md font-medium">
          내 정보
        </h2>

        <div className="mt-5 space-y-6">
          {myInfo.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                window.location.href = item.path;
              }}
              className="block w-full text-left font-[PretendardVariable] text-base text-md"
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <BottomNavigation />
    </main>
  );
}
