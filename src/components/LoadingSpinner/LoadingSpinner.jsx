import { AiOutlineLoading } from "react-icons/ai";

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center gap-4 h-screen">
    <AiOutlineLoading className="animate-spin text-primary w-10 h-10" />
    <p className="text-lg text-gray-300">Carregando detalhes do filme...</p>
  </div>
);

export default LoadingSpinner;
