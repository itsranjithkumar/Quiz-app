import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddQuestion from "./quiz/AddQuestion";
import ViewQuizQuestions from "./quiz/ViewQuizQuestions";
import TakeQuiz from "./quiz/TakeQuiz";
import CreateQuizModal from "./quiz/CreateQuizModal";

export default function AdminDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentPage, setCurrentPage] = useState("dashboard");

  // Fetch quizzes on component mount
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/quiz/quizzes");
        const data = await response.json();
        setQuizzes(data);
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  // Handle quiz deletion
  const handleDeleteQuiz = async (id) => {
    console.log(`Sending delete request for quiz ID: ${id}`); // Debugging log
    try {
      const response = await fetch(`http://127.0.0.1:8000/quiz/quiz/${id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        // If deletion is successful, update the state to remove the deleted quiz
        setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.id !== id));
        console.log(`Quiz with id: ${id} has been deleted successfully.`);
      } else {
        const errorData = await response.json(); // Get error response data
        console.error("Failed to delete quiz:", response.statusText, errorData);
      }
    } catch (error) {
      console.error("Error occurred while deleting quiz:", error);
    }
  };

  // Render the content based on current page
  const renderContent = () => {
    switch (currentPage) {
      case "addQuestion":
        return <AddQuestion quiz={selectedQuiz} setCurrentPage={setCurrentPage} />;
      case "viewQuestions":
        return <ViewQuizQuestions quiz={selectedQuiz} />;
      case "takeQuiz":
        return <TakeQuiz quiz={selectedQuiz} />;
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
                              setSelectedQuiz(quiz);
                              setCurrentPage("viewQuestions");
                            }}
                          >
                            View {quiz.questions.length} Questions
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedQuiz(quiz);
                              setCurrentPage("addQuestion");
                            }}
                          >
                            Add Question
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedQuiz(quiz);
                              setCurrentPage("takeQuiz");
                            }}
                          >
                            Take Quiz
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteQuiz(quiz.id)} // Call delete function
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
        );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="mb-4 flex justify-between items-center">
        <Button onClick={() => setCurrentPage("dashboard")}>Dashboard</Button>
        <CreateQuizModal />
      </div>
      {renderContent()}
    </div>
  );
}
