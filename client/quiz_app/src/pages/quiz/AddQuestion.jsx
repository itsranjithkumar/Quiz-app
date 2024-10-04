import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function AddQuestion({ quiz,setCurrentPage }) {
  const navigate = useNavigate(); // Replaces useHistory
  const [quizId, setQuizId] = useState(quiz?.id || ""); // Pre-populate quiz ID
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [duration, setDuration] = useState(0)

  const [error, setError] = useState(""); // To handle errors

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted"); // Debugging log

    try {
      const response = await fetch(`http://127.0.0.1:8000/questions/${quizId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question_text: questionText,
          question_type: questionType,
          options: options.join(","), // Join options into a comma-separated string
          correct_answer: correctAnswer,
          duration: parseInt(duration*60, 10),
        }),
      });

      console.log("Response status:", response.status); // Debugging log

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to add question");
      }

      console.log("Navigating to admin page..."); // Debugging log
      
      setCurrentPage("dashboard");
      // reload
      window.location.reload();

    } catch (err) {
      console.error("Error occurred:", err.message); // Debugging log
      setError(err.message); // Set error message to be displayed
    }
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
              <Input
                key={index}
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = e.target.value;
                  setOptions(newOptions);
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
        {error && <p className="text-red-600">{error}</p>} {/* Show error if exists */}
        <Button type="submit" className="w-full">Add Question</Button>
      </form>
    </div>
  );
}
