import { useState, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  suffix?: string;
  showCount?: boolean;
  maxLength?: number;
}

export default function Input({
  label,
  suffix,
  showCount,
  maxLength,
  value,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const hasValue = value !== undefined && value !== "";

  // Container styling based on state
  const getContainerStyle = () => {
    if (isFocused) {
      return "bg-white border border-[#5060fe]";
    }
    return "bg-[#f4f7fb] border-none";
  };

  // Text styling based on state
  const getTextStyle = () => {
    if (hasValue || isFocused) {
      return "text-[#2c2c2c]";
    }
    return "text-[#ababab]";
  };

  return (
    <div className="flex w-full flex-col justify-start items-start gap-3">
      {label && (
        <p className="self-stretch text-sm font-medium text-left text-[#2c2c2c]">
          {label}
        </p>
      )}
      <div className="flex flex-col justify-start items-start self-stretch gap-1 rounded-[20px]">
        <div
          className={`flex justify-start items-center self-stretch h-12 relative gap-2.5 px-4 py-[18px] rounded-[15px] transition-all ${getContainerStyle()}`}
        >
          <input
            className={`flex-grow bg-transparent outline-none text-base text-left placeholder-[#ababab] ${getTextStyle()}`}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={value}
            maxLength={maxLength}
            {...props}
          />
        </div>
        {(suffix || showCount) && (
          <div className="flex justify-center items-center self-stretch relative gap-2.5 px-1.5">
            <p className="flex-grow text-xs font-medium text-right text-[#93979d]">
              {showCount && maxLength ? `${String(value || "").length}/${maxLength}` : suffix}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
