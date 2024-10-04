from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="user")  # roles: admin, user
    is_active = Column(Boolean, default=True)

class Quiz(Base):
    __tablename__ = "quizzes"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, index=True)
    difficulty = Column(String)  # easy, medium, hard
    questions = relationship("Question", back_populates="quiz")

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    question_text = Column(String)
    question_type = Column(String)  # MCQ, MSQ, Numerical
    options = Column(String)  # For MCQ/MSQ, store as a JSON array
    correct_answer = Column(String)  # Store correct answer(s)
    duration=Column(Integer)# seconds

    quiz = relationship("Quiz", back_populates="questions")

class Score(Base):
    __tablename__ = "scores"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    score = Column(Integer)
    streak = Column(Integer)  # Track user streaks
