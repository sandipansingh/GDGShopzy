interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="border border-red-500/40 bg-red-500/10 p-6">
      <p className="font-medium text-red-200">{message}</p>
    </div>
  );
};
