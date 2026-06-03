import zibiBlue from "../assets/onboarding/zibi-blue.png";

interface AiLoadingPageProps {
  title?: string;
  description?: string;
}

export default function AiLoadingPage({ 
  title = "원하시는 매물을 찾고있어요", 
  description = "잠시만 기다려주세요" 
}: AiLoadingPageProps) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white">
      <div className="relative mb-10 flex h-[187px] w-[187px] items-center justify-center">
        <svg
          width="187"
          height="187"
          viewBox="0 0 187 187"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute"
        >
          <circle cx="93.5" cy="93.5" r="92.5" stroke="#D1D1D1" strokeWidth="2" />
        </svg>

        <svg
          width="187"
          height="187"
          viewBox="0 0 187 187"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute animate-spin"
        >
          <path
            d="M128.442 7C162.459 20.8273 186.442 54.2068 186.442 93.1885C186.442 144.551 144.805 186.188 93.4424 186.188C68.9205 186.188 46.6157 176.697 30 161.188H32.9688C49.0451 175.496 70.2285 184.188 93.4424 184.188C143.7 184.188 184.442 143.446 184.442 93.1885C184.442 55.3334 161.327 22.878 128.442 9.16406V7Z"
            fill="#5060FE"
          />
        </svg>

        {/* Center Image */}
        <img
          src={zibiBlue}
          alt="Loading..."
          className="relative h-[106px] w-[106px] object-contain"
        />
      </div>

      {/* Text Content */}
      <div className="flex flex-col items-center gap-1 px-8 text-center">
        <p className="text-xl font-bold text-[#1f1f1f]">
          {title}
        </p>
        <p className="text-sm font-medium text-[#656565]">
          {description}
        </p>
      </div>
    </div>
  );
}
