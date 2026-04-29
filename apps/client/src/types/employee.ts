export interface EmployeeUser {
  id: string;
  name: string;
  email: string;
}

export interface Employee {
  id: string;
  userId: string;
  sellerId: string;
  user: EmployeeUser;
  createdAt: string;
}
