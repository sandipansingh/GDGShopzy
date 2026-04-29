import { Spinner } from "../ui/Spinner";

interface PageLoaderProps {
  minHeightClassName?: string;
}

export const PageLoader = ({ minHeightClassName = "min-h-[400px]" }: PageLoaderProps) => {
  return (
    <div className={`flex items-center justify-center ${minHeightClassName}`}>
      <Spinner size="lg" />
    </div>
  );
};
