from sqlalchemy.orm import Session
from . import models, schemas

# Create a new quiz
def create_quiz(db: Session, quiz: schemas.QuizCreate):
    db_quiz = models.Quiz(title=quiz.title, difficulty=quiz.difficulty, timer=quiz.timer)
    db.add(db_quiz)
    db.commit()
    db.refresh(db_quiz)
    return db_quiz

# Get all quizzes
def get_quizzes(db: Session):
    return db.query(models.Quiz).all()

# Add a question to a quiz
def add_question(db: Session, quiz_id: int, question: schemas.QuestionCreate):
    db_question = models.Question(
        quiz_id=quiz_id,
        question_text=question.question_text,
        question_type=question.question_type,
        options=question.options,
        correct_answer=question.correct_answer
    )
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

# Answer a quiz question and calculate score
def answer_question(db: Session, quiz_id: int, answers: schemas.Answer, user: models.User):
    # Fetch quiz questions
    questions = db.query(models.Question).filter(models.Question.quiz_id == quiz_id).all()

    total_score = 0
    correct_count = 0

    # Score each question
    for question, answer in zip(questions, answers.answers):
        if question.correct_answer == answer:
            correct_count += 1
            total_score += 10  # You can adjust scoring logic

    # Save the score for the user
    db_score = models.Score(user_id=user.id, quiz_id=quiz_id, score=total_score, streak=user.streak)
    db.add(db_score)
    db.commit()

    return db_score

# Get the leaderboard (sorted by highest score)
def get_leaderboard(db: Session):
    return db.query(models.Score).order_by(models.Score.score.desc()).all()

# Get user's current quiz-taking streak
def get_user_streak(db: Session, user: models.User):
    return db.query(models.Score).filter(models.Score.user_id == user.id).order_by(models.Score.id.desc()).first()
