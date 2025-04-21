"use client"
import { useState, useEffect } from "react"
import { Trophy, Clock, Star, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react"
import Navbar from "@/components/navbar"

export default function QuizPage() {
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
  const [multiAnswers, setMultiAnswers] = useState<{ [key: number]: string[] }>({})
  const [explanations, setExplanations] = useState<{ [key: number]: string }>({})
  const [showResults, setShowResults] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(120) // 2 minutes
  const [timerActive, setTimerActive] = useState(false)
  const [totalPoints, setTotalPoints] = useState(0)
  const [badges, setBadges] = useState<string[]>([])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (timerActive && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
    } else if (timeRemaining === 0 && timerActive) {
      setShowResults(true)
      setTimerActive(false)
    }
    return () => clearTimeout(timer)
  }, [timeRemaining, timerActive])

  const startQuiz = () => {
    setQuizStarted(true)
    setTimerActive(true)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const questions = [
    {
      id: 0,
      type: "matching",
      question: "MATCH THE DEFENSE TO ITS DESCRIPTION",
      items: [
        {
          term: "Each player guards one opponent",
          options: ["One-on-one", "Zone", "Box and 1"],
          correctAnswer: "One-on-one",
        },
        {
          term: "Guards space instead of players",
          options: ["One-on-one", "Zone", "Box and 1"],
          correctAnswer: "Zone",
        },
        {
          term: "A mix: 4 in zone, 1 on star player",
          options: ["One-on-one", "Zone", "Box and 1"],
          correctAnswer: "Box and 1",
        },
      ],
      points: 15,
    },
    {
      id: 1,
      type: "multiple-choice-explanation",
      question: "YOU ARE COACHING A TEAM WITH SLOW DEFENDERS. WHICH STRATEGY DO YOU USE AND WHY?",
      options: ["Box and 1", "Zone", "One-on-one"],
      correctAnswer: "Zone",
      points: 20,
    },
    {
      id: 2,
      type: "multiple-choice-explanation",
      question: "YOUR OPPONENT HAS A SUPERSTAR. WHICH STRATEGY DO YOU USE AND WHY?",
      options: ["Box and 1", "Zone", "One-on-one"],
      correctAnswer: "Box and 1",
      points: 20,
    },
    {
      id: 3,
      type: "multiple-select",
      question: "WHAT ARE THE PROS OF ONE-ON-ONE DEFENSE?",
      options: [
        "Great for team with slow or undersized players",
        "Coverage Flexibility",
        "Builds individual accountability",
        "High pressure on ball-handler",
      ],
      correctAnswers: ["Builds individual accountability", "High pressure on ball-handler"],
      points: 15,
    },
    {
      id: 4,
      type: "multiple-select",
      question: "WHAT ARE THE PROS OF ZONE DEFENSE?",
      options: [
        "Lockdown players",
        "Great for team with slow or undersized players",
        "Builds individual accountability",
        "High pressure on ball-handler",
      ],
      correctAnswers: ["Great for team with slow or undersized players"],
      points: 15,
    },
  ]

  const handleSingleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion]: value,
    })
  }

  const handleExplanation = (value: string) => {
    setExplanations({
      ...explanations,
      [currentQuestion]: value,
    })
  }

  const handleMultiAnswer = (value: string, checked: boolean) => {
    const currentAnswers = multiAnswers[currentQuestion] || []
    let newAnswers

    if (checked) {
      newAnswers = [...currentAnswers, value]
    } else {
      newAnswers = currentAnswers.filter((answer) => answer !== value)
    }

    setMultiAnswers({
      ...multiAnswers,
      [currentQuestion]: newAnswers,
    })
  }

  const nextQuestion = () => {
    // Award points if answer is correct
    const question = questions[currentQuestion]
    let isCorrect = false

    if (question.type === "multiple-select") {
      const selectedAnswers = multiAnswers[currentQuestion] || []
      const correctAnswers = question.correctAnswers as string[]

      isCorrect =
        selectedAnswers.length === correctAnswers.length &&
        selectedAnswers.every((answer) => correctAnswers.includes(answer))
    } else if (question.type === "multiple-choice-explanation") {
      isCorrect = answers[currentQuestion] === question.correctAnswer && !!explanations[currentQuestion]
    } else if (question.type === "matching") {
      // For matching questions, we need to check each item
      const matchingItems = question.items
      let allCorrect = true

      for (let i = 0; i < matchingItems.length; i++) {
        const itemKey = `${currentQuestion}-${i}`
        if (answers[itemKey] !== matchingItems[i].correctAnswer) {
          allCorrect = false
          break
        }
      }

      isCorrect = allCorrect
    } else {
      isCorrect = answers[currentQuestion] === question.correctAnswer
    }

    if (isCorrect) {
      setTotalPoints(totalPoints + question.points)
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowExplanation(false)
    } else {
      // Check for badges
      const score = calculateScore()
      const percentage = Math.round((score / questions.length) * 100)

      if (percentage >= 90) {
        if (!badges.includes("Defense Master")) {
          setBadges([...badges, "Defense Master"])
        }
      } else if (percentage >= 70) {
        if (!badges.includes("Defense Pro")) {
          setBadges([...badges, "Defense Pro"])
        }
      }

      if (timeRemaining > 60) {
        // More than 1 minute left
        if (!badges.includes("Speed Demon")) {
          setBadges([...badges, "Speed Demon"])
        }
      }

      setShowResults(true)
      setTimerActive(false)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setShowExplanation(false)
    }
  }

  const calculateScore = () => {
    let correct = 0

    questions.forEach((question, index) => {
      if (question.type === "multiple-select") {
        const selectedAnswers = multiAnswers[index] || []
        const correctAnswers = question.correctAnswers as string[]

        if (
          selectedAnswers.length === correctAnswers.length &&
          selectedAnswers.every((answer) => correctAnswers.includes(answer))
        ) {
          correct++
        }
      } else if (question.type === "multiple-choice-explanation") {
        if (answers[index] === question.correctAnswer && !!explanations[index]) {
          correct++
        }
      } else if (question.type === "matching") {
        // For matching questions, we need to check each item
        const matchingItems = question.items
        let allCorrect = true

        for (let i = 0; i < matchingItems.length; i++) {
          const itemKey = `${index}-${i}`
          if (answers[itemKey] !== matchingItems[i].correctAnswer) {
            allCorrect = false
            break
          }
        }

        if (allCorrect) {
          correct++
        }
      } else if (answers[index] === question.correctAnswer) {
        correct++
      }
    })

    return correct
  }

  const isAnswered = () => {
    const question = questions[currentQuestion]

    if (question.type === "multiple-select") {
      return (multiAnswers[currentQuestion] || []).length > 0
    } else if (question.type === "multiple-choice-explanation") {
      return !!answers[currentQuestion] && !!explanations[currentQuestion]
    } else if (question.type === "matching") {
      // For matching questions, check if all items have answers
      const matchingItems = question.items
      for (let i = 0; i < matchingItems.length; i++) {
        const itemKey = `${currentQuestion}-${i}`
        if (!answers[itemKey]) {
          return false
        }
      }
      return true
    }

    return !!answers[currentQuestion]
  }

  const renderQuestion = () => {
    const question = questions[currentQuestion]

    if (question.type === "matching") {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{question.question}</h2>
            <div className="neo-badge">+{question.points} POINTS</div>
          </div>

          <div className="space-y-6">
            {question.items.map((item, index) => (
              <div key={index} className="neo-card bg-white">
                <p className="font-bold text-lg mb-4">{item.term}</p>
                <div className="grid grid-cols-3 gap-3">
                {item.options.map((option, optIndex) => {
                    const isSelected = answers[`${currentQuestion}-${index}`] === option
                    return (
                      <button
                        key={optIndex}
                        className={`neo-button-outline ${isSelected ? "selected" : ""}`}
                        onClick={() =>
                          setAnswers({ ...answers, [`${currentQuestion}-${index}`]: option })
                        }
                      >
                        {option}
                      </button>
                    )
                })}
                </div>
              </div>
            ))}
          </div>

          {showExplanation && (() => {
            const isCorrect = question.items.every(
              (_, i) => answers[`${currentQuestion}-${i}`] === question.items[i].correctAnswer
            )
            return (
              <div className={`neo-card mt-6 ${isCorrect ? 'bg-[#c1ff00]' : 'incorrect-answer'}`}>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {question.items.every(
                    (item, index) => answers[`${currentQuestion}-${index}`] === item.correctAnswer,
                  ) ? (
                    <CheckCircle className="text-black" size={24} />
                  ) : (
                    <XCircle className="text-black" size={24} />
                  )}
                </div>
                <div>
                  <p className="font-bold text-lg">
                    {question.items.every(
                      (item, index) => answers[`${currentQuestion}-${index}`] === item.correctAnswer,
                    )
                      ? "CORRECT!"
                      : "INCORRECT!"}
                  </p>
                  <div className="mt-3">
                    <p className="font-bold">CORRECT ANSWERS:</p>
                    <ul className="mt-2 space-y-2">
                      {question.items.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="font-bold">{item.term}:</span> {item.correctAnswer}
                          {answers[`${currentQuestion}-${index}`] !== item.correctAnswer && (
                            <span className="text-black ml-2">
                              (You selected: {answers[`${currentQuestion}-${index}`] || "none"})
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            )
          })()}
        </div>
      )
    }

    if (question.type === "multiple-choice-explanation") {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{question.question}</h2>
            <div className="neo-badge">+{question.points} POINTS</div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {question.options.map((option, idx) => (
            <button
              key={idx}
              className={`neo-button-outline ${
                answers[currentQuestion] === option ? "selected" : ""
              }`}
              onClick={() => handleSingleAnswer(option)}
            >
              {option}
            </button>
            ))}
          </div>

          <div className="neo-card bg-white">
            <label className="font-bold text-lg mb-3 block">EXPLAIN YOUR CHOICE:</label>
            <textarea
              className="w-full h-32 p-3 border-4 border-black rounded-xl"
              value={explanations[currentQuestion] || ""}
              onChange={(e) => handleExplanation(e.target.value)}
              placeholder="Type your explanation here..."
            />
          </div>

          {showExplanation && (() => {
            const isCorrect = answers[currentQuestion] === question.correctAnswer
            return (
              <div className={`neo-card mt-6 ${isCorrect ? 'bg-[#c1ff00]' : 'incorrect-answer'}`}>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {answers[currentQuestion] === question.correctAnswer ? (
                    <CheckCircle className="text-black" size={24} />
                  ) : (
                    <XCircle className="text-black" size={24} />
                  )}
                </div>
                <div>
                  <p className="font-bold text-lg">
                    {answers[currentQuestion] === question.correctAnswer ? "CORRECT!" : "INCORRECT!"}
                  </p>
                  <p className="mt-2">
                    The correct answer is <span className="font-bold">{question.correctAnswer}</span>.
                  </p>
                  {answers[currentQuestion] === "Zone" && currentQuestion === 1 && (
                    <p className="mt-2">
                      Zone defense is perfect for teams with slower defenders because it assigns players to guard areas
                      rather than specific opponents. This reduces the need for quick lateral movement and helps hide
                      defensive weaknesses.
                    </p>
                  )}
                  {answers[currentQuestion] === "Box and 1" && currentQuestion === 2 && (
                    <p className="mt-2">
                      Box and 1 is ideal against a team with one superstar because it dedicates one defender to shadow
                      the star player while maintaining zone coverage with the other four defenders. This limits the
                      star's impact while not sacrificing overall court coverage.
                    </p>
                  )}
                </div>
              </div>
            </div>
            )
          })()}
        </div>
      )
    }

    if (question.type === "multiple-select") {
      const selectedAnswers = multiAnswers[currentQuestion] || []

      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{question.question}</h2>
            <div className="neo-badge">+{question.points} POINTS</div>
          </div>

          <div className="space-y-3">
            {question.options.map((option, idx) => {
              const isSelected = multiAnswers[currentQuestion]?.includes(option)
              return (
                <button
                  key={idx}
                  className={`neo-button-outline w-full text-left flex items-center gap-3 ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() => handleMultiAnswer(option, !isSelected)}
                >
                  <div
                    className={`w-6 h-6 flex-shrink-0 border-4 border-black rounded-md ${
                      isSelected ? "bg-black" : "bg-white"
                    }`}
                  >
                    {isSelected && <CheckCircle className="text-white" size={16} />}
                  </div>
                  <span className="text-black">{option}</span>
                </button>
              )
            })}

          </div>

          {showExplanation && (() => {
            const selected = multiAnswers[currentQuestion] || []
            const correct = question.correctAnswers as string[]
            const isCorrect =
              selected.length === correct.length &&
              selected.every(a => correct.includes(a))
            return (
            <div className={`neo-card mt-6 ${isCorrect ? 'bg-[#c1ff00]' : 'incorrect-answer'}`}>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {selectedAnswers.length === (question.correctAnswers as string[]).length &&
                  selectedAnswers.every((answer) => (question.correctAnswers as string[]).includes(answer)) ? (
                    <CheckCircle className="text-black" size={24} />
                  ) : (
                    <XCircle className="text-black" size={24} />
                  )}
                </div>
                <div>
                  <p className="font-bold text-lg">
                    {selectedAnswers.length === (question.correctAnswers as string[]).length &&
                    selectedAnswers.every((answer) => (question.correctAnswers as string[]).includes(answer))
                      ? "CORRECT!"
                      : "INCORRECT!"}
                  </p>
                  <div className="mt-3">
                    <p className="font-bold">CORRECT ANSWERS:</p>
                    <ul className="mt-2 space-y-2">
                      {(question.correctAnswers as string[]).map((answer, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="text-black" size={16} />
                          <span>{answer}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            )
          })()}
        </div>
      )
    }

    return <div>Question type not supported</div>
  }

  const renderResults = () => {
    const score = calculateScore()
    const percentage = Math.round((score / questions.length) * 100)

    return (
      <div className="text-center space-y-8 py-8">
        <h2 className="neo-subheading">QUIZ COMPLETE!</h2>

        <div className="w-40 h-40 rounded-full border-8 border-black mx-auto flex items-center justify-center bg-[#c1ff00]">
          <div className="text-center">
            <div className="text-4xl font-bold">
              {score}/{questions.length}
            </div>
            <div className="text-lg font-bold">SCORE</div>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <div className="mb-2 flex justify-between text-lg font-bold">
            <span>YOUR SCORE</span>
            <span>{percentage}%</span>
          </div>
          <div className="h-4 w-full bg-white border-4 border-black rounded-full overflow-hidden">
            <div className="h-full bg-[#c1ff00]" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>

        <div className="neo-card max-w-md mx-auto">
          <h3 className="font-bold text-xl mb-4">PERFORMANCE SUMMARY:</h3>
          <p className="text-lg">
            {percentage >= 80
              ? "EXCELLENT! YOU HAVE A STRONG UNDERSTANDING OF BASKETBALL DEFENSIVE STRATEGIES."
              : percentage >= 60
                ? "GOOD JOB! YOU UNDERSTAND THE BASICS, BUT COULD IMPROVE ON SOME CONCEPTS."
                : "YOU'RE ON YOUR WAY TO UNDERSTANDING BASKETBALL DEFENSE. CONSIDER REVIEWING THE MATERIAL AGAIN."}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="neo-card bg-[#c1ff00]">
              <div className="text-center">
                <div className="text-3xl font-bold">{totalPoints}</div>
                <div className="font-bold">POINTS EARNED</div>
              </div>
            </div>
            <div className="neo-card bg-[#c1ff00]">
              <div className="text-center">
                <div className="text-3xl font-bold">{formatTime(timeRemaining)}</div>
                <div className="font-bold">TIME REMAINING</div>
              </div>
            </div>
          </div>

          {badges.length > 0 && (
            <div className="mt-6 pt-6 border-t-4 border-black">
              <h4 className="font-bold text-lg mb-4">BADGES EARNED:</h4>
              <div className="flex flex-wrap gap-3">
                {badges.map((badge, index) => (
                  <div key={index} className="neo-badge flex items-center gap-1">
                    <Trophy size={16} />
                    <span>{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-6 mt-8">
          <a href="/learning-path" className="neo-button-outline">
            CONTINUE LEARNING
          </a>
          <a href="/" className="neo-button bg-[#c1ff00]">
            BACK TO HOME
          </a>
        </div>
      </div>
    )
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />

        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12 space-y-8">
              <h1 className="neo-subheading">BASKETBALL DEFENSE QUIZ CHALLENGE</h1>
              <p className="text-xl max-w-2xl mx-auto">
                TEST YOUR KNOWLEDGE OF BASKETBALL DEFENSIVE STRATEGIES WITH THIS TIMED QUIZ. YOU HAVE 2 MINUTES TO
                ANSWER ALL QUESTIONS. READY TO SHOW YOUR DEFENSIVE IQ?
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
                        <span className="font-bold">QUESTIONS COVERING ALL DEFENSIVE STRATEGIES</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#c1ff00] border-4 border-black rounded-full flex-shrink-0 flex items-center justify-center font-bold">
                          2
                        </div>
                        <span className="font-bold">MINUTES TO COMPLETE THE QUIZ</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#c1ff00] border-4 border-black rounded-full flex-shrink-0 flex items-center justify-center font-bold">
                          ★
                        </div>
                        <span className="font-bold">EARN BADGES BASED ON YOUR PERFORMANCE</span>
                      </li>
                    </ul>
                  </div>

                  <div className="neo-card bg-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Trophy size={24} className="text-[#c1ff00]" />
                        <span className="font-bold text-lg">POTENTIAL BADGES:</span>
                      </div>
                      <div className="flex gap-3">
                        <div className="neo-badge">DEFENSE MASTER</div>
                        <div className="neo-badge">SPEED DEMON</div>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="neo-button bg-[#c1ff00] w-full text-xl py-4" onClick={startQuiz}>
                  START QUIZ
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {!showResults ? (
            <div>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="neo-subheading">BASKETBALL DEFENSE QUIZ</h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 neo-badge">
                      <Star size={16} />
                      <span>{totalPoints} PTS</span>
                    </div>
                    <div className="flex items-center gap-2 neo-badge bg-[#ff5757] border-black">
                      <Clock size={16} />
                      <span>{formatTime(timeRemaining)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-lg font-bold mb-2">
                  <span>
                    QUESTION {currentQuestion + 1} OF {questions.length}
                  </span>
                  <span>PROGRESS</span>
                </div>
                <div className="h-4 w-full bg-white border-4 border-black rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#c1ff00]"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="neo-card mb-8">{renderQuestion()}</div>

              <div className="flex justify-between items-center">
                <button
                  className="neo-button-outline flex items-center gap-2"
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                >
                  <ChevronLeft size={20} />
                  <span>PREVIOUS</span>
                </button>

                {!showExplanation && isAnswered() && (
                  <button className="neo-button bg-[#c1ff00]" onClick={() => setShowExplanation(true)}>
                    CHECK ANSWER
                  </button>
                )}

                <button
                  className="neo-button flex items-center gap-2 bg-[#c1ff00]"
                  onClick={nextQuestion}
                  disabled={!isAnswered()}
                >
                  <span>{currentQuestion === questions.length - 1 ? "FINISH QUIZ" : "NEXT QUESTION"}</span>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ) : (
            renderResults()
          )}
        </div>
      </main>
    </div>
  )
}
