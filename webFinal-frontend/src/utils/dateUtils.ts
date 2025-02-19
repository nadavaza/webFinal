export const formatDate = (date: string | undefined) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString();
};
