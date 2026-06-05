import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { postKakaoTokens } from "../api/authApi";

export default function KakaoSuccessPage() {
  const navigate = useNavigate();
  const hasRequested = useRef(false);

  useEffect(() => {
    const handleKakaoSuccess = async () => {
      if (hasRequested.current) return;
      hasRequested.current = true;

      console.log("[카카오 로그인 성공 페이지 진입]");
      console.log("현재 URL:", window.location.href);

      const params = new URLSearchParams(window.location.search);
      const ticket = params.get("ticket");

      console.log("ticket:", ticket);

      if (!ticket) {
        console.error("ticket 값이 없습니다.");
        alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
        navigate("/login", { replace: true });
        return;
      }

      try {
        console.log("[카카오 토큰 발급 요청 시작]");

        const data = await postKakaoTokens(ticket);

        console.log("[카카오 토큰 발급 성공]", data);

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        if (data.newUser || !data.onboardingCompleted) {
          navigate("/register/nickname", { replace: true });
          return;
        }

        navigate("/", { replace: true });
      } catch (error) {
        console.error("[카카오 토큰 발급 실패]", error);
        alert("로그인 처리 중 오류가 발생했습니다.");
        navigate("/login", { replace: true });
      }
    };

    handleKakaoSuccess();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <p className="text-[16px] font-semibold text-[#222222]">
        카카오 로그인 처리 중...
      </p>
    </div>
  );
}
