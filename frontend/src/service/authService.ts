import axios from "axios";
import config from "./config.json"
import type  {RegisterData, Token} from "../types/auth"

const http = axios.create({baseURL:config.apiEndpoint})

const authService = {
    register:async({
        username,
        password,
    }:RegisterData): Promise<Token>=>{
        const responce = await http.post<Token>('/register',{
            username,
            password
        })
        return responce.data
    },
    login:async({
        username,
        password,
    }:RegisterData): Promise<Token>=>{
        const user= new URLSearchParams()
        user.append('username', username)
        user.append('password', password)
        const responce = await http.post<Token>('/login', user, {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        return responce.data
    }
}

export default authService

