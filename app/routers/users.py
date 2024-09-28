from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from ..users import get_all_users
from ..models import User

from ..database import get_db

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)


@router.get("/")
def read_users(db: Session = Depends(get_db)):
    users=get_all_users(db)
    return users