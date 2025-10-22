import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'


const highlighter = await createHighlighterCore({
  themes: [
    import('@shikijs/themes/dark-plus'),
  ],
  langs: [
    import('@shikijs/langs/json'),
    import('@shikijs/langs/yaml'),
    import('@shikijs/langs/markdown'),
    import('@shikijs/langs/bash'),
    import('@shikijs/langs/typescript'),
    import('@shikijs/langs/javascript'),
    import('@shikijs/langs/python'),
    import('@shikijs/langs/rust'),
    import('@shikijs/langs/tsx'),
  ],
  engine: createJavaScriptRegexEngine()
})


export async function CodeBlock({ lang, filename, children }: { lang: string; filename?: string; children: string }) {
  let codeHtml = children;

  try {
    codeHtml = highlighter.codeToHtml(children, {
      lang,
      theme: "dark-plus",
      transformers: [
        {
          pre(node) { this.addClassToHast(node, "px-4 py-5 overflow-x-auto") },
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
        <div className="px-4 py-2 rounded-t-2xl bg-secondary">
          <span className="font-mono text-sm">{filename}</span>
        </div>
      }
      <div
        dangerouslySetInnerHTML={{ __html: codeHtml }}
        className={`text-sm rounded-2xl overflow-hidden ${filename ? "rounded-t-none" : ""} [&_pre_code_span.line>span]:text-[#D4D4D4]`}
        style={{ backgroundColor: "#1E1E1E" }}
      />
    </div>
  );
}
