import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authApi } from "../api";
import { loginSchema, LoginInput } from "../schemas";
import { useAuthStore } from "../../../stores/auth.store";
import { useToast } from "../../../components/toast/useToast";
import { Input } from "../../../components/ui/Input";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { SubmitButton } from "../../../components/shared/SubmitButton";
import { getErrorMessage, setFormErrorsFromApi } from "../../../lib/api-error";
import { canAccessProtectedPath, ROUTES } from "../../../lib/routes";
import { getRoleHomePath } from "../../../lib/auth";
import { AuthLayout } from "../components/AuthLayout";

interface LoginLocationState {
  from?: {
    pathname?: string;
  };
}

export const LoginPage = () => {
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const setSession = useAuthStore((state) => state.setSession);
  const fromPath = (location.state as LoginLocationState | null)?.from?.pathname;

  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setError("");
      const response = await authApi.login(data);
      setSession(response.user, response.accessToken);

      const fallbackRoute = getRoleHomePath(response.user.role);
      const redirectPath =
        fromPath && canAccessProtectedPath(response.user.role, fromPath) ? fromPath : fallbackRoute;

      navigate(redirectPath, { replace: true });
    } catch (err) {
      if (!setFormErrorsFromApi(err, setFormError)) {
        const message = getErrorMessage(err);
        setError(message);
        toast.error(message, "Sign in failed");
      } else {
        setError("Please fix the validation errors below.");
        toast.error("Please fix the validation errors below.", "Sign in failed");
      }
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue to GDGShopzy.">
      {error && <ErrorMessage message={error} />}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
        <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
        <Input
          label="Password"
          type="password"
          {...register("password")}
          error={errors.password?.message}
        />
        <SubmitButton isSubmitting={isSubmitting}>Sign In</SubmitButton>
      </form>
      <div className="mt-6 space-y-3 text-center">
        <Link to={ROUTES.FORGOT_PASSWORD} className="block text-sm text-accent hover:underline">
          Forgot password?
        </Link>
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link to={ROUTES.REGISTER_BUYER} className="text-accent hover:underline">
            Register as Buyer
          </Link>
          {" or "}
          <Link to={ROUTES.REGISTER_SELLER} className="text-accent hover:underline">
            Seller
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
