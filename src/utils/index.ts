import { Answer } from "@/models/Answer";

export const capitalizeWords = (str: string) =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());

export const getAnswerOption = (
  answers: Answer[],
  answerId: number | undefined
) => {
  if (!answerId) return null;
  const ans = answers.find((a) => a.id === answerId);
  return ans ? ans.content.slice(0, 1) : null;
};
