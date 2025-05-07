"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  Clock,
  Star,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/navbar";

interface Question {
  id: number;
  type: "matching" | "multiple-choice-explanation" | "multiple-select";
  question: string;
  items?: { term: string; options: string[]; correctAnswer: string }[];
  options?: string[];
  correct?: string | string[];
  points: number;
}
const POINTS_PER_QUESTION = 20;
export default function QuizPage() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [multiAnswers, setMultiAnswers] = useState<{ [key: string]: string[] }>(
    {}
  );
  const [explanations, setExplanations] = useState<{ [key: number]: string }>(
    {}
  );
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [timerActive, setTimerActive] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [questionData, setQuestionData] = useState<Question | null>(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());


  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerActive && timeRemaining > 0) {
      timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
    } else if (timerActive && timeRemaining === 0) {
      setShowResults(true);
      setTimerActive(false);
    }
    return () => clearTimeout(timer);
  }, [timeRemaining, timerActive]);

  useEffect(() => {
    if (!quizStarted) return;
    setLoadingQuestion(true);
    fetch(`http://127.0.0.1:5000/quiz/${currentQuestion}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((q: Question) => {
        setQuestionData(q);
      })
      .catch((err) => console.error("Fetch quiz error", err))
      .finally(() => setLoadingQuestion(false));
  }, [quizStarted, currentQuestion]);

  const startQuiz = async () => {
    const res = await fetch("http://127.0.0.1:5000/quiz/count");
    const { count } = await res.json();
    setTotalQuestions(count);
    setQuizStarted(true);
    setTimerActive(true);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const isAnswered = () => {
    const q = questionData;
    if (!q) return false;
    if (q.type === "multiple-select")
      return (multiAnswers[currentQuestion] || []).length > 0;
    if (q.type === "matching")
      return q.items!.every((_, i) => !!answers[`${currentQuestion}-${i}`]);
    return !!answers[currentQuestion];
  };

  const nextQuestion = () => {
    if (!questionData) return;
    const q = questionData;
    let isCorrect = false;
    if (q.type === "multiple-select") {
      const sel = multiAnswers[currentQuestion] || [];
      isCorrect =
        sel.length === (q.correct as string[]).length &&
        sel.every((a) => (q.correct as string[]).includes(a));
    } else if (q.type === "multiple-choice-explanation") {
      isCorrect = answers[currentQuestion] === q.correct;
    } else if (q.type === "matching") {
      isCorrect = q.items!.every(
        (item, i) => answers[`${currentQuestion}-${i}`] === item.correctAnswer
      );
    } else {
      isCorrect = answers[currentQuestion] === q.correct;
    }
    if (isCorrect) {
      setTotalPoints((tp) => tp + q.points);
      setCorrectCount((c) => c + 1);
    }

    const payload =
      q.type === "multiple-select"
        ? multiAnswers[currentQuestion]
        : q.type === "matching"
        ? q.items!.map((_, i) => answers[`${currentQuestion}-${i}`])
        : answers[currentQuestion];

    console.log(payload);
    

    fetch(`http://127.0.0.1:5000/quiz/${currentQuestion}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer: payload }),
    })
      .then((res) => res.json())
      .then(({ next }) => {
        if (next.startsWith("/quiz/")) {
          setCurrentQuestion(parseInt(next.split("/")[2], 10));
          setShowExplanation(false);
        } else {
          setShowResults(true);
          setTimerActive(false);
        }
      })
      .catch((err) => console.error("Post quiz error", err));
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
    setShowExplanation(false);
  };

  const calculateScore = () => {
    return correctCount;
  };

  const renderQuestion = () => {
    const q = questionData;
    if (!q) return <div className="neo-card">Loading...</div>;

    const isCorrectAnswer = (opt: string, correct: string | string[]) => {
      return Array.isArray(correct) ? correct.includes(opt) : opt === correct;
    };

    if (q.type === "matching") {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{q.question}</h2>
            <div className="neo-badge">+{q.points} POINTS</div>
          </div>

          {q.items!.map((item, index) => (
            <div key={index} className="neo-card bg-white">
              <p className="font-bold text-lg mb-4">{item.term}</p>
              <div className="grid grid-cols-3 gap-3">
                {item.options.map((opt, i) => {
                  const key = `${currentQuestion}-${index}`;
                  const isSelected = answers[key] === opt;
                  const isCorrect = opt === item.correctAnswer;
                  const showColor =
                    showExplanation && isSelected
                      ? isCorrect
                        ? "bg-green-200 border-green-500"
                        : "bg-red-200 border-red-500"
                      : "";

                  return (
                    <button
                      key={i}
                      className={`neo-button-outline ${
                        isSelected ? "selected" : ""
                      } ${showColor}`}
                      onClick={() => {
                        if (answeredQuestions.has(currentQuestion)) return;
                        setAnswers({ ...answers, [key]: opt });
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {showExplanation && (
            <div
              className={`neo-card mt-6 ${
                q.items!.every(
                  (item, i) =>
                    answers[`${currentQuestion}-${i}`] === item.correctAnswer
                )
                  ? "bg-[#c1ff00]"
                  : "incorrect-answer"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {q.items!.every(
                    (item, i) =>
                      answers[`${currentQuestion}-${i}`] === item.correctAnswer
                  ) ? (
                    <CheckCircle className="text-black" size={24} />
                  ) : (
                    <XCircle className="text-black" size={24} />
                  )}
                </div>
                <div>
                  <p className="font-bold text-lg">
                    {q.items!.every(
                      (item, i) =>
                        answers[`${currentQuestion}-${i}`] ===
                        item.correctAnswer
                    )
                      ? "CORRECT!"
                      : "INCORRECT!"}
                  </p>
                  <div className="mt-3">
                    <p className="font-bold">CORRECT ANSWERS:</p>
                    <ul className="mt-2 space-y-2">
                      {q.items!.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="font-bold">{item.term}:</span>{" "}
                          {item.correctAnswer}
                          {answers[`${currentQuestion}-${i}`] !==
                            item.correctAnswer && (
                            <span className="ml-2 text-black">
                              (You selected:{" "}
                              {answers[`${currentQuestion}-${i}`] || "none"})
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (q.type === "multiple-choice-explanation") {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{q.question}</h2>
            <div className="neo-badge">+{q.points} POINTS</div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {q.options!.map((opt, i) => {
              const isSelected = answers[currentQuestion] === opt;
              const isCorrect = opt === q.correct;
              return (
                <button
                  key={i}
                  className={`neo-button-outline ${
                    isSelected ? "selected" : ""
                  } ${
                    showExplanation
                      ? isCorrect
                        ? "bg-green-200 border-green-500"
                        : isSelected && !isCorrect
                        ? "bg-red-200 border-red-500"
                        : ""
                      : ""
                  }`}
                  onClick={() => {
                    if (answeredQuestions.has(currentQuestion)) return;
                    setAnswers({ ...answers, [currentQuestion]: opt });
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div
              className={`neo-card mt-6 ${
                answers[currentQuestion] === q.correct
                  ? "bg-[#c1ff00]"
                  : "incorrect-answer"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {answers[currentQuestion] === q.correct ? (
                    <CheckCircle className="text-black" size={24} />
                  ) : (
                    <XCircle className="text-black" size={24} />
                  )}
                </div>
                <div>
                  <p className="font-bold text-lg">
                    {answers[currentQuestion] === q.correct
                      ? "CORRECT!"
                      : "INCORRECT!"}
                  </p>
                  <p className="mt-2">
                    The correct answer is{" "}
                    <span className="font-bold">{q.correct}</span>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (q.type === "multiple-select") {
      const selected = multiAnswers[currentQuestion] || [];
      const correct = q.correct as string[];
      const isFullyCorrect =
        selected.length === correct.length &&
        selected.every((a) => correct.includes(a));

      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{q.question}</h2>
            <div className="neo-badge">+{q.points} POINTS</div>
          </div>

          {q.options!.map((opt, i) => {
            const isSelected = selected.includes(opt);
            const isCorrect = correct.includes(opt);
            return (
              <button
                key={i}
                className={`neo-button-outline w-full text-left flex items-center gap-3 ${
                  isSelected ? "selected" : ""
                } ${
                  showExplanation
                    ? isCorrect
                      ? "bg-green-200 border-green-500"
                      : isSelected
                      ? "bg-red-200 border-red-500"
                      : ""
                    : ""
                }`}
                onClick={() => {
                  if (answeredQuestions.has(currentQuestion)) return;
                  const nextSel = isSelected
                    ? selected.filter((a) => a !== opt)
                    : [...selected, opt];
                  setMultiAnswers({
                    ...multiAnswers,
                    [currentQuestion]: nextSel,
                  });
                }}
              >
                <div
                  className={`w-6 h-6 border-4 border-black rounded ${
                    isSelected ? "bg-black" : "bg-white"
                  }`}
                >
                  {isSelected && (
                    <CheckCircle size={16} className="text-white" />
                  )}
                </div>
                <span>{opt}</span>
              </button>
            );
          })}

          {showExplanation && (
            <div
              className={`neo-card mt-6 ${
                isFullyCorrect ? "bg-[#c1ff00]" : "incorrect-answer"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {isFullyCorrect ? (
                    <CheckCircle className="text-black" size={24} />
                  ) : (
                    <XCircle className="text-black" size={24} />
                  )}
                </div>
                <div>
                  <p className="font-bold text-lg">
                    {isFullyCorrect ? "CORRECT!" : "INCORRECT!"}
                  </p>
                  <div className="mt-3">
                    <p className="font-bold">CORRECT ANSWERS:</p>
                    <ul className="mt-2 space-y-2">
                      {correct.map((ans, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="text-black" size={16} />
                          <span>{ans}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return <div className="neo-card">Unsupported question type.</div>;
  };

  const renderResults = (): JSX.Element => {
    const score = calculateScore();
    const pct =
      totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    return (
      <div className="text-center space-y-8 py-8">
        <h2 className="neo-subheading">QUIZ COMPLETE!</h2>
        <div className="w-40 h-40 rounded-full border-8 border-black mx-auto flex items-center justify-center bg-[#c1ff00]">
          <div>
            <div className="text-4xl font-bold">
              {score}/{totalQuestions}
            </div>
            <div className="text-lg font-bold">SCORE</div>
          </div>
        </div>
        <div className="max-w-md mx-auto">
          <div className="mb-2 flex justify-between text-lg font-bold">
            <span>YOUR SCORE</span>
            <span>{pct}%</span>
          </div>
          <div className="h-4 w-full bg-white border-4 border-black rounded-full overflow-hidden">
            <div className="h-full bg-[#c1ff00]" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="neo-card max-w-md mx-auto">
          <h3 className="font-bold text-xl mb-4">PERFORMANCE SUMMARY:</h3>
          <p className="text-lg">
            {pct >= 80
              ? "EXCELLENT! YOU HAVE A STRONG UNDERSTANDING OF BASKETBALL DEFENSIVE STRATEGIES."
              : pct >= 60
              ? "GOOD JOB! YOU UNDERSTAND THE BASICS, BUT COULD IMPROVE ON SOME CONCEPTS."
              : "YOU'RE ON YOUR WAY TO UNDERSTANDING BASKETBALL DEFENSE. CONSIDER REVIEWING THE MATERIAL AGAIN."}
          </p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="neo-card bg-[#c1ff00]">
            <div className="text-center">
              <div className="text-3xl font-bold">{totalPoints}</div>
              <div className="font-bold">POINTS EARNED</div>
            </div>
          </div>
          <div className="neo-card bg-[#c1ff00]">
            <div className="text-center">
              <div className="text-3xl font-bold">
                {formatTime(timeRemaining)}
              </div>
              <div className="font-bold">TIME REMAINING</div>
            </div>
          </div>
        </div>
        {badges.length > 0 && (
          <div className="mt-6 pt-6 border-t-4 border-black">
            <h4 className="font-bold text-lg mb-4">BADGES EARNED:</h4>
            <div className="flex flex-wrap gap-3">
              {badges.map((badge, i) => (
                <div key={i} className="neo-badge flex items-center gap-1">
                  <Trophy size={16} />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-center gap-6 mt-8">
          <Link href="/learning-path" className="neo-button-outline">
            CONTINUE LEARNING
          </Link>
          <Link href="/" className="neo-button bg-[#c1ff00]">
            BACK TO HOME
          </Link>
        </div>
      </div>
    );
  };

  if (!quizStarted) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f6f5f5]">
        <Navbar />

        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12 space-y-8">
              <h1 className="neo-subheading">
                BASKETBALL DEFENSE QUIZ CHALLENGE
              </h1>
              <p className="text-xl max-w-2xl mx-auto">
                TEST YOUR KNOWLEDGE OF BASKETBALL DEFENSIVE STRATEGIES WITH THIS
                TIMED QUIZ. YOU HAVE 2 MINUTES TO ANSWER ALL QUESTIONS. READY TO
                SHOW YOUR DEFENSIVE IQ?
              </p>

              <div className="neo-card max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                  <Clock size={32} className="text-black" />
                  <div className="text-2xl font-bold">2 MINUTE CHALLENGE</div>
                </div>

                <div className="space-y-6 mb-8">
                  <div className="neo-card bg-gray-100">
                    <h3 className="font-bold text-xl mb-4">QUIZ DETAILS:</h3>
                    <ul className="space-y-4">
                      <li className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#c1ff00] border-4 border-black rounded-full flex-shrink-0 flex items-center justify-center font-bold">
                          5
                        </div>
                        <span className="font-bold">
                          QUESTIONS COVERING ALL DEFENSIVE STRATEGIES
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#c1ff00] border-4 border-black rounded-full flex-shrink-0 flex items-center justify-center font-bold">
                          2
                        </div>
                        <span className="font-bold">
                          MINUTES TO COMPLETE THE QUIZ
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#c1ff00] border-4 border-black rounded-full flex-shrink-0 flex items-center justify-center font-bold">
                          ★
                        </div>
                        <span className="font-bold">
                          EARN BADGES BASED ON YOUR PERFORMANCE
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="neo-card bg-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Trophy size={24} className="text-[#c1ff00]" />
                        <span className="font-bold text-lg">
                          POTENTIAL BADGES:
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <div className="neo-badge">DEFENSE MASTER</div>
                        <div className="neo-badge">SPEED DEMON</div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  className="neo-button bg-[#c1ff00] w-full text-xl py-4"
                  onClick={startQuiz}
                >
                  START QUIZ
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f5f5]">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {!showResults ? (
            <>
              <div>{/* quiz header, progress bar JSX unchanged */}</div>
              <div className="neo-card mb-8">{renderQuestion()}</div>
              <div className="flex justify-between items-center">
                <button
                  onClick={prevQuestion}
                  className="neo-button-outline"
                  disabled={currentQuestion === 0}
                >
                  <ChevronLeft size={20} /> PREVIOUS
                </button>
                {!answeredQuestions.has(currentQuestion) && isAnswered() && (
                  <button
                    onClick={() => {
                      setShowExplanation(true);
                      setAnsweredQuestions(prev => new Set(prev).add(currentQuestion));
                    }}
                    className="neo-button bg-[#c1ff00]"
                  >
                    CHECK ANSWER
                  </button>
                )}
                <button
                  onClick={nextQuestion}
                  className="neo-button bg-[#c1ff00]"
                  disabled={!isAnswered()}
                >
                  {currentQuestion === totalQuestions - 1
                    ? "FINISH QUIZ"
                    : "NEXT QUESTION"}{" "}
                  <ChevronRight size={20} />
                </button>
              </div>
            </>
          ) : (
            renderResults()
          )}
        </div>
      </main>
    </div>
  );
}
