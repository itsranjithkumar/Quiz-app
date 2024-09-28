"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"



export default function TakeQuiz() {
  const [quizId, setQuizId] = useState("1") // Replace with actual quiz ID
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({})
  const [timer, setTimer] = useState(60) // Replace with actual quiz timer

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

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [currentQuestion]: value })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    // TODO: Implement API call to submit answers
    console.log(answers)
  }

  const renderQuestion = () => {
    const question = questions[currentQuestion]
    if (!question) return null

    switch (question.question_type) {
      case "MCQ":
        return (
          <RadioGroup onValueChange={(value) => handleAnswer(value)}>
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )
      case "MSQ":
        return (
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`option-${index}`}
                  onCheckedChange={(checked) => {
                    const currentAnswers = answers[currentQuestion] as string[] || []
                    if (checked) {
                      handleAnswer([...currentAnswers, option])
                    } else {
                      handleAnswer(currentAnswers.filter((a) => a !== option))
                    }
                  }}
                />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        )
      case "Numerical":
        return (
          <Input
            type="number"
            placeholder="Enter your answer"
            onChange={(e) => handleAnswer(e.target.value)}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Take Quiz</h1>
      <div className="mb-4">Time Remaining: {timer} seconds</div>
      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Question {currentQuestion + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{questions[currentQuestion].question_text}</p>
            {renderQuestion()}
          </CardContent>
        </Card>
      )}
      <div className="flex justify-between mt-4">
        <Button onClick={handlePrevious} disabled={currentQuestion === 0}>
          Previous
        </Button>
        {currentQuestion < questions.length - 1 ? (
          <Button onClick={handleNext}>Next</Button>
        ) : (
          <Button onClick={handleSubmit}>Submit</Button>
        )}
      </div>
    </div>
  )
}