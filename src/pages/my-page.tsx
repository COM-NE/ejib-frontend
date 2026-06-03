import Header from "../components/common/Header";
import BottomNavigation from "../components/NavigationBar";
import zibi from "../assets/onboarding/zibi-yellow.png";

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

function MyPage() {
  const user = {
    name: "김가대",
    point: 5320,
  };

  const handleLogout = () => {
    // 나중에 실제 로그아웃 API / 토큰 삭제 로직 연결
    console.log("logout");
  };

  return (
    <main className="relative mx-auto min-h-screen max-w-[430px] bg-white pb-28 text-[#111111]">
      <Header variant="page" title="마이페이지" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-[66px] w-[66px] items-center justify-center rounded-full bg-[#F7F8FB]">
            <img
              src={zibi}
              alt="프로필 이미지"
              className="h-12 w-12 object-contain"
            />
          </div>

          <p className="text-xl font-semibold font-[PretendardVariable]">
            {user.name}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full border border-[#E0E0E0] px-3 py-1 text-[11px] text-[#B0B0B0] font-[PretendardVariable] font-medium hover:bg-gray-100"
        >
          로그아웃
        </button>
      </div>

      <div className="mt-7 rounded-lg bg-[#5060FE] px-4 py-4 text-white">
        <p className="text-md font-[PretendardVariable] opacity-90">
          내 포인트
        </p>
        <p className="mt-2 text-lg font-bold font-[PretendardVariable]">
          {user.point.toLocaleString()}원
        </p>
      </div>

      <div className="mt-6 h-px bg-[#E5E5E5]" />

      <section className="py-8">
        <h2 className="text-md font-[PretendardVariable] font-medium">
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
              className="block w-full text-left text-base font-[PretendardVariable] text-md"
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <div className="h-px bg-[#E5E5E5]" />

      <section className="py-8">
        <h2 className="text-md font-[PretendardVariable] font-medium">
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
              className="block w-full text-left text-base font-[PretendardVariable] text-md"
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

export default MyPage;
