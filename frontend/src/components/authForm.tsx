import React, { useState } from "react";
import LoginForm from "./loginForm";
import RegisterForm from "./registerForm";

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true); 

  const changeForm = () => setIsLogin(!isLogin);

  return (
    <>
      {isLogin ? <LoginForm /> : <RegisterForm />}
      <button onClick={changeForm}>
        {isLogin ? "Нет аккаунта? Зарегистрироваться" : "Есть аккаунт? Войти"}
      </button>
    </>
  );
};

export default AuthForm;