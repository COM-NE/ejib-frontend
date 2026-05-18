import search from "../../assets/home/search.svg";

interface SearchBarProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  className?: string;
}

export default function SearchBar({
  value = "",
  placeholder = "대학교 이름이나 지역을 검색해보세요",
  onChange,
  onSubmit,
  className = "",
}: SearchBarProps) {
  return (
    <form
      className={`flex h-11 w-full items-center gap-2 rounded-full border border-[#5060FE] bg-white px-6 ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      <img src={search} alt="검색" className="h-4 w-4 shrink-0" />

      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent font-[PretendardVariable] text-sm text-gray-900 outline-none placeholder:text-gray-400"
      />
    </form>
  );
}
