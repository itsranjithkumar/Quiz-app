from pydantic import BaseModel
from typing import List, Optional

# User schemas
class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    role: str
    is_active: bool

    class Config:
        orm_mode = True

# Token schema for authentication
class Token(BaseModel):
    access_token: str
    token_type: str

# Quiz schema
class QuizBase(BaseModel):
    title: str
    difficulty: str
    timer: int

class QuizCreate(QuizBase):
    pass


class Loginschema(BaseModel):
    email: str
    password: str


class Quiz(QuizBase):
    id: int

    class Config:
        orm_mode = True

# Question schema
class QuestionBase(BaseModel):
    question_text: str
    question_type: str
    options: str  # Assuming JSON format for MCQ options
    correct_answer: str

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase):
    id: int
    quiz_id: int

    class Config:
        orm_mode = True

# Answer schema
class Answer(BaseModel):
    answers: List[str]  # List of answers for each question in the quiz

# Score schema
class Score(BaseModel):
    score: int
    streak: int

class LeaderboardEntry(BaseModel):
    user: User
    score: int

# Streak schema
class Streak(BaseModel):
    streak: int

    class Config:
        orm_mode = True

# Email notification schema
class EmailNotification(BaseModel):
    recipients: List[str]
    subject: str
    body: str
