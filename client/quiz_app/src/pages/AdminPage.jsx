"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CreateQuizModal from "./create-quiz-modal"
import AddQuestion from "./add-question"
import ViewQuizQuestions from "./view-quiz-questions"
import TakeQuiz from "./take-quiz"

interface Quiz {
  id: number
  title: string
  difficulty: string
  timer: number
}

export default function AdminDashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [currentPage, setCurrentPage] = useState("dashboard")
  const router = useRouter()

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch("/api/quizzes")
        const data = await response.json()
        setQuizzes(data)
      } catch (error) {
        console.error("Failed to fetch quizzes:", error)
      }
    }

    fetchQuizzes()
  }, [])

  const handleDeleteQuiz = async (id: number) => {
    // TODO: Implement delete quiz functionality
    console.log(`Delete quiz with id: ${id}`)
  }

  const renderContent = () => {
    switch (currentPage) {
      case "addQuestion":
        return <AddQuestion />
      case "viewQuestions":
        return <ViewQuizQuestions />
      case "takeQuiz":
        return <TakeQuiz />
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Quizzes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Timer (seconds)</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quizzes.map((quiz) => (
                    <TableRow key={quiz.id}>
                      <TableCell>{quiz.id}</TableCell>
                      <TableCell>{quiz.title}</TableCell>
                      <TableCell>{quiz.difficulty}</TableCell>
                      <TableCell>{quiz.timer}</TableCell>
                      <TableCell>
                        <div className="space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedQuiz(quiz)
                              setCurrentPage("viewQuestions")
                            }}
                          >
                            View Questions
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedQuiz(quiz)
                              setCurrentPage("addQuestion")
                            }}
                          >
                            Add Question
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedQuiz(quiz)
                              setCurrentPage("takeQuiz")
                            }}
                          >
                            Take Quiz
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteQuiz(quiz.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="mb-4 flex justify-between items-center">
        <Button onClick={() => setCurrentPage("dashboard")}>Dashboard</Button>
        <CreateQuizModal />
      </div>
      {renderContent()}
    </div>
  )
}