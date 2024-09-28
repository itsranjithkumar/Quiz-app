from fastapi import APIRouter,Depends, HTTPException
from sqlalchemy.orm import Session

from app import schemas
from app.utils import get_current_user
from ..users import get_all_users, get_user_by_username
from ..models import User

from ..database import get_db

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)


@router.get("/")
def read_users(db: Session = Depends(get_db),current_user: schemas.User = Depends(get_current_user)):
    users=get_all_users(db)
    return users


@router.get("/{username}", response_model=schemas.User)
def get_user(username: str, db: Session = Depends(get_db),current_user: schemas.User = Depends(get_current_user)):
    user = get_user_by_username(db, username=username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
