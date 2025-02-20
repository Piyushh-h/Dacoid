"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Attempt {
  id?: number
  date: Date
  score: number
  totalQuestions: number
  answers: {
    questionId: number
    userAnswer: string | number
    correct: boolean
  }[]
}

interface HistoryProps {
  attempts: Attempt[]
}

export default function History({ attempts }: HistoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="w-full max-w-md mt-8"
    >
      <Card className="bg-quiz-primary/10 border-quiz-primary/20 shadow-lg shadow-quiz-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-quiz-accent">Attempt History</CardTitle>
        </CardHeader>
        <CardContent>
          {attempts.length === 0 ? (
            <p className="text-quiz-text/80">No previous attempts</p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              <AnimatePresence>
                {attempts.map((attempt, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <AccordionItem value={`item-${index}`} className="border-b border-quiz-primary/20">
                      <AccordionTrigger className="text-quiz-text hover:text-quiz-accent">
                        {new Date(attempt.date).toLocaleString()}: {attempt.score} / {attempt.totalQuestions}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2">
                          {attempt.answers.map((answer, answerIndex) => (
                            <motion.li
                              key={answerIndex}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: answerIndex * 0.05 }}
                              className={`p-2 rounded ${answer.correct ? "bg-quiz-correct/20 text-quiz-correct" : "bg-quiz-incorrect/20 text-quiz-incorrect"}`}
                            >
                              Question {answer.questionId}: {answer.userAnswer.toString()}
                              {answer.correct ? " (Correct)" : " (Incorrect)"}
                            </motion.li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Accordion>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

