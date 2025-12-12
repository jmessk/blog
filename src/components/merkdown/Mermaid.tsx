"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useTheme } from "next-themes";

type Props = { code: string };


async function waitForMermaid() {
  return new Promise<void>((resolve) => {
    const check = () => (window as any).mermaid ? resolve() : setTimeout(check, 50);
    check();
  });
}


export function MermaidCDN({ code }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [svgs, setSvgs] = useState<{ light?: string; dark?: string }>({});

  useEffect(() => {
    const init = async () => {
      await waitForMermaid();
      const mermaid = (window as any).mermaid;

      mermaid.initialize({ startOnLoad: false, theme: "default" });
      const { svg: lightSvg } = await mermaid.render(`mermaid-light-${Date.now()}`, code);

      mermaid.initialize({ startOnLoad: false, theme: "dark" });
      const { svg: darkSvg } = await mermaid.render(`mermaid-dark-${Date.now()}`, code);

      setSvgs({ light: lightSvg, dark: darkSvg });
    };

    init();
  }, [code]);

  useEffect(() => {
    if (!ref.current || !svgs.light || !svgs.dark) return;
    ref.current.innerHTML = resolvedTheme === "dark" ? svgs.dark : svgs.light;
  }, [resolvedTheme, svgs]);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"
        strategy="afterInteractive"
      />
      <div ref={ref} className="mermaid" />
    </>
  );
}
