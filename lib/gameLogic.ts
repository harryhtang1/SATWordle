export type LetterStatus = "correct" | "present" | "absent" | "empty" | "tbd";

export function evaluateGuess(guess: string, answer: string): LetterStatus[] {
  const result: LetterStatus[] = new Array(guess.length).fill("absent");
  const answerLetters = answer.split("");
  const guessLetters = guess.split("");
  const remainingAnswer: (string | null)[] = [...answerLetters];

  // First pass: mark exact matches
  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i] === answerLetters[i]) {
      result[i] = "correct";
      remainingAnswer[i] = null;
    }
  }

  // Second pass: mark present letters
  for (let i = 0; i < guessLetters.length; i++) {
    if (result[i] !== "correct") {
      const idx = remainingAnswer.indexOf(guessLetters[i]);
      if (idx !== -1) {
        result[i] = "present";
        remainingAnswer[idx] = null;
      }
    }
  }

  return result;
}

export function getKeyStatuses(
  guesses: string[],
  evaluations: LetterStatus[][]
): Record<string, LetterStatus> {
  const priority: Record<LetterStatus, number> = {
    correct: 3,
    present: 2,
    absent: 1,
    tbd: 0,
    empty: 0,
  };

  const keyStatuses: Record<string, LetterStatus> = {};

  for (let i = 0; i < guesses.length; i++) {
    const guess = guesses[i];
    const evaluation = evaluations[i];
    if (!evaluation) continue;

    for (let j = 0; j < guess.length; j++) {
      const letter = guess[j];
      const status = evaluation[j];
      if (!keyStatuses[letter] || priority[status] > priority[keyStatuses[letter]]) {
        keyStatuses[letter] = status;
      }
    }
  }

  return keyStatuses;
}

export function buildShareText(
  word: string,
  guesses: string[],
  evaluations: LetterStatus[][],
  dateStr: string,
  won: boolean
): string {
  const result = won ? `${guesses.length}/6` : "X/6";
  const emojiGrid = evaluations
    .map((row) =>
      row
        .map((s) => (s === "correct" ? "🟩" : s === "present" ? "🟨" : "⬛"))
        .join("")
    )
    .join("\n");
  return `SATWordle ${dateStr} ${result}\n\n${emojiGrid}`;
}
