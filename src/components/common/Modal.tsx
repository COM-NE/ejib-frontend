interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  buttonText?: string;
  onConfirm?: () => void;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  buttonText = "확인",
  onConfirm,
}: ModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
      <div className="w-full max-w-[320px] rounded-[20px] bg-white p-6 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <h3 className="text-lg font-bold text-[#1F1F1F]">{title}</h3>
          {description && (
            <p className="mt-2 text-sm font-medium text-[#656565] whitespace-pre-wrap">
              {description}
            </p>
          )}
          <button
            onClick={handleConfirm}
            className="mt-6 flex h-[50px] w-full items-center justify-center rounded-[12px] bg-[#5060FE] text-base font-semibold text-white active:bg-[#4050EE]"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
