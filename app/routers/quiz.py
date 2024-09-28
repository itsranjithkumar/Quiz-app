from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.utils import get_current_user
from .. import schemas
from ..database import get_db
from .. import quiz

router = APIRouter(
    prefix="/quiz",
    tags=["quiz"],
    responses={404: {"description": "Not found"}},
)




@router.get("/quizzes", response_model=list[schemas.Quiz])
def get_all_quizzes(db: Session = Depends(get_db)):
    return quiz.get_quizzes(db=db)

@router.post("/quiz/{quiz_id}/answer", response_model=schemas.Score)
def answer_quiz_question(quiz_id: int, answers: schemas.Answer, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    return quiz.answer_question(db=db, quiz_id=quiz_id, answers=answers, user=current_user)


@router.get("/leaderboard", response_model=list[schemas.LeaderboardEntry])
def get_leaderboard(db: Session = Depends(get_db)):
    return quiz.get_leaderboard(db=db)
