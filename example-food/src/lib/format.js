export const formatPrice = (price) => `$${Number(price ?? 0).toFixed(2)}`;

export const formatDate = (value) => {
  const date = new Date(value);
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
};
