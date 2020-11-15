import prettier from "prettier/standalone";
import parserHtml from "prettier/parser-html";
export const format = (html) => {
  return prettier.format(html, {
    parser: "html",
    plugins: [parserHtml],
  });
};
