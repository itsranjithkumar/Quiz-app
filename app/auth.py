from jose import jwt, JWTError
from datetime import datetime, timedelta
from .users import get_user_by_username
from fastapi_mail import FastMail, MessageSchema
from passlib.context import CryptContext


# Constants
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Create JWT token

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Verify token
def verify_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        return username
    except JWTError:
        raise credentials_exception

# Email notification (SMTP settings should be configured)
async def send_email_notification(recipients: list, subject: str, body: str):
    message = MessageSchema(
        subject=subject,
        recipients=recipients,
        body=body
    )
    fm = FastMail(your_email_config)
    await fm.send_message(message)

# def get
# get_password_hash(user.password)
