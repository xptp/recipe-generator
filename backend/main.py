from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from models import RefreshRequest,LoginResponse,UserCreate, Token, RecipeCreate, UserDB, RecipeDB, RecipeOut,GenerateRequest,RefreshTokenDB
from auth import verify_refresh,create_refresh_token,hash_password,verify_pass,create_access_token,get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
from sqlmodel import Session,select
from database import get_session, create_db_tables
from contextlib import asynccontextmanager
from ai import generate_recipe

#запуск
@asynccontextmanager
async def lifespan(app: FastAPI):
    # код при запуске
    create_db_tables()
    yield
    # код при остановке (пока пусто)
    pass

app = FastAPI(lifespan=lifespan)


# для юзера
@app.post("/register")
def create_user(user:UserCreate,session: Session = Depends(get_session)):

    existing_user=session.exec(select(UserDB).where(UserDB.username==user.username)).first()

    if  existing_user:
        raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Username already regis",
    )
    hashed = hash_password(user.password)

    db_user= UserDB(username=user.username,hashed_password=hashed)

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return {"message":"User created"}


@app.post("/login", response_model=LoginResponse)
def login_user(data: OAuth2PasswordRequestForm=Depends(),session = Depends(get_session)):
    username = data.username
    password = data.password

    # existing_user=session.exec(select(UserDB).where(UserDB.username==data.username))
    error_user = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect user name of password",
        )
    
    user_In_Data_Base =session.exec(select(UserDB).where(UserDB.username == data.username)).first()
    
    if user_In_Data_Base is None:
        raise error_user
    if not verify_pass(password, user_In_Data_Base.hashed_password ):
        raise error_user
    refresh_token= create_refresh_token(session,user_In_Data_Base.id)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token({"sub":username},access_token_expires)
    return {"access_token": access_token,"refresh_token":refresh_token, "token_type":"bearer"}

# получение acess по refresh
@app.post('/refresh',response_model=Token)
def refresh_access_token(request:RefreshRequest,session:Session=Depends(get_session)):
    user =  verify_refresh(session, request.refresh_token)
    user_In_Data_Base =session.exec(select(UserDB).where(UserDB.id== user.user_id)).first()

    if user_In_Data_Base is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="error refresh token",
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token({"sub":user_In_Data_Base.username},access_token_expires)
    return {"access_token": access_token,"token_type":"bearer"}
    
    


@app.get("/users/me")
def authorized_user(current_user: UserDB = Depends(get_current_user)):
    return current_user

# для рецептов
@app.post("/recipes",response_model=RecipeOut)
def created_recipes(recipe:RecipeCreate,current_user:UserDB=Depends(get_current_user),session: Session= Depends(get_session)):
    db_recipe=RecipeDB(
        title=recipe.title,
        ingredients=recipe.ingredients,
        instructions=recipe.instructions,
        cooking_time=recipe.cooking_time,
        user_id=current_user.id
        )
    
    session.add(db_recipe)
    session.commit()
    session.refresh(db_recipe)
    return db_recipe

@app.get("/recipes")
def get_recipes(current_user:UserDB=Depends(get_current_user),session: Session= Depends(get_session)):
    return session.exec(select(RecipeDB).where(RecipeDB.user_id==current_user.id)).all()

@app.get("/recipes/{recipe_id}")
def get_one_recipe(
                    recipe_id:int,
                    current_user:UserDB=Depends(get_current_user),
                    session: Session= Depends(get_session)
                    ):
    recipe=session.get(RecipeDB, recipe_id)

    if not recipe or recipe.user_id != current_user.id:
        raise HTTPException(status_code=404,detail="recipe not found")
    
    return recipe

@app.delete("/recipes/{recipe_id}",status_code=204)
def delete_recipe(
                    recipe_id:int,
                    current_user:UserDB=Depends(get_current_user),
                    session: Session= Depends(get_session)
                    ):
    recipe=session.get(RecipeDB, recipe_id)

    if not recipe or recipe.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="recipe not found")
    
    session.delete(recipe)
    session.commit()

@app.post("/recipe-generator",response_model=RecipeCreate)
def recipe_generator(data: GenerateRequest):
    result = generate_recipe(data.ingredients)
    return result
