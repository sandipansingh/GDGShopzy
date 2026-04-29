export const Role = {
  BUYER: "BUYER",
  SELLER: "SELLER",
  EMPLOYEE: "EMPLOYEE",
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];
