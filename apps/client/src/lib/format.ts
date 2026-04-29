export const formatMoney = (amount: number | string): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount));
};

export const formatMoneyParts = (amount: number | string): { whole: string; decimal: string } => {
  const num = Number(amount);
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);

  const parts = formatted.split(".");
  if (parts.length === 2) {
    return { whole: parts[0], decimal: `.${parts[1]}` };
  }

  const match = formatted.match(/^(.*?)(\.\d{2})$/);
  if (match) {
    return { whole: match[1], decimal: match[2] };
  }

  return { whole: formatted, decimal: "" };
};

export const formatCurrency = formatMoney;

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};
