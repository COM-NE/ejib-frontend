import { useLocation, useNavigate } from "react-router-dom";
import type { FC } from "react";

import HomeIcon from "../assets/home";
import LocationIcon from "../assets/location";
import ReviewIcon from "../assets/review";
import RobotIcon from "../assets/robot";
import MyIcon from "../assets/my";

interface IconProps {
  width?: number | string;
  height?: number | string;
  color?: string;
  opacity?: number;
}

type NavItem = {
  label: string;
  path: string;
  Icon: FC<IconProps>;
};

const navItems: NavItem[] = [
  {
    label: "홈",
    path: "/",
    Icon: HomeIcon,
  },
  {
    label: "내주변",
    path: "/map",
    Icon: LocationIcon,
  },
  {
    label: "후기작성",
    path: "/reviews/new",
    Icon: ReviewIcon,
  },
  {
    label: "AI추천",
    path: "/ai-recommend",
    Icon: RobotIcon,
  },
  {
    label: "마이",
    path: "/my",
    Icon: MyIcon,
  },
];

const ACTIVE_COLOR = "#5060FE";
const INACTIVE_COLOR = "#C2D5F8";

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-5 left-1/2 z-50 h-[82px] w-[calc(100%-40px)] max-w-[430px] -translate-x-1/2 rounded-[34px] border border-white/40 bg-white/20 px-4 backdrop-blur-[15px]">
      <ul className="flex h-full items-center justify-between">
        {navItems.map(({ label, path, Icon }) => {
          const active = isActive(path);
          const color = active ? ACTIVE_COLOR : INACTIVE_COLOR;

          return (
            <li key={path}>
              <button
                type="button"
                onClick={() => navigate(path)}
                aria-label={label}
                className="flex min-w-[54px] flex-col items-center justify-center gap-1 transition active:scale-95"
              >
                <Icon width={22} height={22} color={color} />

                <span
                  className="whitespace-nowrap text-xs font-[PretendardVariable] font-medium transition"
                  style={{ color }}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
