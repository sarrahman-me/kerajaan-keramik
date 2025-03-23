export const formatCurrency = (
  value: number | null | undefined,
): string => {
  if (value == null) return "--";
  return value.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};
