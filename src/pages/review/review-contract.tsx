import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import NavigationBar from "../../components/NavigationBar";
import BottomButton from "../../components/common/BottomButton";
import Dropdown from "../../components/common/Dropdown";
import Input from "../../components/common/Input";
import { useReviewStore } from "../../store/reviewStore";

export default function ReviewContractPage() {
  const navigate = useNavigate();
  const { contractInfo, setContractInfo } = useReviewStore();
  const { leaseType, deposit, monthlyRent, maintenanceFee } = contractInfo;

  const isNextDisabled = !leaseType || !deposit || !maintenanceFee || (leaseType === "월세" && !monthlyRent);

  const handleNext = () => {
    navigate("/reviews/write");
  };

  return (
    <div className="relative min-h-screen bg-white pb-40">
      <Header variant="detail" title="후기 작성" showLike={false} />

      <main className="px-4 pt-6 flex flex-col gap-6">
        <p className="text-sm font-semibold text-[#2c2c2c]">
          계약 정보를 알려주세요
        </p>

        <Dropdown
          label="전세/월세"
          placeholder="전세/월세"
          options={["전세", "월세"]}
          value={leaseType}
          onChange={(val) => setContractInfo({ leaseType: val })}
        />

        <div className="flex flex-col gap-4">
          <Input
            label={leaseType === "전세" ? "보증금(전세금)" : "보증금"}
            placeholder="보증금을 입력해주세요"
            suffix="만원"
            type="number"
            value={deposit}
            onChange={(e) => setContractInfo({ deposit: e.target.value })}
          />

          {leaseType === "월세" && (
            <Input
              label="월세"
              placeholder="월세를 입력해주세요"
              suffix="만원"
              type="number"
              value={monthlyRent}
              onChange={(e) => setContractInfo({ monthlyRent: e.target.value })}
            />
          )}

          <Input
            label="관리비"
            placeholder="관리비를 입력해주세요"
            suffix="만원"
            type="number"
            value={maintenanceFee}
            onChange={(e) => setContractInfo({ maintenanceFee: e.target.value })}
          />
        </div>
      </main>

      <div className="[&>div]:bottom-[90px]">
        <BottomButton
          buttons={[
            {
              text: "다음",
              onClick: handleNext,
              disabled: isNextDisabled,
            },
          ]}
        />
      </div>

      <NavigationBar />
    </div>
  );
}
