import os
import secrets
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
# from database import users_db
from sqlmodel import Session,select
from database import get_session
from models import UserDB,RefreshTokenDB

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

pwd_context = CryptContext(schemes=['bcrypt'],deprecated='auto')

# Получаем пароль и хеширум его
def hash_password(password:str) -> str:
    return pwd_context.hash(password)

# Для сравнения введённого и захешированной версии  
def verify_pass(user_password:str, hashed_user_password: str)-> bool:
    return pwd_context.verify(user_password,hashed_user_password)

# Создание аццесс токена
def create_access_token(data:dict, expires_delta: timedelta | None = None)-> str:
    to_encode=data.copy()
    if expires_delta:
        expire=datetime.now(timezone.utc) + expires_delta
    else:
        expire=datetime.now(timezone.utc)+timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({'exp':expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Создание рефреш токена
def create_refresh_token(session:Session, user_id:int)->str:
    refresh=secrets.token_urlsafe(32)
    expires=datetime.now(timezone.utc) + timedelta(days=7)
    db_token=RefreshTokenDB(token=refresh,user_id=user_id,expires_at=expires, revoked=False)

    session.add(db_token)
    session.commit()
    session.refresh(db_token)
    return refresh

def verify_refresh(session:Session,refresh)->RefreshTokenDB:
    token= session.exec(select(RefreshTokenDB).where((RefreshTokenDB.token==refresh) & (RefreshTokenDB.revoked==False) & (RefreshTokenDB.expires_at > datetime.now(timezone.utc)))).first()
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Error refresh token",
            headers={"WWW-Authenticate": "Bearer"}
        )
    else:
        return token
    
    
# шаблон из фастапи, реализует способ аунтификации по протоколу oauth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login')

# находит пользователя в базе если передан правильный токен
async def get_current_user(token:str = Depends(oauth2_scheme),session:Session= Depends(get_session))->UserDB:
    credentials_exception=HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get('sub')
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    

    user=session.exec(select(UserDB).where(UserDB.username==username)).first()
    if user is None:
        raise credentials_exception
    return user