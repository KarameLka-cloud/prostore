export const getCurrentYear = async (): Promise<number> => {
  "use cache";

  return new Date().getFullYear();
};
