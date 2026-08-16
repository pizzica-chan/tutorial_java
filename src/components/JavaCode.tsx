import { tokenizeJava, javaTokenClass } from "../lib/highlight";
import { TermMark } from "./TermMark";

export function JavaCode({ code }: { code: string }) {
  return (
    <>
      {tokenizeJava(code).map((token, index) => {
        if (token.kind === "annotation" && token.term) {
          return (
            <TermMark
              key={index}
              def={token.term}
              text={token.text}
              className={`${javaTokenClass(token.kind)} code-term`}
            />
          );
        }

        const cls = javaTokenClass(token.kind);
        if (cls) {
          return (
            <span key={index} className={cls}>
              {token.text}
            </span>
          );
        }

        return <span key={index}>{token.text}</span>;
      })}
    </>
  );
}
