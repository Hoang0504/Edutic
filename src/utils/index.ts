// Utility function to find the line containing the selected word
export function getContextLine(text: string, keyword: string): string {
  console.log(text);

  //   const parts = text.toString().split(/\s(?=\d+\.\s\()/g);
  //   console.log(parts);

  const sentences = text
    .split(/(?<=\.)\s+(?=[A-Z])/g) // split at ". " before a capital letter
    .map((s) => s.trim()) // remove extra spaces
    .filter(Boolean); // remove empty strings

  console.log(sentences);

  //   return lines.find((line) => line.includes(keyword)) || "";
}
