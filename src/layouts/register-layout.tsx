import BottomButton from "../components/common/BottomButton";

interface RegisterLayoutProps {
  step: number;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  buttonContext: string;
  onNext: () => void | Promise<void>;
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
  const progress = (step / 5) * 100;

  return (
    <div className="flex min-h-screen flex-col">
      <div className="px-4 pb-6 pt-8">
        <div className="h-2 w-full rounded-full bg-[#D1D1D1]">
          <div
            className="h-2 rounded-full bg-[#5060FE] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-8">
          <h1 className="font-[PretendardVariable] text-xl font-semibold leading-tight text-[#111111]">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-2 font-[PretendardVariable] text-[15px] font-light text-[#656565]">
              {subtitle}
            </p>
          )}
        </div>

        <div className="mt-6">{children}</div>
      </div>

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
