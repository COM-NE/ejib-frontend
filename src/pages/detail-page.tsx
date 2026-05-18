import { forwardRef, useState, useEffect, useRef } from "react";
import Header from "../components/common/Header";
import BottomNavigation from "../components/NavigationBar";
import starIcon from "../assets/star.svg";
import emptyStarIcon from "../assets/starfit.svg";
import aiIcon from "../assets/home/ai.svg";

type ScoreKey = "집상태" | "시설물" | "인프라" | "치안" | "환경";

type DetailInfo = {
  label: string;
  value: string;
};

type Review = {
  id: number;
  userName: string;
  period: string;
  rating: number;
  date: string;
  content: string;
  scores: Record<ScoreKey, number>;
};

const detailData = {
  id: 1,
  name: "소사역힐스센텀",
  addressTitle: "매물 주소가 들어갑니다",
  address: "경기도 부천시 원미구 지봉로45번길 14",
  rating: 4.5,
  reviewCount: 10,
  aiSummary:
    "계절이 지나가는 하늘에는 가을로 가득 차 있습니다. 어머님, 그리고 당신은 멀리 북간도에 계십니다.",
  info: [
    { label: "매물타입", value: "일반원룸" },
    { label: "거래타입", value: "월세" },
    { label: "가격", value: "50만원" },
    { label: "보증금", value: "500만원" },
    { label: "층", value: "지상 3층" },
    { label: "면적", value: "17m²" },
    { label: "부동산", value: "상상부동산공인중개사사무소" },
    { label: "가톨릭대까지", value: "160m" },
    { label: "주소", value: "경기도 부천시 원미구 지봉로45번길 14" },
    { label: "기타", value: "가톨릭대 정문앞 원룸 월세" },
  ] satisfies DetailInfo[],
  photos: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267d?w=700&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=700&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=700&auto=format&fit=crop",
  ],
  totalScores: {
    총점수: 4.0,
    집상태: 3.0,
    시설물: 2.0,
    인프라: 5.0,
    치안: 3.0,
    환경: 4.0,
  },
  review: {
    id: 1,
    userName: "사용자이름",
    period: "3년 이상 거주 / 고층",
    rating: 4.0,
    date: "2026년 3월 작성",
    content:
      "계절이 지나가는 하늘에는 가을로 가득 차 있습니다. 어머님, 그리고 당신은 멀리 북간도에 계십니다. 학교와 가까워 이동이 편했고, 주변 편의시설도 적당히 있어 생활하기 좋았습니다.",
    scores: {
      집상태: 3.0,
      시설물: 2.0,
      인프라: 5.0,
      치안: 3.0,
      환경: 4.0,
    },
  } satisfies Review,
};

const questions = [
  {
    id: 1,
    content:
      "소사역힐스센텀은 역세권인가요? 근처에 가까운 버스 정류장이 있나요?",
    answers: [
      "네 근처에 소사역이 있습니다.",
      "소사역 앞에 가까운 버스 정류장이 있어요.",
    ],
  },
  {
    id: 2,
    content:
      "소사역힐스센텀은 역세권인가요? 근처에 가까운 버스 정류장이 있나요?",
    answers: ["네 근처에 소사역이 있습니다."],
  },
  {
    id: 3,
    content:
      "소사역힐스센텀은 역세권인가요? 근처에 가까운 버스 정류장이 있나요?",
    answers: [],
  },
];

const tabs = [
  { key: "info", label: "정보" },
  { key: "photo", label: "사진" },
  { key: "review", label: `리뷰 ${detailData.reviewCount}` },
  { key: "qa", label: "Q&A" },
];

export default function DetailPage() {
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  const infoRef = useRef<HTMLElement | null>(null);
  const photoRef = useRef<HTMLElement | null>(null);
  const reviewRef = useRef<HTMLElement | null>(null);
  const qaRef = useRef<HTMLElement | null>(null);

  const sectionRefs = {
    info: infoRef,
    photo: photoRef,
    review: reviewRef,
    qa: qaRef,
  };

  const handleTapClick = (key: string) => {
    setActiveTab(key);

    const targetRef = sectionRefs[key as keyof typeof sectionRefs].current;
    if (targetRef) {
      // 탭 고정 높이(48px) + 헤더 고정 높이(56px) = 104px 만큼 여백을 두고 스크롤
      const elementPosition = targetRef.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - 104;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // 스크롤 위치 감지하여 현재 보고 있는 섹션의 탭 활성화하기
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 110; // 여유 오차 바이어스 추가

      // const infoTop = infoRef.current?.offsetTop ?? 0;
      const photoTop = photoRef.current?.offsetTop ?? 0;
      const reviewTop = reviewRef.current?.offsetTop ?? 0;
      const qaTop = qaRef.current?.offsetTop ?? 0;

      if (scrollPosition >= qaTop) {
        setActiveTab("qa");
      } else if (scrollPosition >= reviewTop) {
        setActiveTab("review");
      } else if (scrollPosition >= photoTop) {
        setActiveTab("photo");
      } else {
        setActiveTab("info");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F7F9] w-full max-w-full">
      {/* 상단 고정 헤더 */}
      <div className="sticky top-0 z-50 bg-white">
        <Header
          variant="detail"
          title={detailData.name}
          isLiked={isLiked}
          onLikeClick={() => setIsLiked((prev) => !prev)}
        />
      </div>

      {/* main 태그 내 overflow-x-hidden 삭제 (sticky 무력화 원인 방지) */}
      <main className="pb-36">
        <section className="bg-white px-5 pb-6 pt-5">
          <h2 className="font-[PretendardVariable] text-xl font-semibold text-[#111111]">
            {detailData.addressTitle}
          </h2>

          <div className="mt-3 flex items-center gap-2 font-[PretendardVariable] text-base text-[#222222]">
            <img src={starIcon} alt="별점" className="h-5 w-5" />
            <span className="font-[PretendardVariable] font-medium">
              {detailData.rating}
            </span>
            <span>후기 {detailData.reviewCount}개</span>
          </div>

          <div className="mt-2 flex items-center gap-2 font-[PretendardVariable] text-base font-medium text-[#333333]">
            <img src={aiIcon} alt="AI 리뷰 요약" className="h-5 w-5" />
            <span>AI 리뷰 요약</span>
          </div>

          <p className="mt-2 font-[PretendardVariable] text-sm leading-relaxed text-[#444444]">
            {detailData.aiSummary}
          </p>
        </section>

        {/* 따라다니는 스티키 내비게이션 바 */}
        <nav className="sticky top-[56px] z-40 grid grid-cols-4 border-b border-[#E1E4EA] bg-white shadow-sm">
          {tabs.map((tab) => {
            const active = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTapClick(tab.key)}
                className={`relative h-12 font-[PretendardVariable] text-base transition-colors ${
                  active ? "font-semibold text-[#5060FE]" : "text-[#222222]"
                }`}
              >
                {tab.label}

                {active && (
                  <span className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-[#5060FE]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* 각 섹션 컴포넌트 */}
        <InfoSection ref={infoRef} info={detailData.info} />
        <PhotoSection ref={photoRef} photos={detailData.photos} />
        <ScoreSection ref={reviewRef} scores={detailData.totalScores} />
        <ReviewSection review={detailData.review} />
        <QASection ref={qaRef} />
      </main>

      <BottomNavigation />
    </div>
  );
}

// 이하 하부 컴포넌트 (InfoSection, PhotoSection, ScoreSection, QASection, RadarChart, ReviewSection, StarRating 등)의 구현 및 클래스는 원본과 완벽하게 동일합니다.
const InfoSection = forwardRef<HTMLElement, { info: DetailInfo[] }>(
  ({ info }, ref) => {
    return (
      <section ref={ref} className="scroll-mt-[104px] bg-white px-5 py-7">
        <div className="space-y-5">
          {info.map((item) => (
            <div
              key={item.label}
              className="grid grid-cols-[110px_1fr] gap-4 font-[PretendardVariable] text-base"
            >
              <dt className="font-medium text-[#656565]">{item.label}</dt>
              <dd className="font-medium text-[#2C2C2C]">{item.value}</dd>
            </div>
          ))}
        </div>
      </section>
    );
  },
);

const PhotoSection = forwardRef<HTMLElement, { photos: string[] }>(
  ({ photos }, ref) => {
    return (
      <section
        ref={ref}
        className="scroll-mt-[104px] mt-3 bg-white px-5 py-7 shadow-[0_-2px_10px_rgba(0,0,0,0.04)]"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-[PretendardVariable] text-lg font-medium text-[#111111]">
            실거주 사진
          </h3>

          <button
            type="button"
            className="font-[PretendardVariable] text-sm font-medium text-[#666666]"
          >
            자세히 보기 &gt;
          </button>
        </div>

        <div className="-mx-5 overflow-x-auto px-5">
          <div className="flex gap-3">
            {photos.map((photo, index) => (
              <button
                key={photo}
                type="button"
                className="h-36 w-36 shrink-0 overflow-hidden rounded-2xl bg-[#F1F3F5]"
              >
                <img
                  src={photo}
                  alt={`실거주 사진 ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

const ScoreSection = forwardRef<
  HTMLElement,
  {
    scores: {
      총점수: number;
      집상태: number;
      시설물: number;
      인프라: number;
      치안: number;
      환경: number;
    };
  }
>(({ scores }, ref) => {
  const scoreItems = [
    { label: "총점수", value: scores.총점수 },
    { label: "집상태", value: scores.집상태 },
    { label: "시설물", value: scores.시설물 },
    { label: "인프라", value: scores.인프라 },
    { label: "치안", value: scores.치안 },
    { label: "환경", value: scores.환경 },
  ];

  return (
    <section ref={ref} className="scroll-mt-[104px] mt-3 bg-white px-2 py-7">
      <h3 className="font-[PretendardVariable] text-lg font-medium text-[#111111] px-3">
        이집 총 점수
      </h3>

      <div className="mt-6 flex items-center gap-5">
        <RadarChart scores={scores} />

        <div className="min-w-0 flex-1 space-y-2">
          {scoreItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between font-[PretendardVariable]"
            >
              <span className="w-10 shrink-0 text-sm font-medium text-[#333333]">
                {item.label}
              </span>

              <div className="flex items-center gap-2">
                <StarRating value={item.value} />
                <span className="w-7 text-sm font-semibold text-[#333333]">
                  {item.value.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

const QASection = forwardRef<HTMLElement>((_, ref) => {
  const [openedQuestionId, setOpenedQuestionId] = useState<number | null>(null);

  const handleQuestionClick = (questionId: number) => {
    setOpenedQuestionId((prev) => (prev === questionId ? null : questionId));
  };

  return (
    <section
      ref={ref}
      className="scroll-mt-[104px] mt-3 bg-white px-5 pb-32 pt-7"
    >
      <h3 className="font-[PretendardVariable] text-lg font-medium text-[#111111]">
        Q&A
      </h3>

      <div className="mt-6">
        <p className="font-[PretendardVariable] text-base font-medium text-[#111111]">
          질문 남기기
        </p>

        <textarea
          placeholder="질문을 작성해주세요"
          className="mt-4 h-20 w-full resize-none rounded-2xl bg-[#F3F5F9] px-4 py-4 font-[PretendardVariable] text-sm text-[#333333] outline-none placeholder:text-[#B7BBC3]"
        />
      </div>

      <div className="mt-6 divide-y divide-[#E9ECF1] border-t border-[#E9ECF1]">
        {questions.map((question) => {
          const isOpen = openedQuestionId === question.id;

          return (
            <article key={question.id}>
              <button
                type="button"
                onClick={() => handleQuestionClick(question.id)}
                className="flex w-full items-center gap-3 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-[PretendardVariable] text-xl font-semibold text-[#5060FE]">
                  Q.
                </span>

                <p className="flex-1 font-[PretendardVariable] text-sm leading-relaxed text-[#333333]">
                  {question.content}
                </p>

                <span className="text-xl text-[#999999]">
                  {isOpen ? "⌃" : "⌄"}
                </span>
              </button>

              {isOpen && (
                <div className="pb-4 pl-1">
                  <div className="space-y-3">
                    {question.answers.length > 0 ? (
                      question.answers.map((answer, index) => (
                        <div key={index} className="flex gap-3">
                          <span className="font-[PretendardVariable] text-lg font-semibold text-[#FF6B6B]">
                            A.
                          </span>

                          <p className="pt-0.5 font-[PretendardVariable] text-sm leading-relaxed text-[#444444]">
                            {answer}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="flex gap-3">
                        <span className="font-[PretendardVariable] text-lg font-semibold text-[#FF6B6B]">
                          A.
                        </span>

                        <p className="pt-0.5 font-[PretendardVariable] text-sm text-[#999999]">
                          아직 등록된 답변이 없습니다.
                        </p>
                      </div>
                    )}
                  </div>

                  <textarea
                    placeholder="답변을 작성해주세요"
                    className="mt-4 h-12 w-full resize-none rounded-2xl bg-[#F3F5F9] px-4 py-3 font-[PretendardVariable] text-sm text-[#333333] outline-none placeholder:text-[#B7BBC3]"
                  />
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
});

function RadarChart({ scores }: { scores: Record<ScoreKey, number> }) {
  const center = 80;
  const maxRadius = 55;
  const maxScore = 5;

  const axes: { key: ScoreKey; label: string }[] = [
    { key: "집상태", label: "집상태" },
    { key: "치안", label: "치안" },
    { key: "환경", label: "환경" },
    { key: "인프라", label: "인프라" },
    { key: "시설물", label: "시설물" },
  ];

  const getPoint = (index: number, value: number) => {
    const angle = -90 + (360 / axes.length) * index;
    const radius = (value / maxScore) * maxRadius;
    const radian = (Math.PI / 180) * angle;

    return {
      x: center + radius * Math.cos(radian),
      y: center + radius * Math.sin(radian),
    };
  };

  const getMaxPoint = (index: number) => {
    return getPoint(index, maxScore);
  };

  const makePolygonPoints = (level: number) => {
    return axes
      .map((_, index) => {
        const point = getPoint(index, level);
        return `${point.x},${point.y}`;
      })
      .join(" ");
  };

  const scorePolygonPoints = axes
    .map((axis, index) => {
      const point = getPoint(index, scores[axis.key]);
      return `${point.x},${point.y}`;
    })
    .join(" ");

  return (
    <div className="h-40 w-40 shrink-0">
      <svg viewBox="0 0 160 160" className="h-full w-full">
        {[1, 2, 3, 4, 5].map((level) => (
          <polygon
            key={level}
            points={makePolygonPoints(level)}
            fill="none"
            stroke="#E1E4EA"
            strokeWidth="1"
          />
        ))}

        {axes.map((_, index) => {
          const end = getMaxPoint(index);

          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke="#E1E4EA"
              strokeWidth="1"
            />
          );
        })}

        <polygon
          points={scorePolygonPoints}
          fill="#6677FF"
          fillOpacity="0.5"
          stroke="#5060FE"
          strokeWidth="1.5"
        />

        {axes.map((axis, index) => {
          const labelPoint = getPoint(index, 6);

          return (
            <text
              key={axis.key}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="11"
              fontWeight="600"
              fill="#333333"
            >
              {axis.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function ReviewSection({ review }: { review: Review }) {
  const scoreEntries = Object.entries(review.scores) as [ScoreKey, number][];

  return (
    <section className="mt-3 bg-white px-5 py-7">
      <div className="flex items-center justify-between">
        <h3 className="font-[PretendardVariable] text-lg font-medium text-[#111111]">
          이집 리뷰
        </h3>

        <button
          type="button"
          className="font-[PretendardVariable] text-sm font-medium text-[#5060FE]"
        >
          전체보기
        </button>
      </div>

      <article className="mt-5 rounded-3xl border border-[#E9ECF1] bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-[PretendardVariable] text-sm font-semibold text-[#222222]">
                {review.userName}
              </span>

              <span className="rounded-full bg-[#EEF0FF] px-2.5 py-1 font-[PretendardVariable] text-xs font-semibold text-[#5060FE]">
                실거주 인증
              </span>
            </div>

            <p className="mt-1 font-[PretendardVariable] text-xs text-[#999999]">
              {review.period}
            </p>
          </div>

          <span className="shrink-0 font-[PretendardVariable] text-xs text-[#B0B0B0]">
            {review.date}
          </span>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <StarRating value={review.rating} size="text-[20px]" />

          <span className="font-[PretendardVariable] text-xl font-semibold text-[#222222]">
            {review.rating.toFixed(1)}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3">
          {scoreEntries.map(([label, value]) => (
            <div key={label}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="font-[PretendardVariable] text-xs font-medium text-[#666666]">
                  {label}
                </span>

                <span className="font-[PretendardVariable] text-xs font-semibold text-[#5060FE]">
                  {value.toFixed(1)}
                </span>
              </div>

              <div className="h-1.5 rounded-full bg-[#E4E7EF]">
                <div
                  className="h-full rounded-full bg-[#AEB8FF]"
                  style={{ width: `${(value / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-5 font-[PretendardVariable] text-sm leading-relaxed text-[#333333]">
          {review.content}
        </p>
      </article>
    </section>
  );
}

function StarRating({
  value,
  size = "h-[18px] w-[18px]", // 이미지 크기를 유연하게 조절할 수 있도록 기본 스타일 변경
}: {
  value: number;
  size?: string;
}) {
  const rounded = Math.round(value);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => {
        const isFilled = index < rounded;

        return (
          <img
            key={index}
            src={isFilled ? starIcon : emptyStarIcon}
            alt={isFilled ? "채워진 별" : "빈 별"}
            // 부모 섹션에서 크기를 입맛대로 넘겨받을 수 있도록 처리
            className={`${size} shrink-0 object-contain`}
          />
        );
      })}
    </div>
  );
}
