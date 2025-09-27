import { AiOutlineLoading } from "react-icons/ai";

const LoadingSpinnerButton = () => (
  <div className="flex flex-col items-center justify-center gap-4 h-full ">
    <AiOutlineLoading className="animate-spin w-6 h-6 text-text-button" />
  </div>
);

export default LoadingSpinnerButton;
