import BottomButton from "../components/common/BottomButton";

interface RegisterLayoutProps {
  step: number;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  buttonContext: string;
  onNext: () => void;
  disabled?: boolean;
}

const RegisterLayout = ({
  step,
  title,
  subtitle,
  children,
  buttonContext,
  onNext,
  disabled = false,
}: RegisterLayoutProps) => {
  const progress = (step / 4) * 100;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-4 pb-6 pt-8">
        {/* 진행 바 */}
        <div className="h-2 w-full rounded-full bg-[#D1D1D1]">
          <div
            className="h-2 rounded-full bg-[#5060FE] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 타이틀 영역 */}
        <div className="mt-8">
          <h1 className="text-xl font-[PretendardVariable] font-semibold leading-tight text-[#111111]">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-2 text-[15px] font-[PretendardVariable] font-light text-[#656565]">
              {subtitle}
            </p>
          )}
        </div>

        {/* 페이지별 내용 */}
        <div className="mt-6">{children}</div>
      </div>

      {/* 하단 버튼 */}
      <BottomButton
        buttons={[
          {
            text: buttonContext,
            onClick: onNext,
            variant: "primary",
            disabled,
          },
        ]}
      />
    </div>
  );
};

export default RegisterLayout;
