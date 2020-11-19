import prettier from "prettier/standalone";
import parserHtml from "prettier/parser-html";
import parserCss from "prettier/parser-postcss";
export const format = (code, lang) => {
  return prettier.format(code, {
    parser: lang,
    plugins: [
      ...(lang === "html" ? [parserHtml] : []),
      ...(["css", "less", "scss"].includes(lang) ? [parserCss] : []),
    ],
  });
};
