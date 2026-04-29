type SpinnerSize = "small" | "default" | "large" | "sm" | "lg";

export const Spinner = ({ size = "default" }: { size?: SpinnerSize }) => {
  const sizeStyles = {
    small: "w-4 h-4 border-2",
    sm: "w-4 h-4 border-2",
    default: "w-8 h-8 border-2",
    large: "w-12 h-12 border-4",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeStyles[size]} animate-spin border border-accent border-t-transparent`}
      />
    </div>
  );
};
