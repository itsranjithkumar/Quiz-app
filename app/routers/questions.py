from fastapi import APIRouter, Depends
from requests import Session
from ..database import get_db
from ..schemas import QuestionCreate
from ..models import Question
router = APIRouter(
    prefix="/questions",
    tags=["questions"],
    responses={404: {"description": "Not found"}},
)


@router.post("/{quiz_id}/", response_model=QuestionCreate)
def add_question(question: QuestionCreate,quiz_id: int,db: Session = Depends(get_db)):
    new_question = Question(**question.dict())
    new_question.quiz_id = quiz_id
    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    return new_question
    

