import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useState } from "react";
import { authApi } from "../api";
import { forgotPasswordSchema, ForgotPasswordInput } from "../schemas";
import { useToast } from "../../../components/toast/useToast";
import { Input } from "../../../components/ui/Input";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { SubmitButton } from "../../../components/shared/SubmitButton";
import { getErrorMessage, setFormErrorsFromApi } from "../../../lib/api-error";
import { ROUTES } from "../../../lib/routes";
import { AuthLayout } from "../components/AuthLayout";

export const ForgotPasswordPage = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      setError("");
      setSuccess(false);
      const message = await authApi.forgotPassword(data);
      setSuccess(true);
      toast.success(message, "Email sent");
    } catch (err) {
      if (!setFormErrorsFromApi(err, setFormError)) {
        const message = getErrorMessage(err);
        setError(message);
        toast.error(message, "Password reset failed");
      } else {
        setError("Please fix the validation errors below.");
        toast.error("Please fix the validation errors below.", "Password reset failed");
      }
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send reset instructions."
    >
      {error && <ErrorMessage message={error} />}
      {success && (
        <div className="mb-6 rounded-md border border-accent bg-accent/10 p-4">
          <p className="text-sm text-foreground">
            Password reset link sent! Check your email for instructions.
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
        <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
        <SubmitButton isSubmitting={isSubmitting}>Send Reset Link</SubmitButton>
      </form>
      <div className="mt-6 text-center">
        <Link to={ROUTES.LOGIN} className="text-sm text-accent hover:underline">
          Back to Sign In
        </Link>
      </div>
    </AuthLayout>
  );
};
