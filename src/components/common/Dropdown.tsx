import { useState, useRef, useEffect } from "react";

interface DropdownProps {
  label: string;
  placeholder?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export default function Dropdown({
  label,
  placeholder,
  options,
  value,
  onChange,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative flex w-full flex-col items-start justify-start gap-3">
      <p className="w-full text-left text-sm font-medium text-[#2c2c2c]">{label}</p>
      <div
        className={`flex h-12 w-full cursor-pointer items-center justify-between rounded-[15px] border bg-white px-4 py-[18px] transition-colors ${
          isOpen ? "border-[#5060fe]" : "border-[#ababab]"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-grow items-center justify-start gap-2.5">
          <p
            className={`text-left text-base ${
              !value ? "text-[#ababab]" : "text-[#2c2c2c]"
            }`}
          >
            {value || placeholder}
          </p>
        </div>
        <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-2.5">
          <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 transition-transform ${isOpen ? "rotate-180" : ""}`}
          >
            <path
              d="M11.625 14.9123C11.5084 14.8706 11.4 14.7998 11.3 14.6998L6.70005 10.0998C6.51672 9.91647 6.42505 9.68314 6.42505 9.3998C6.42505 9.11647 6.51672 8.88314 6.70005 8.6998C6.88338 8.51647 7.11672 8.4248 7.40005 8.4248C7.68338 8.4248 7.91672 8.51647 8.10005 8.6998L12 12.5998L15.9 8.6998C16.0834 8.51647 16.3167 8.4248 16.6 8.4248C16.8834 8.4248 17.1167 8.51647 17.3 8.6998C17.4834 8.88314 17.575 9.11647 17.575 9.3998C17.575 9.68314 17.4834 9.91647 17.3 10.0998L12.7 14.6998C12.6 14.7998 12.4917 14.8706 12.375 14.9123C12.2584 14.954 12.1334 14.9748 12 14.9748C11.8667 14.9748 11.7417 14.954 11.625 14.9123Z"
              fill={isOpen ? "#2C2C2C" : "#AEB3B9"}
            />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-[76px] z-20 w-full">
          <div
            className="max-h-[213px] w-full overflow-y-auto overflow-x-hidden rounded-[15px] bg-white [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#5060fe] [&::-webkit-scrollbar-thumb]:rounded-[30px] [&::-webkit-scrollbar-track]:bg-transparent"
            style={{ boxShadow: "0px 3px 10px 2px rgba(80,96,254,0.1)" }}
          >
            {options.length > 0 ? (
              options.map((option) => (
                <div
                  key={option}
                  className={`flex h-[55px] w-full cursor-pointer flex-col items-start justify-center gap-1 px-4 py-1.5 hover:bg-[#5060fe]/10 ${
                    value === option ? "bg-[#5060fe]/10" : ""
                  }`}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex w-full items-center justify-start gap-2.5">
                    <p className="text-left text-base text-[#2c2c2c]">{option}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-[55px] w-full items-center justify-center px-4 py-1.5 text-sm text-gray-400">
                선택 가능한 항목이 없습니다
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}