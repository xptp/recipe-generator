from pydantic import BaseModel
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime, timezone

class UserDB(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None,primary_key=True) # первичный ключ
    username: str = Field(unique=True, index=True)
    hashed_password: str
    recipes: List["RecipeDB"]=Relationship(back_populates='user')

class RecipeDB(SQLModel,table=True):
    __tablename__ = "recipes"

    id: Optional[int]=Field(default=None,primary_key=True)
    title: str
    ingredients:str
    instructions:str
    cooking_time: Optional[int]=Field(default=None)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc).replace(tzinfo=None))

    user_id: int = Field(foreign_key="users.id")
    user: Optional[UserDB] = Relationship(back_populates="recipes")


class UserCreate(BaseModel):
    username: str
    password: str

class UserInDB(BaseModel):
    username: str
    hashed_password: str

class Token(BaseModel):
    access_token:str
    token_type: str = "bearer"

class RefreshTokenDB(SQLModel,table=True):
    __tablename__ = "refresh_tokens"

    id: int = Field(primary_key=True) 
    token: str 
    user_id:int
    expires_at: datetime
    revoked: bool
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc).replace(tzinfo=None))


class LoginResponse(BaseModel):
    access_token:str
    refresh_token:str
    token_type:str = "bearer"

class RefreshRequest(BaseModel):
    refresh_token: str

class RecipeCreate(BaseModel):
    title:str
    ingredients: str
    instructions: str
    cooking_time: Optional[int] = None

class RecipeOut(BaseModel):
    id: int
    title:str
    cooking_time: Optional[int]
    created_at: datetime
    user_id: int

class GenerateRequest(BaseModel):
     ingredients: str
    