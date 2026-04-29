import { api } from "../../lib/api";
import { ApiResponse, unwrapResponse } from "../../types/api";
import { Employee } from "../../types/employee";

export const employeesApi = {
  invite: (email: string) =>
    api
      .post<ApiResponse<{ inviteLink: string; expiresAt: string }>>("/seller/employees/invite", {
        email,
      })
      .then(unwrapResponse),

  getEmployees: () => api.get<ApiResponse<Employee[]>>("/seller/employees").then(unwrapResponse),

  removeEmployee: async (id: string) => {
    await api.delete(`/seller/employees/${id}`);
  },
};
