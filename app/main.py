from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import timedelta

from . import models, schemas, database, auth, quiz, users
from .database import engine, get_db


# Initialize FastAPI app
app = FastAPI()

# Create the database tables if they don't exist
models.Base.metadata.create_all(bind=engine)

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# SECRET_KEY for JWT
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Dependency for user authentication
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        user = users.get_user_by_username(db, username=username)
        if user is None:
            raise credentials_exception
        return user
    except JWTError:
        raise credentials_exception

def get_current_active_user(current_user: schemas.User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def get_current_admin_user(current_user: schemas.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="You don't have enough privileges")
    return current_user

# User registration route
@app.post("/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = users.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return users.create_user(db=db, user=user)

# Login route to generate JWT token
@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = users.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Get current user
@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: schemas.User = Depends(get_current_user)):
    return current_user

# Admin-specific route for adding quizzes
@app.post("/admin/quiz", response_model=schemas.Quiz)
def create_quiz(quiz: schemas.QuizCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_admin_user)):
    return quiz.create_quiz(db=db, quiz=quiz)

# Get all quizzes (accessible to all users)
@app.get("/quizzes", response_model=list[schemas.Quiz])
def get_all_quizzes(db: Session = Depends(get_db)):
    return quiz.get_quizzes(db=db)

# Add questions to a quiz (admin only)
@app.post("/admin/quiz/{quiz_id}/question", response_model=schemas.Question)
def add_question(quiz_id: int, question: schemas.QuestionCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_admin_user)):
    return quiz.add_question(db=db, quiz_id=quiz_id, question=question)

# Answer a quiz question and score the quiz
@app.post("/quiz/{quiz_id}/answer", response_model=schemas.Score)
def answer_quiz_question(quiz_id: int, answers: schemas.Answer, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    return quiz.answer_question(db=db, quiz_id=quiz_id, answers=answers, user=current_user)

# Leaderboard route (Weekly)
@app.get("/leaderboard", response_model=list[schemas.LeaderboardEntry])
def get_leaderboard(db: Session = Depends(get_db)):
    return quiz.get_leaderboard(db=db)

# Streak notification (user-based)
@app.get("/users/me/streak", response_model=schemas.Streak)
def get_user_streak(current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return quiz.get_user_streak(db=db, user=current_user)

# Email notification route (admin sends notifications)
@app.post("/admin/notify", status_code=204)
def send_email_notifications(email: schemas.EmailNotification, background_tasks: BackgroundTasks, current_user: schemas.User = Depends(get_current_admin_user)):
    background_tasks.add_task(auth.send_email_notification, email.recipients, email.subject, email.body)
    return {"message": "Email notifications scheduled."}
