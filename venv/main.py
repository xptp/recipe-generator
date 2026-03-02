from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from models import UserCreate, Token, UserInDB
from database import users_db
from auth import hash_password,verify_pass,create_access_token,get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES

app=FastAPI()

@app.post("/register")
def create_user(user:UserCreate):

    if  users_db.get(user.username):
        raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Username already regis",
    )
    users_db[user.username]={
        "username": user.username,
        "hashed_password":hash_password(user.password)
    }
    return {"message":"User created"}


@app.post("/login")
def login_user(data: OAuth2PasswordRequestForm=Depends()):
    username = data.username
    password = data.password

    error_user = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect user name of password",
        )
    
    user_In_Data_Base = users_db.get(username) 
    if user_In_Data_Base is None:
        raise error_user
    if not verify_pass(password, user_In_Data_Base["hashed_password"] ):
        raise error_user
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token({"sub":username},access_token_expires)
    return {"access_token": access_token, "token_type":"bearer"}

@app.get("/users/me")
def authorized_user(current_user: UserInDB = Depends(get_current_user)):
    return current_user
