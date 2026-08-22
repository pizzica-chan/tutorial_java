import { useId, useRef, useState, type KeyboardEvent } from "react";
import { getQuiz } from "../data/quizzes";
import { TextWithTerms } from "./TextWithTerms";
import { Icon } from "./Icon";

export function QuizBlock({ id }: { id: string }) {
  const quiz = getQuiz(id);
  const [picked, setPicked] = useState<number | null>(null);
  const questionId = useId();
  const groupRef = useRef<HTMLDivElement>(null);
  if (!quiz) return null;

  const revealed = picked !== null;
  const choices = quiz.choices;

  function focusChoice(index: number) {
    const radios = groupRef.current?.querySelectorAll<HTMLElement>('[role="radio"]');
    radios?.[index]?.focus();
  }

  function choose(index: number) {
    setPicked(index);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = choices.length - 1;
    if (last < 0) return;
    const current = picked ?? 0;
    let next = current;
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        next = (current + 1) % choices.length;
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        next = (current - 1 + choices.length) % choices.length;
        break;
      case "Home":
        event.preventDefault();
        next = 0;
        break;
      case "End":
        event.preventDefault();
        next = last;
        break;
      default:
        return;
    }
    choose(next);
    focusChoice(next);
  }

  return (
    <div className="quiz">
      <p className="kicker">
        <Icon name="quiz" size={14} />
        CHECK
      </p>
      <h3 id={questionId}>
        <TextWithTerms text={quiz.question} />
      </h3>
      <div
        ref={groupRef}
        role="radiogroup"
        aria-labelledby={questionId}
        onKeyDown={onKeyDown}
      >
        {choices.map((choice, index) => {
          const cls =
            revealed && index === quiz.answer ? "correct" : revealed && index === picked ? "wrong" : "";
          const selected = picked === index;
          return (
            <button
              key={`${index}-${choice}`}
              className={`choice ${cls}`}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={picked === null ? (index === 0 ? 0 : -1) : selected ? 0 : -1}
              onClick={() => choose(index)}
            >
              <TextWithTerms highlight={false} text={choice} />
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <p role="status">
          <TextWithTerms text={quiz.explanation} />
        </p>
      )}
    </div>
  );
}
