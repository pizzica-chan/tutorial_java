import { useEffect, useState } from "react";
import { getCompleted } from "../lib/progress";

export function useProgress() {
  const [completed, setCompleted] = useState<string[]>(() => getCompleted());

  useEffect(() => {
    const sync = () => setCompleted(getCompleted());
    window.addEventListener("storage", sync);
    window.addEventListener("genba-progress", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("genba-progress", sync);
    };
  }, []);

  return completed;
}
