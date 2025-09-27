import { codeToHtml, createHighlighter } from "shiki"


export async function CodeBlock({ lang, filename, children }: { lang: string; filename?: string; children: string }) {
  const highlighter = await createHighlighter({ langs: [lang], themes: ["dark-plus"] });

  let codeHtml = children;

  try {
    codeHtml = highlighter.codeToHtml(children, {
      lang,
      theme: "dark-plus",
      transformers: [
        {
          pre(node) { this.addClassToHast(node, "px-4 py-5 overflow-x-auto") },
          // code(node) { this.addClassToHast(node, "") }
        }
      ]
    });
  }
  catch (e) {
    console.error("Error in codeToHtml:", e);
    console.error("CodeBlock input", { lang, filename, children: children.slice(0, 32) + (children.length > 30 ? "..." : "") });

    filename = lang;
    codeHtml = highlighter.codeToHtml(children, { lang: "plaintext", theme: "dark-plus" });
    console.error("CodeBlock output", { lang, filename, children: children.slice(0, 32) + (children.length > 30 ? "..." : "") });
  }

  return (
    <div className="not-prose codeblock">
      {filename &&
        <div className="px-4 py-2 rounded-t-2xl bg-slate-200 dark:bg-slate-500/20">
          <span className="font-mono text-sm">{filename}</span>
        </div>
      }
      <div
        dangerouslySetInnerHTML={{ __html: codeHtml }}
        className={`text-sm rounded-2xl overflow-hidden ${filename ? "rounded-t-none" : ""}`}
        style={{ backgroundColor: "#1E1E1E" }}
      />
    </div>
  );
}
