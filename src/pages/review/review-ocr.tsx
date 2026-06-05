import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AiLoadingPage from "../ai-loading-page";
import Modal from "../../components/common/Modal";

export default function ReviewOcrPage() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  //카메라
  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, // 후면 카메라 우선
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("카메라를 시작할 수 없습니다:", err);
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    setIsLoading(true);

    // 백엔드 OCR 인증 시뮬레이션
    setTimeout(() => {
      setIsLoading(false);
      
      // 80% 확률로 성공 시뮬레이션
      const isSuccess = Math.random() > 0.2;
      
      if (isSuccess) {
        navigate("/reviews/ocr/success");
      } else {
        setShowErrorModal(true);
      }
    }, 3000);
  };

  if (isLoading) {
    return (
      <AiLoadingPage 
        title="인증정보를 불러오고있어요" 
        description="잠시만 기다려주세요" 
      />
    );
  }

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#010101]">
      {/* 카메라 뷰 영역 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
      

      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute top-[91px] left-0 right-0 flex flex-col items-center gap-2 px-4">
        <p className="text-lg font-semibold text-center text-white">
          실거주 인증하기
        </p>
        <p className="text-xl text-center text-white mt-4">
          등본의 주소지가 잘 보이게 찍어주세요
        </p>
      </div>

      {/* 닫기 버튼 */}
      <button 
        onClick={() => navigate(-1)}
        className="absolute right-[30px] top-[30px] z-10 flex h-[30px] w-[30px] items-center justify-center"
      >
        <svg
          width={30}
          height={30}
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask id="mask0_449_3405" maskUnits="userSpaceOnUse" x={0} y={0} width={30} height={30}>
            <rect width={30} height={30} fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_449_3405)">
            <path
              d="M15 16.75L8.875 22.875C8.64583 23.1042 8.35417 23.2188 8 23.2188C7.64583 23.2188 7.35417 23.1042 7.125 22.875C6.89583 22.6458 6.78125 22.3542 6.78125 22C6.78125 21.6458 6.89583 21.3542 7.125 21.125L13.25 15L7.125 8.875C6.89583 8.64583 6.78125 8.35417 6.78125 8C6.78125 7.64583 6.89583 7.35417 7.125 7.125C7.35417 6.89583 7.64583 6.78125 8 6.78125C8.35417 6.78125 8.64583 6.89583 8.875 7.125L15 13.25L21.125 7.125C21.3542 6.89583 21.6458 6.78125 22 6.78125C22.3542 6.78125 22.6458 6.89583 22.875 7.125C23.1042 7.35417 23.2188 7.64583 23.2188 8C23.2188 8.35417 23.1042 8.64583 22.875 8.875L16.75 15L22.875 21.125C23.1042 21.3542 23.2188 21.6458 23.2188 22C23.2188 22.3542 23.1042 22.6458 22.875 22.875C22.6458 23.1042 22.3542 23.2188 22 23.2188C21.6458 23.2188 21.3542 23.1042 21.125 22.875L15 16.75Z"
              fill="white"
            />
          </g>
        </svg>
      </button>

      {/* 가이드 라인 (모서리 표시) */}
      <div className="absolute inset-x-4 top-[202.5px] bottom-[226.5px] pointer-events-none flex items-center justify-center">
        {/* 상단 왼쪽 */}
        <div className="absolute left-0 top-0">
          <svg width={40} height={40} viewBox="0 0 40 40" fill="none">
            <path d="M5 35V10C5 7.23858 7.23858 5 10 5H35" stroke="white" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {/* 상단 오른쪽 */}
        <div className="absolute right-0 top-0">
          <svg width={40} height={40} viewBox="0 0 40 40" fill="none">
            <path d="M35 35V10C35 7.23858 32.7614 5 30 5H5" stroke="white" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {/* 하단 왼쪽 */}
        <div className="absolute left-0 bottom-0">
          <svg width={40} height={40} viewBox="0 0 40 40" fill="none">
            <path d="M5 5V30C5 32.7614 7.23858 35 10 35H35" stroke="white" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {/* 하단 오른쪽 */}
        <div className="absolute right-0 bottom-0">
          <svg width={40} height={40} viewBox="0 0 40 40" fill="none">
            <path d="M35 5V30C35 32.7614 32.7614 35 30 35H5" stroke="white" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* 가운데 십자가 */}
        <svg width={35} height={35} viewBox="0 0 35 35" fill="none">
          <mask id="mask0_449_3414" maskUnits="userSpaceOnUse" x={0} y={0} width={35} height={35}>
            <rect width={35} height={35} fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_449_3414)">
            <path d="M16.0417 30.625V18.9583H4.375V16.0417H16.0417V4.375H18.9583V16.0417H30.625V18.9583H18.9583V30.625H16.0417Z" fill="white" />
          </g>
        </svg>
      </div>

      {/* 하단 컨트롤 영역 */}
      <div className="absolute bottom-[60px] left-0 right-0 flex items-center justify-center gap-10 px-8">
        {/* 대칭을 위한 빈 공간 */}
        <div className="w-[35px]" />

        {/* 셔터 버튼 */}
        <button 
          onClick={handleCapture}
          className="relative flex h-[60px] w-[60px] items-center justify-center active:scale-95 transition-transform"
        >
          <div className="h-[50px] w-[50px] rounded-full bg-white" />
          <div className="absolute h-[60px] w-[60px] rounded-full border-2 border-white" />
        </button>

        {/* 대칭을 위한 빈 공간 */}
        <div className="w-[35px]" />
      </div>

      {/* 실패 모달 */}
      <Modal 
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="인증 실패"
        description="인증에 실패했습니다. 메인 화면으로 돌아갑니다."
        onConfirm={() => navigate("/")}
      />
    </div>
  );
}
