import React, { useState } from "react";
import { useAppDispatch,useAppSelector } from "../store/hooks";
import type { RegisterData } from "../types/auth";
import { signUp } from "../store/slice/authSlice";

const AuthForm: React.FC =()=>{
    const [user, setUser]=useState<RegisterData>({username: '',password: ''})

    const dispatch = useAppDispatch()
    const {loading,error}=useAppSelector((state)=>state.auth)


    const handleChange =({ target}:React.ChangeEvent<HTMLInputElement>)=>{
        setUser((prevState)=>({
            ...prevState,
            [target.name]: target.value
        }))
    }
    const handleSubmit=async(e:React.SyntheticEvent<HTMLFormElement>) =>{
        e.preventDefault()
          await dispatch(signUp(user))
        
    }

    return(
    <div className="form">
        <form onSubmit={handleSubmit} className="">

            <div>
                <label htmlFor="username">Логин</label>
                <div> 
                    <input name="username" type="text" onChange={handleChange} value={user.username} />
                </div>
            </div>
            <div>
                <label htmlFor="password">Пароль</label>
                <div> 
                    <input name='password'type="password" onChange={handleChange} value={user.password}/>
                </div>
            </div>
        </form>
        {loading && <p>загрузка...</p>}
        {error && <p style={{color:'red'}}>{error}</p>}
        <button disabled={loading} type="submit">Зарегистрироваться</button>
    </div>
    )
}

export default AuthForm
