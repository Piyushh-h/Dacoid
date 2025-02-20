"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ScoreboardProps {
  score: number
  totalQuestions: number
}

export default function Scoreboard({ score, totalQuestions }: ScoreboardProps) {
  const percentage = Math.round((score / totalQuestions) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="bg-quiz-primary/10 border-quiz-primary/20 shadow-lg shadow-quiz-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-quiz-accent">Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
            className="text-6xl font-bold text-center text-quiz-secondary"
          >
            {score} / {totalQuestions}
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-center mt-4 text-quiz-text"
          >
            You scored {percentage}%
          </motion.p>
          <motion.div
            className="w-full h-4 bg-quiz-secondary/20 rounded-full mt-6 overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <motion.div
              className="h-full bg-quiz-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
            />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

