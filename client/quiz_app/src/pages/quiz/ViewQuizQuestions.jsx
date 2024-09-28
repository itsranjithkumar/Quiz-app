"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"



export default function ViewQuizQuestions() {
  const [quizId, setQuizId] = useState("1") // Replace with actual quiz ID
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    // TODO: Implement API call to fetch questions for the quiz
    // This is a mock API call
    const fetchQuestions = async () => {
      const response = await fetch(`/api/quizzes/${quizId}/questions`)
      const data = await response.json()
      setQuestions(data)
    }

    fetchQuestions()
  }, [quizId])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quiz Questions</h1>
      <div className="space-y-4">
        {questions.map((question) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle>{question.question_text}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">Type: {question.question_type}</p>
              {question.options && (
                <ul className="list-disc list-inside mb-2">
                  {question.options.map((option, index) => (
                    <li key={index}>{option}</li>
                  ))}
                </ul>
              )}
              <p>Correct Answer: {question.correct_answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button className="mt-4">Add New Question</Button>
    </div>
  )
}