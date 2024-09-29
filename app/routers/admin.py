# Admin-specific route for adding quizzes
# from ..auth import get_current_user
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session

from app import auth
from .. import schemas
from ..database import get_db
from .. import quiz
from fastapi import APIRouter
from app.utils import get_current_admin_user

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    responses={404: {"description": "Not found"}},
)
@router.post("/quiz", response_model=schemas.Quiz)
def create_quiz(quiz_data: schemas.QuizCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_admin_user)):
    try:
        return quiz.create_quiz(db=db, quiz=quiz_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/quiz/{quiz_id}/question", response_model=schemas.Question)
def add_question(quiz_id: int, question: schemas.QuestionCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_admin_user)):
    return quiz.add_question(db=db, quiz_id=quiz_id, question=question)


@router.post("/notify", status_code=204)
def send_email_notifications(email: schemas.EmailNotification, background_tasks: BackgroundTasks, current_user: schemas.User = Depends(get_current_admin_user)):
    background_tasks.add_task(auth.send_email_notification, email.recipients, email.subject, email.body)
    return {"message": "Email notifications scheduled."}

