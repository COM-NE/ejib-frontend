import { useNavigate } from "react-router-dom";
import BottomButton from "../../components/common/BottomButton";
import doneIcon from "../../assets/done.svg";

export default function OcrSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full flex-col bg-white px-4">
      {/* 상단 공백 */}
      <div className="h-[54px] w-full" />

      {/* 메인 콘텐츠 영역 */}
      <div className="flex flex-1 flex-col items-center justify-center pb-[100px]">
        {/* 성공 아이콘 */}
        <div className="mb-[30px]">
          <img src={doneIcon} alt="성공 아이콘" className="w-[81px] h-[81px]" />
        </div>

        {/* 텍스트 가이드 */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-xl font-bold text-[#1f1f1f]">
            실거주 인증이 완료되었어요
          </p>
        </div>
      </div>

      {/* 하단 버튼 */}
      <BottomButton
        buttons={[
          {
            text: "확인",
            onClick: () => navigate("/"),
            variant: "primary",
          },
        ]}
      />
    </div>
  );
}
