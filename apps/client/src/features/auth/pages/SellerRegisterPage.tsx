import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authApi } from "../api";
import { sellerRegisterSchema, SellerRegisterInput } from "../schemas";
import { PasswordCriteria } from "../components/PasswordCriteria";
import { useAuthStore } from "../../../stores/auth.store";
import { useToast } from "../../../components/toast/useToast";
import { Input } from "../../../components/ui/Input";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { SubmitButton } from "../../../components/shared/SubmitButton";
import { getErrorMessage, setFormErrorsFromApi } from "../../../lib/api-error";
import { ROUTES } from "../../../lib/routes";
import { AuthLayout } from "../components/AuthLayout";

export const SellerRegisterPage = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const toast = useToast();
  const setSession = useAuthStore((state) => state.setSession);

  const {
    control,
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors, isSubmitting },
  } = useForm<SellerRegisterInput>({
    resolver: zodResolver(sellerRegisterSchema),
  });
  const password = useWatch({ control, name: "password", defaultValue: "" });

  const onSubmit = async (data: SellerRegisterInput) => {
    try {
      setError("");
      const response = await authApi.registerSeller(data);
      setSession(response.user, response.accessToken);
      toast.success("Your seller account is ready.", "Registration complete");
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
      title="Start selling on GDGShopzy"
      subtitle="Create your store, add products, and manage orders from one dashboard."
    >
      {error && <ErrorMessage message={error} />}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
        <Input label="Name" {...register("name")} error={errors.name?.message} />
        <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
        <Input label="Store Name" {...register("storeName")} error={errors.storeName?.message} />
        <Input
          label="Password"
          type="password"
          {...register("password")}
          error={errors.password?.message}
        />
        <PasswordCriteria password={password} />
        <SubmitButton isSubmitting={isSubmitting}>Register</SubmitButton>
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
