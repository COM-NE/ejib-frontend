import { useNavigate } from "react-router-dom";

import back from "../../assets/home/back.svg";
import bell from "../../assets/home/bell.svg";
import emptyHeart from "../../assets/home/empty-heart.svg";
import filledHeart from "../../assets/home/filled-heart.svg";

type HeaderProps =
  | {
      variant: "home";
      onNotificationClick?: () => void;
    }
  | {
      variant: "detail";
      title: string;
      isLiked?: boolean;
      onBackClick?: () => void;
      onLikeClick?: () => void;
      showLike?: boolean;
    };

export default function Header(props: HeaderProps) {
  const navigate = useNavigate();

  const baseStyle =
    "sticky top-0 z-50 flex h-14 w-full items-center bg-white px-5";

  if (props.variant === "home") {
    return (
      <header className={`${baseStyle} justify-between`}>
        <h1 className="malang-font text-3xl leading-none tracking-[-0.01em]">
          <span className="text-[#5060FE]">이집어때</span>
        </h1>

        <button
          type="button"
          onClick={props.onNotificationClick}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
          aria-label="알림"
        >
          <img src={bell} alt="알림" className="h-6 w-6" />
        </button>
      </header>
    );
  }

  return (
    <header className={`${baseStyle} justify-between`}>
      <button
        type="button"
        onClick={props.onBackClick ?? (() => navigate(-1))}
        className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
        aria-label="뒤로가기"
      >
        <img src={back} alt="뒤로가기" className="h-6 w-6" />
      </button>

      <h1 className="max-w-[220px] truncate text-base font-[PretendardVariable] font-medium text-gray-900">
        {props.title}
      </h1>

      {props.showLike !== false ? (
        <button
          type="button"
          onClick={props.onLikeClick}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
          aria-label="찜하기"
        >
          <img
            src={props.isLiked ? filledHeart : emptyHeart}
            alt="찜하기"
            className="h-6 w-6"
          />
        </button>
      ) : (
        <div className="h-9 w-9" />
      )}
    </header>
  );
}
