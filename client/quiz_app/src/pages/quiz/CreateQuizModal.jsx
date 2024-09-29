"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useSelector } from "react-redux" // Assuming you're using Redux for token management
import { useToast } from "@/hooks/use-toast"

export default function CreateQuizModal() {
  const [title, setTitle] = useState("")
  const [difficulty, setDifficulty] = useState("")
  
  const { token } = useSelector((state) => state.auth); // Get the auth token from Redux store
  const { toast } = useToast(); // Use toast for success or error notifications

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('http://localhost:8000/admin/quiz', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, difficulty })
      });

      if (!response.ok) {
        throw new Error('Failed to create quiz');
      }

      const result = await response.json();
      toast({ title: "Success", description: "Quiz created successfully", variant: "success" });
      console.log(result); // Quiz created successfully

    } catch (error) {
      console.error('Error creating quiz:', error);
      toast({ title: "Error", description: error.message || "Failed to create quiz", variant: "destructive" });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create New Quiz</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Quiz</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Quiz Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter quiz title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select onValueChange={setDifficulty} required>
              <SelectTrigger id="difficulty">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">Create Quiz</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
