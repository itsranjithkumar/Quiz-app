from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import timedelta

from . import models, schemas, database, auth, quiz, users
from .database import engine, get_db
from .utils import get_current_user
from .routers import auth_routes, admin, quiz

# Initialize FastAPI app
app = FastAPI()

# Create the database tables if they don't exist
models.Base.metadata.create_all(bind=engine)

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")






# Login route to generate JWT token
@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: schemas.User = Depends(get_current_user)):
    return current_user


# Get all quizzes (accessible to all users)


# Add questions to a quiz (admin only)

# Answer a quiz question and score the quiz

# Leaderboard route (Weekly)

# Streak notification (user-based)


# Email notification route (admin sends notifications)
app.include_router(auth_routes.router)
app.include_router(admin.router)
app.include_router(quiz.router)