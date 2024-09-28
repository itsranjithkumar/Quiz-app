"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function CreateQuizModal() {
  const [title, setTitle] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [timer, setTimer] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    // TODO: Implement API call to create quiz
    console.log({ title, difficulty, timer })
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
          <div className="space-y-2">
            <Label htmlFor="timer">Timer (in seconds)</Label>
            <Input
              id="timer"
              type="number"
              value={timer}
              onChange={(e) => setTimer(e.target.value)}
              placeholder="Enter timer in seconds"
              required
            />
          </div>
          <Button type="submit" className="w-full">Create Quiz</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}