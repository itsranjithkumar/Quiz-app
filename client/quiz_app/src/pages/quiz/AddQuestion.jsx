import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function AddQuestion({ quiz, setCurrentPage }) {
  const navigate = useNavigate();
  const [quizId, setQuizId] = useState(quiz?.id || ""); 
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState(""); // Track selected answer
  const [error, setError] = useState(""); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://127.0.0.1:8000/questions/${quizId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question_text: questionText,
          question_type: questionType,
          options: options.join(","), 
          correct_answer: correctAnswer,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to add question");
      }

      setCurrentPage("dashboard");
      window.location.reload();

    } catch (err) {
      setError(err.message); 
    }
  };

  // Function to check if an option is correct or wrong
  const handleOptionSelect = (selectedOption) => {
    setSelectedAnswer(selectedOption);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Question</h1>
     
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="quizId">Quiz ID</Label>
          <Input
            id="quizId"
            value={quizId}
            onChange={(e) => setQuizId(e.target.value)}
            placeholder="Enter Quiz ID"
            required
            disabled
          />
        </div>
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
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    setOptions(newOptions);
                  }}
                  placeholder={`Option ${index + 1}`}
                  required
                />
                {/* Check for correct and wrong answer */}
                {selectedAnswer && (
                  <span className="ml-2">
                    {option === correctAnswer ? (
                      <span className="text-green-500">✔</span> // Correct answer mark
                    ) : selectedAnswer === option ? (
                      <span className="text-red-500">✘</span> // Wrong answer mark
                    ) : null}
                  </span>
                )}
              </div>
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
          <Label>Select Answer</Label>
          {options.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === option ? "outline" : "solid"}
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </Button>
          ))}
        </div>

        {error && <p className="text-red-600">{error}</p>} {/* Show error if exists */}
        <Button type="submit" className="w-full">Add Question</Button>
      </form>
    </div>
  );
}
