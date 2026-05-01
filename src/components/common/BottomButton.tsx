import type { ReactNode } from "react";

interface BottomButtonProps {
  buttons: {
    text: string;
    onClick: () => void;
    variant?: "primary" | "kakao" | "outline";
    disabled?: boolean;
    leftIcon?: ReactNode;
  }[];
}

const BottomButton = ({ buttons }: BottomButtonProps) => {
  const getButtonStyle = (
    variant: "primary" | "kakao" | "outline" = "primary",
    disabled?: boolean,
  ) => {
    if (disabled) {
      return "bg-[#DEE4EB] text-[#ABABAB] cursor-not-allowed";
    }

    switch (variant) {
      case "kakao":
        return "bg-[#FEE500] text-[#111111] hover:bg-[#FFE812]";

      case "outline":
        return "bg-white text-[#5060FE] border border-[#5060FE] hover:bg-[#F6F7FF]";

      case "primary":
      default:
        return "bg-[#5060FE] text-white hover:brightness-95";
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto">
      <div className="flex items-center justify-center gap-3 px-3 pb-6">
        {buttons.map(({ text, onClick, variant, disabled, leftIcon }, idx) => (
          <button
            type="button"
            key={`${text}-${idx}`}
            onClick={onClick}
            disabled={disabled}
            className={`
                flex-1 h-[56px]
                rounded-[12px]
                flex items-center justify-center gap-2
                font-[PretendardVariable] font-semibold text-[16px]
                transition active:scale-[0.98]
                ${disabled ? "" : "cursor-pointer"}
                ${getButtonStyle(variant, disabled)}
              `}
          >
            {leftIcon && leftIcon}
            <span>{text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomButton;
