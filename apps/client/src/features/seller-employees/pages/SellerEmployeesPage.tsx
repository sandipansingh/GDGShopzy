import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { employeesApi } from "../api";
import { Employee } from "../../../types/employee";
import { useToast } from "../../../components/toast/useToast";
import { ApiErrorState } from "../../../components/shared/ApiErrorState";
import { PageLoader } from "../../../components/shared/PageLoader";
import { PageHeader } from "../../../components/shared/PageHeader";
import { getErrorMessage } from "../../../lib/api-error";
import { EmployeeInviteCard } from "../components/EmployeeInviteCard";
import { EmployeeList } from "../components/EmployeeList";

const inviteSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type InviteFormData = z.infer<typeof inviteSchema>;

export const SellerEmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [removing, setRemoving] = useState<string | null>(null);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
  });

  useEffect(() => {
    let active = true;

    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await employeesApi.getEmployees();
        if (active) {
          setEmployees(data);
        }
      } catch (err) {
        const message = getErrorMessage(err);
        if (active) {
          setError(message);
        }
        toast.error(message, "Employees unavailable");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchEmployees();
    return () => {
      active = false;
    };
  }, [toast]);

  const refreshEmployees = async () => {
    const data = await employeesApi.getEmployees();
    setEmployees(data);
  };

  const onSubmit = async (data: InviteFormData) => {
    try {
      setError("");
      setInviteLink("");
      const result = await employeesApi.invite(data.email);
      setInviteLink(result.inviteLink);
      reset();
      toast.success("The employee invite was sent.", "Invite sent");
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message, "Invite failed");
    }
  };

  const handleRemove = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this employee?")) return;

    try {
      setRemoving(id);
      await employeesApi.removeEmployee(id);
      await refreshEmployees();
      toast.success("The employee was removed.", "Employee removed");
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message, "Remove failed");
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return (
      <div className="content-container py-16 md:py-24">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="content-container py-16 md:py-24">
      <PageHeader title="Employees" />

      {error && <ApiErrorState message={error} className="mb-lg" />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
        <div className="lg:col-span-1">
          <EmployeeInviteCard
            emailError={errors.email?.message}
            inviteLink={inviteLink}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit(onSubmit)}
            registerEmail={register}
          />
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-tagline text-ink mb-lg">Current Employees</h2>
          <EmployeeList employees={employees} removingId={removing} onRemove={handleRemove} />
        </div>
      </div>
    </div>
  );
};
