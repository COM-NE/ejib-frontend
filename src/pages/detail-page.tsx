import { forwardRef, useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/common/Header";
import BottomNavigation from "../components/NavigationBar";
import starIcon from "../assets/star.svg";
import emptyStarIcon from "../assets/starfit.svg";
import aiIcon from "../assets/home/ai.svg";
import {
  getPropertyDetail,
  getPropertyImages,
  getPropertyQna,
  createPropertyQuestion,
  createQuestionAnswer,
  togglePropertyScrap,
  type PropertyDetail,
  type QnaQuestion,
} from "../api/property";

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

function buildDetailInfo(property: PropertyDetail): DetailInfo[] {
  return [
    { label: "매물타입", value: property.propertyType },
    { label: "거래타입", value: property.transactionType },
    { label: "가격", value: `${property.monthlyRent}만원` },
    { label: "보증금", value: `${property.deposit}만원` },
    { label: "층", value: `지상 ${property.floor}층` },
    { label: "면적", value: `${property.area}m²` },
    { label: "부동산", value: property.agency },
    { label: "가톨릭대까지", value: `${property.distanceToSchool}m` },
    { label: "주소", value: property.propertyAddress },
    { label: "기타", value: property.description },
  ];
}

function buildScoreData(averageTotalScore: number) {
  return {
    총점수: averageTotalScore,
    집상태: averageTotalScore,
    시설물: averageTotalScore,
    인프라: averageTotalScore,
    치안: averageTotalScore,
    환경: averageTotalScore,
  };
}

const mockReview: Review = {
  id: 1,
  userName: "사용자이름",
  period: "3년 이상 거주 / 고층",
  rating: 4.0,
  date: "2026년 3월 작성",
  content:
    "학교와 가까워 이동이 편했고, 주변 편의시설도 적당히 있어 생활하기 좋았습니다.",
  scores: {
    집상태: 3.0,
    시설물: 2.0,
    인프라: 5.0,
    치안: 3.0,
    환경: 4.0,
  },
};

export default function DetailPage() {
  const { propertyId } = useParams();

  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [scrapLoading, setScrapLoading] = useState(false);

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [qnaList, setQnaList] = useState<QnaQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const tabs = useMemo(
    () => [
      { key: "info", label: "정보" },
      { key: "photo", label: "사진" },
      { key: "review", label: `리뷰 ${property?.reviewCount ?? 0}` },
      { key: "qa", label: "Q&A" },
    ],
    [property?.reviewCount],
  );

  const detailInfo = useMemo(() => {
    if (!property) return [];
    return buildDetailInfo(property);
  }, [property]);

  const totalScores = useMemo(() => {
    return buildScoreData(property?.averageTotalScore ?? 0);
  }, [property?.averageTotalScore]);

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      if (!propertyId) return;

      const numericPropertyId = Number(propertyId);

      if (Number.isNaN(numericPropertyId)) {
        setError("잘못된 매물 주소입니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [detailData, imageData, qnaData] = await Promise.all([
          getPropertyDetail(numericPropertyId),
          getPropertyImages(numericPropertyId),
          getPropertyQna(numericPropertyId),
        ]);

        setProperty(detailData);
        setPhotos(imageData.map((image) => image.imageUrl));
        setQnaList(qnaData);
      } catch (err) {
        console.error(err);
        setError("매물 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetail();
  }, [propertyId]);

  const handleCreateQuestion = async (content: string) => {
    if (!propertyId) return;

    const numericPropertyId = Number(propertyId);

    if (Number.isNaN(numericPropertyId)) {
      alert("잘못된 매물 주소입니다.");
      return;
    }

    try {
      const newQuestion = await createPropertyQuestion(
        numericPropertyId,
        content,
      );

      setQnaList((prev) => [newQuestion, ...prev]);
    } catch (err) {
      console.error(err);
      alert("질문 등록에 실패했습니다.");
    }
  };

  const handleCreateAnswer = async (questionId: number, content: string) => {
    try {
      const newAnswer = await createQuestionAnswer(questionId, content);

      setQnaList((prev) =>
        prev.map((question) =>
          question.id === questionId
            ? {
                ...question,
                answers: [...question.answers, newAnswer],
              }
            : question,
        ),
      );
    } catch (err) {
      console.error(err);
      alert("답변 등록에 실패했습니다.");
    }
  };

  const handleLikeClick = async () => {
    if (!propertyId || scrapLoading) return;

    const numericPropertyId = Number(propertyId);

    if (Number.isNaN(numericPropertyId)) {
      alert("잘못된 매물 주소입니다.");
      return;
    }

    const previousLiked = isLiked;

    try {
      setScrapLoading(true);

      // 먼저 UI를 바로 바꿔서 반응 빠르게 보이게 함
      setIsLiked((prev) => !prev);

      // 실제 서버 요청
      const scrapped = await togglePropertyScrap(numericPropertyId);

      // 서버 응답 기준으로 최종 반영
      setIsLiked(scrapped);
    } catch (err) {
      console.error(err);

      // 실패하면 원래 상태로 되돌림
      setIsLiked(previousLiked);

      alert("찜 상태 변경에 실패했습니다.");
    } finally {
      setScrapLoading(false);
    }
  };

  const handleTapClick = (key: string) => {
    setActiveTab(key);

    const targetRef = sectionRefs[key as keyof typeof sectionRefs].current;

    if (targetRef) {
      const elementPosition = targetRef.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - 104;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 110;

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F7F9]">
        <p className="font-[PretendardVariable] text-sm text-[#666666]">
          매물 정보를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F7F9] px-5">
        <p className="font-[PretendardVariable] text-sm text-red-500">
          {error || "매물 정보가 없습니다."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full bg-[#F6F7F9]">
      <div className="sticky top-0 z-50 bg-white">
        <Header
          variant="detail"
          title={property.propertyName}
          isLiked={isLiked}
          onLikeClick={handleLikeClick}
        />
      </div>

      <main className="pb-36">
        <section className="bg-white px-5 pb-6 pt-5">
          <h2 className="font-[PretendardVariable] text-xl font-semibold text-[#111111]">
            {property.propertyName}
          </h2>

          <p className="mt-2 font-[PretendardVariable] text-sm text-[#666666]">
            {property.propertyAddress}
          </p>

          <div className="mt-3 flex items-center gap-2 font-[PretendardVariable] text-base text-[#222222]">
            <img src={starIcon} alt="별점" className="h-5 w-5" />

            <span className="font-[PretendardVariable] font-medium">
              {property.averageTotalScore.toFixed(1)}
            </span>

            <span>후기 {property.reviewCount}개</span>
          </div>

          <div className="mt-2 flex items-center gap-2 font-[PretendardVariable] text-base font-medium text-[#333333]">
            <img src={aiIcon} alt="AI 리뷰 요약" className="h-5 w-5" />
            <span>AI 리뷰 요약</span>
          </div>

          <p className="mt-2 font-[PretendardVariable] text-sm leading-relaxed text-[#444444]">
            {property.description || "아직 등록된 설명이 없습니다."}
          </p>
        </section>

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

        <InfoSection ref={infoRef} info={detailInfo} />
        <PhotoSection ref={photoRef} photos={photos} />
        <ScoreSection ref={reviewRef} scores={totalScores} />

        {property.reviewCount > 0 ? (
          <ReviewSection review={mockReview} />
        ) : (
          <section className="mt-3 bg-white px-5 py-7">
            <h3 className="font-[PretendardVariable] text-lg font-medium text-[#111111]">
              이집 리뷰
            </h3>

            <p className="mt-4 font-[PretendardVariable] text-sm text-[#999999]">
              아직 등록된 리뷰가 없습니다.
            </p>
          </section>
        )}

        <QASection
          ref={qaRef}
          questions={qnaList}
          onCreateQuestion={handleCreateQuestion}
          onCreateAnswer={handleCreateAnswer}
        />
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

        {photos.length === 0 ? (
          <div className="flex h-36 items-center justify-center rounded-2xl bg-[#F1F3F5]">
            <p className="font-[PretendardVariable] text-sm text-[#999999]">
              등록된 사진이 없습니다.
            </p>
          </div>
        ) : (
          <div className="-mx-5 overflow-x-auto px-5">
            <div className="flex gap-3">
              {photos.map((photo, index) => (
                <button
                  key={`${photo}-${index}`}
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
        )}
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

type QASectionProps = {
  questions: QnaQuestion[];
  onCreateQuestion: (content: string) => Promise<void>;
  onCreateAnswer: (questionId: number, content: string) => Promise<void>;
};

const QASection = forwardRef<HTMLElement, QASectionProps>(
  ({ questions, onCreateQuestion, onCreateAnswer }, ref) => {
    const [openedQuestionId, setOpenedQuestionId] = useState<number | null>(
      null,
    );
    const [questionContent, setQuestionContent] = useState("");
    const [answerContents, setAnswerContents] = useState<
      Record<number, string>
    >({});
    const [questionSubmitting, setQuestionSubmitting] = useState(false);
    const [answerSubmittingId, setAnswerSubmittingId] = useState<number | null>(
      null,
    );

    const handleQuestionClick = (questionId: number) => {
      setOpenedQuestionId((prev) => (prev === questionId ? null : questionId));
    };

    const handleQuestionSubmit = async () => {
      const trimmedContent = questionContent.trim();

      if (!trimmedContent) {
        alert("질문 내용을 입력해주세요.");
        return;
      }

      try {
        setQuestionSubmitting(true);
        await onCreateQuestion(trimmedContent);
        setQuestionContent("");
      } finally {
        setQuestionSubmitting(false);
      }
    };

    const handleAnswerSubmit = async (questionId: number) => {
      const trimmedContent = answerContents[questionId]?.trim();

      if (!trimmedContent) {
        alert("답변 내용을 입력해주세요.");
        return;
      }

      try {
        setAnswerSubmittingId(questionId);
        await onCreateAnswer(questionId, trimmedContent);

        setAnswerContents((prev) => ({
          ...prev,
          [questionId]: "",
        }));
      } finally {
        setAnswerSubmittingId(null);
      }
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
            value={questionContent}
            onChange={(event) => setQuestionContent(event.target.value)}
            placeholder="질문을 작성해주세요"
            className="mt-4 h-20 w-full resize-none rounded-2xl bg-[#F3F5F9] px-4 py-4 font-[PretendardVariable] text-sm text-[#333333] outline-none placeholder:text-[#B7BBC3]"
          />

          <button
            type="button"
            onClick={handleQuestionSubmit}
            disabled={questionSubmitting}
            className="mt-3 h-10 w-full rounded-2xl bg-[#5060FE] font-[PretendardVariable] text-sm font-semibold text-white disabled:opacity-50"
          >
            {questionSubmitting ? "등록 중..." : "질문 등록"}
          </button>
        </div>

        <div className="mt-6 divide-y divide-[#E9ECF1] border-t border-[#E9ECF1]">
          {questions.length === 0 ? (
            <p className="py-6 font-[PretendardVariable] text-sm text-[#999999]">
              아직 등록된 질문이 없습니다.
            </p>
          ) : (
            questions.map((question) => {
              const isOpen = openedQuestionId === question.id;
              const answerContent = answerContents[question.id] ?? "";

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

                    <div className="flex-1">
                      <p className="font-[PretendardVariable] text-sm leading-relaxed text-[#333333]">
                        {question.content}
                      </p>

                      <p className="mt-1 font-[PretendardVariable] text-xs text-[#999999]">
                        {question.userNickname}
                      </p>
                    </div>

                    <span className="text-xl text-[#999999]">
                      {isOpen ? "⌃" : "⌄"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="pb-4 pl-1">
                      <div className="space-y-3">
                        {question.answers.length > 0 ? (
                          question.answers.map((answer) => (
                            <div key={answer.id} className="flex gap-3">
                              <span className="font-[PretendardVariable] text-lg font-semibold text-[#FF6B6B]">
                                A.
                              </span>

                              <div>
                                <p className="pt-0.5 font-[PretendardVariable] text-sm leading-relaxed text-[#444444]">
                                  {answer.content}
                                </p>

                                <p className="mt-1 font-[PretendardVariable] text-xs text-[#999999]">
                                  {answer.userNickname}
                                </p>
                              </div>
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
                        value={answerContent}
                        onChange={(event) =>
                          setAnswerContents((prev) => ({
                            ...prev,
                            [question.id]: event.target.value,
                          }))
                        }
                        placeholder="답변을 작성해주세요"
                        className="mt-4 h-12 w-full resize-none rounded-2xl bg-[#F3F5F9] px-4 py-3 font-[PretendardVariable] text-sm text-[#333333] outline-none placeholder:text-[#B7BBC3]"
                      />

                      <button
                        type="button"
                        onClick={() => handleAnswerSubmit(question.id)}
                        disabled={answerSubmittingId === question.id}
                        className="mt-3 h-9 w-full rounded-2xl bg-[#5060FE] font-[PretendardVariable] text-sm font-semibold text-white disabled:opacity-50"
                      >
                        {answerSubmittingId === question.id
                          ? "등록 중..."
                          : "답변 등록"}
                      </button>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </section>
    );
  },
);

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
