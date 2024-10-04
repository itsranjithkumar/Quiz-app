"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function AddQuestion({ quiz }) {
  const [questionText, setQuestionText] = useState("")
  const [questionType, setQuestionType] = useState("")
  const [options, setOptions] = useState(["", "", "", ""])
  const [correctAnswer, setCorrectAnswer] = useState("")
  const [duration, setDuration] = useState(0)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formattedOptions = options.filter(option => option !== "").join(";") // Join options into a semicolon-separated string

    const questionData = {
      question_text: questionText,
      question_type: questionType,
      options: formattedOptions,
      correct_answer: correctAnswer,
      duration: parseInt(duration, 10),
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/questions/${quiz.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionData),
      })

      if (response.ok) {
        // Handle success
        console.log("Question added successfully!")
      } else {
        console.error("Failed to add question")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Question to Quiz {quiz.title}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="questionText">Question Text</Label>
          <Textarea
            id="questionText"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Enter question text"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="questionType">Question Type</Label>
          <Select onValueChange={setQuestionType} required>
            <SelectTrigger id="questionType">
              <SelectValue placeholder="Select question type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MCQ">Multiple Choice (MCQ)</SelectItem>
              <SelectItem value="MSQ">Multiple Select (MSQ)</SelectItem>
              <SelectItem value="Numerical">Numerical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {(questionType === "MCQ" || questionType === "MSQ") && (
          <div className="space-y-2">
            <Label>Options</Label>
            {options.map((option, index) => (
              <Input
                key={index}
                value={option}
                onChange={(e) => {
                  const newOptions = [...options]
                  newOptions[index] = e.target.value
                  setOptions(newOptions)
                }}
                placeholder={`Option ${index + 1}`}
                required
              />
            ))}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="correctAnswer">Correct Answer</Label>
          <Input
            id="correctAnswer"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            placeholder="Enter correct answer"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            type="number"
            placeholder="Enter duration in seconds"
            required
          />
        </div>
        <Button type="submit" className="w-full">Add Question</Button>
      </form>
    </div>
  )
}
