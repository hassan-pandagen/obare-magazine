import React from "react";

/**
 * Global OBARE text parser. Any word wrapped in **double stars** is rendered
 * in the brand red. Use this anywhere Sanity-authored strings are rendered
 * so editors can highlight words from the CMS without touching code.
 *
 *   <RedEmphasis>OBARE believes **Beauty** is real.</RedEmphasis>
 *   // "Beauty" renders in red, rest inherits color.
 */
export function RedEmphasis({ children }: { children: string | null | undefined }) {
  if (!children) return null;
  return <>{renderRedEmphasis(children)}</>;
}

export function renderRedEmphasis(str: string): React.ReactNode[] {
  return str.split(/(\*\*[^*]+\*\*)/g).map((token, i) => {
    const match = /^\*\*([^*]+)\*\*$/.exec(token);
    if (match) {
      return (
        <span key={i} className="text-red">
          {match[1]}
        </span>
      );
    }
    return <span key={i}>{token}</span>;
  });
}
