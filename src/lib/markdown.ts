import { marked } from "marked";
import DOMPurify from "dompurify";

export function parseMarkdown(markdown: string): Promise<string> {
  const rawHtml = marked(markdown);
  return new Promise(async (resolve) => {
    const cleanHtml = DOMPurify.sanitize(await rawHtml);
    resolve(cleanHtml);
  });
}
