import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { authApi } from "../api";
import { employeeRegisterSchema, EmployeeRegisterInput } from "../schemas";
import { PasswordCriteria } from "../components/PasswordCriteria";
import { useAuthStore } from "../../../stores/auth.store";
import { useToast } from "../../../components/toast/useToast";
import { Input } from "../../../components/ui/Input";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { SubmitButton } from "../../../components/shared/SubmitButton";
import { getErrorMessage, setFormErrorsFromApi } from "../../../lib/api-error";
import { ROUTES } from "../../../lib/routes";
import { AuthLayout } from "../components/AuthLayout";

export const EmployeeRegisterPage = () => {
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const setSession = useAuthStore((state) => state.setSession);

  const inviteToken = searchParams.get("token") ?? "";
  const tokenError = inviteToken ? "" : "Invalid or missing invite token";

  const {
    control,
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeRegisterInput>({
    resolver: zodResolver(employeeRegisterSchema),
    defaultValues: { inviteToken },
  });
  const password = useWatch({ control, name: "password", defaultValue: "" });

  const onSubmit = async (data: EmployeeRegisterInput) => {
    try {
      setError("");
      const response = await authApi.registerEmployee(data);
      setSession(response.user, response.accessToken);
      toast.success("Your employee account is ready.", "Registration complete");
      navigate(ROUTES.SELLER_DASHBOARD);
    } catch (err) {
      if (!setFormErrorsFromApi(err, setFormError)) {
        const message = getErrorMessage(err);
        setError(message);
        toast.error(message, "Registration failed");
      } else {
        setError("Please fix the validation errors below.");
        toast.error("Please fix the validation errors below.", "Registration failed");
      }
    }
  };

  return (
    <AuthLayout
      title="Join a seller team"
      subtitle="Use your invite link to help manage a GDGShopzy store."
    >
      {(error || tokenError) && <ErrorMessage message={error || tokenError} />}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
        <Input label="Name" {...register("name")} error={errors.name?.message} />
        <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
        <Input
          label="Password"
          type="password"
          {...register("password")}
          error={errors.password?.message}
        />
        <PasswordCriteria password={password} />
        <input type="hidden" {...register("inviteToken")} />
        <SubmitButton isSubmitting={isSubmitting} disabled={Boolean(tokenError)}>
          Register
        </SubmitButton>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to={ROUTES.LOGIN} className="text-accent hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
