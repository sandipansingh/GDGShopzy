import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { authApi } from "../api";
import { resetPasswordSchema, ResetPasswordInput } from "../schemas";
import { PasswordCriteria } from "../components/PasswordCriteria";
import { useToast } from "../../../components/toast/useToast";
import { Input } from "../../../components/ui/Input";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { SubmitButton } from "../../../components/shared/SubmitButton";
import { getErrorMessage, setFormErrorsFromApi } from "../../../lib/api-error";
import { ROUTES } from "../../../lib/routes";
import { AuthLayout } from "../components/AuthLayout";

export const ResetPasswordPage = () => {
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  const token = searchParams.get("token") ?? "";
  const tokenError = token ? "" : "Invalid or missing reset token";

  const {
    control,
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });
  const password = useWatch({ control, name: "password", defaultValue: "" });

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      setError("");
      const message = await authApi.resetPassword(data);
      toast.success(message, "Password updated");
      navigate(ROUTES.LOGIN);
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
      title="Choose a new password"
      subtitle="Create a secure password for your GDGShopzy account."
    >
      {(error || tokenError) && <ErrorMessage message={error || tokenError} />}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
        <Input
          label="New Password"
          type="password"
          {...register("password")}
          error={errors.password?.message}
        />
        <PasswordCriteria password={password} />
        <input type="hidden" {...register("token")} />
        <SubmitButton isSubmitting={isSubmitting} disabled={Boolean(tokenError)}>
          Reset Password
        </SubmitButton>
      </form>
      <div className="mt-6 text-center">
        <Link to={ROUTES.LOGIN} className="text-sm text-accent hover:underline">
          Back to Sign In
        </Link>
      </div>
    </AuthLayout>
  );
};
