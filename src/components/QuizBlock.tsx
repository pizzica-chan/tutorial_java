import { useState } from "react";
import { getQuiz } from "../data/quizzes";
import { TextWithTerms } from "./TextWithTerms";
import { Icon } from "./Icon";

export function QuizBlock({ id }: { id: string }) {
  const quiz = getQuiz(id);
  const [picked, setPicked] = useState<number | null>(null);
  if (!quiz) return null;

  const revealed = picked !== null;

  return (
    <div className="quiz">
      <p className="kicker">
        <Icon name="quiz" size={14} />
        CHECK
      </p>
      <h3>
        <TextWithTerms text={quiz.question} />
      </h3>
      <div role="group" aria-label="選択肢">
        {quiz.choices.map((choice, index) => {
          const cls =
            revealed && index === quiz.answer ? "correct" : revealed && index === picked ? "wrong" : "";
          return (
            <button
              key={`${index}-${choice}`}
              className={`choice ${cls}`}
              type="button"
              aria-pressed={picked === index}
              onClick={() => setPicked(index)}
            >
              <TextWithTerms text={choice} />
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
