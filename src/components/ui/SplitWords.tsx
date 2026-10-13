import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

/**
 * Wraps every word of a heading in a mask so it can rise into view (see `.split-word` in
 * globals.css). Nested elements such as the red accent <span> keep their styling. The text
 * stays real text, so screen readers and search engines read it normally.
 */
export function SplitWords({ children }: { children: ReactNode }) {
  let index = 0;

  const walk = (node: ReactNode): ReactNode =>
    Children.map(node, (child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child)
          .split(/(\s+)/)
          .map((part, i) => {
            if (!part) return null;
            if (/^\s+$/.test(part)) return " ";
            const w = index++;
            return (
              <span key={i} className="split-word">
                <span style={{ "--w": w } as React.CSSProperties}>{part}</span>
              </span>
            );
          });
      }
      if (isValidElement(child)) {
        const el = child as ReactElement<{ children?: ReactNode }>;
        if (el.type === "br") return el;
        return cloneElement(el, undefined, walk(el.props.children));
      }
      return child;
    });

  return <>{walk(children)}</>;
}
