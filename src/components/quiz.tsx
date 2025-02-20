"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CheckCircle, XCircle } from "lucide-react"
import Timer from "./timer"
import Scoreboard from "./scoreboard"
import History from "./history"
import { saveAttempt, getAttempts } from "@/lib/db"

const questions = [
  {
    id: 1,
    question: "Which planet is closest to the Sun?",
    type: "multiple-choice",
    options: ["Venus", "Mercury", "Earth", "Mars"],
    correctAnswer: "Mercury",
  },
  {
    id: 2,
    question: "Which data structure organizes items in a First-In, First-Out (FIFO) manner?",
    type: "multiple-choice",
    options: ["Stack", "Queue", "Tree", "Graph"],
    correctAnswer: "Queue",
  },
  {
    id: 3,
    question: "Which of the following is primarily used for structuring web pages?",
    type: "multiple-choice",
    options: ["Python", "Java", "HTML", "C++"],
    correctAnswer: "HTML",
  },
  {
    id: 4,
    question: "Which chemical symbol stands for Gold?",
    type: "multiple-choice",
    options: ["Au", "Gd", "Ag", "Pt"],
    correctAnswer: "Au",
  },
  {
    id: 5,
    question: "Which of these processes is not typically involved in refining petroleum?",
    type: "multiple-choice",
    options: ["Fractional distillation", "Cracking", "Polymerization", "Filtration"],
    correctAnswer: "Filtration",
  },
  {
    id: 6,
    question: "What is the value of 12 + 28?",
    type: "integer",
    correctAnswer: 40,
  },
  {
    id: 7,
    question: "How many states are there in the United States?",
    type: "integer",
    correctAnswer: 50,
  },
  {
    id: 8,
    question: "In which year was the Declaration of Independence signed?",
    type: "integer",
    correctAnswer: 1776,
  },
  {
    id: 9,
    question: "What is the value of pi rounded to the nearest integer?",
    type: "integer",
    correctAnswer: 3,
  },
  {
    id: 10,
    question: "If a car travels at 60 mph for 2 hours, how many miles does it travel?",
    type: "integer",
    correctAnswer: 120,
  },
]

const TOTAL_QUIZ_TIME = 30 * 60 // 30 minutes in seconds
const QUESTION_TIME = 30 // 30 seconds per question

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [integerAnswer, setIntegerAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [attempts, setAttempts] = useState([])
  const [userAnswers, setUserAnswers] = useState([])
  const [overallTimerKey, setOverallTimerKey] = useState(0)
  const [questionTimerKey, setQuestionTimerKey] = useState(0)
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)

  const loadAttempts = useCallback(async () => {
    const loadedAttempts = await getAttempts()
    setAttempts(loadedAttempts)
  }, [])

  useEffect(() => {
    loadAttempts()
  }, [loadAttempts])

  const saveQuizAttempt = useCallback(async () => {
    const attempt = {
      date: new Date(),
      score: score,
      totalQuestions: questions.length,
      answers: userAnswers,
    }

    await saveAttempt(attempt)
    loadAttempts()
  }, [score, userAnswers, loadAttempts])

  const moveToNextQuestion = useCallback(() => {
    const nextQuestion = currentQuestion + 1
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion)
      setSelectedAnswer("")
      setIntegerAnswer("")
      setFeedback(null)
      setQuestionTimerKey((prevKey) => prevKey + 1)
      setHasAnswered(false)
    } else {
      setShowScore(true)
      saveQuizAttempt()
    }
  }, [currentQuestion, saveQuizAttempt])

  const checkAnswer = useCallback(
    (answer: string | number) => {
      const currentQuestionData = questions[currentQuestion]
      let isCorrect = false

      if (currentQuestionData.type === "multiple-choice") {
        isCorrect = answer === currentQuestionData.correctAnswer
      } else if (currentQuestionData.type === "integer") {
        isCorrect = Number(answer) === currentQuestionData.correctAnswer
      }

      setFeedback(isCorrect ? "correct" : "incorrect")
      setHasAnswered(true)

      if (isCorrect) {
        setScore((prevScore) => prevScore + 1)
      }

      setUserAnswers((prevUserAnswers) => [
        ...prevUserAnswers,
        {
          questionId: currentQuestionData.id,
          userAnswer: answer,
          correct: isCorrect,
        },
      ])
    },
    [currentQuestion, questions],
  )

  const handleAnswerSelect = useCallback(
    (answer: string) => {
      setSelectedAnswer(answer)
      checkAnswer(answer)
    },
    [checkAnswer],
  )

  const handleIntegerAnswer = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setIntegerAnswer(value)
      if (value !== "") {
        checkAnswer(Number.parseInt(value))
      }
    },
    [checkAnswer],
  )

  const handleNextQuestion = useCallback(() => {
    moveToNextQuestion()
  }, [moveToNextQuestion])

  const handleQuestionTimeUp = useCallback(() => {
    if (!feedback) {
      checkAnswer("Time's up")
    }
    moveToNextQuestion()
  }, [checkAnswer, moveToNextQuestion, feedback])

  const handleOverallTimeUp = useCallback(() => {
    setShowScore(true)
    saveQuizAttempt()
  }, [saveQuizAttempt])

  const resetQuiz = useCallback(() => {
    setCurrentQuestion(0)
    setSelectedAnswer("")
    setIntegerAnswer("")
    setScore(0)
    setShowScore(false)
    setUserAnswers([])
    setOverallTimerKey((prevKey) => prevKey + 1)
    setQuestionTimerKey(0)
    setFeedback(null)
    setHasAnswered(false)
  }, [])

  if (showScore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-quiz-background text-quiz-text">
        <Scoreboard score={score} totalQuestions={questions.length} />
        <Button onClick={resetQuiz} className="mt-4 bg-quiz-accent hover:bg-quiz-accent/80 text-quiz-text">
          Try Again
        </Button>
        <History attempts={attempts} />
      </div>
    )
  }

  const currentQuestionData = questions[currentQuestion]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-quiz-background text-quiz-text p-4">
      <Card className="w-full max-w-2xl bg-quiz-primary/10 border-quiz-primary/20 shadow-lg shadow-quiz-primary/20">
        <CardHeader className="border-b border-quiz-primary/20">
          <CardTitle className="text-2xl font-bold text-quiz-accent">
            Question {currentQuestion + 1} of {questions.length}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-2">
            <Timer key={`overall-${overallTimerKey}`} duration={TOTAL_QUIZ_TIME} onTimeUp={handleOverallTimeUp} />
            <Timer
              key={`question-${questionTimerKey}`}
              duration={QUESTION_TIME}
              onTimeUp={handleQuestionTimeUp}
              isQuestionTimer
            />
          </div>
          <motion.p
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 mb-6 text-xl font-semibold text-quiz-text"
          >
            {currentQuestionData.question}
          </motion.p>
          {currentQuestionData.type === "multiple-choice" ? (
            <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect} className="space-y-4">
              <AnimatePresence>
                {currentQuestionData.options.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-quiz-secondary/10 hover:bg-quiz-secondary/20 transition-colors"
                  >
                    <RadioGroupItem
                      value={option}
                      id={`option-${index}`}
                      className="border-quiz-secondary text-quiz-secondary"
                    />
                    <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer text-quiz-text">
                      {option}
                    </Label>
                  </motion.div>
                ))}
              </AnimatePresence>
            </RadioGroup>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Input
                type="number"
                placeholder="Enter your answer"
                value={integerAnswer}
                onChange={handleIntegerAnswer}
                className="bg-quiz-secondary/10 border-quiz-secondary/20 text-quiz-text placeholder-quiz-text/50"
              />
            </motion.div>
          )}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`mt-6 p-4 rounded-md flex items-center ${
                  feedback === "correct" ? "bg-quiz-correct/20" : "bg-quiz-incorrect/20"
                }`}
              >
                {feedback === "correct" ? (
                  <CheckCircle className="w-6 h-6 text-quiz-correct mr-2" />
                ) : (
                  <XCircle className="w-6 h-6 text-quiz-incorrect mr-2" />
                )}
                <span className={feedback === "correct" ? "text-quiz-correct" : "text-quiz-incorrect"}>
                  {feedback === "correct" ? "Correct!" : "Incorrect. Try again!"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleNextQuestion}
            disabled={!hasAnswered}
            className="w-full bg-quiz-accent hover:bg-quiz-accent/80 text-quiz-text"
          >
            {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

