import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import type  {UserInDB,RegisterData, Token} from "../../types/auth"
import authService from "../../service/authService";
import axios from "axios";


interface AuthState {
    user: UserInDB | null;
    token: string | null;
    refreshToken: string | null;
    loading: boolean;
    error: string | null;
}

export const signUp = createAsyncThunk<Token, RegisterData, {rejectValue:string}>(
    'auth/signUp',
    async (credentials, {rejectWithValue })=>{
        try {
           return await authService.register(credentials)
            
        } catch (e){
           if (axios.isAxiosError(e)){
            const errorMessage = e.response?.data || 'Ошибка регистрации'
            return rejectWithValue(errorMessage)
           }
           return rejectWithValue("Непредвиденная ошибка регистрации, AuthSlice-signUp")
        }
    }
)

export const signIn = createAsyncThunk<Token, RegisterData, {rejectValue:string}>(
    'auth/signIn',
    async (credentials, {rejectWithValue })=>{
        try {
            return await authService.login(credentials)
        } catch (error) {
            if (axios.isAxiosError(error)){
            const errorMessage = error.response?.data || 'Ошибка авторизации'
            return rejectWithValue(errorMessage)
           }
           return rejectWithValue("Непредвиденная ошибка авторицазции, AuthSlice-signIn")
        } 
        
    }
)

const initialState: AuthState = {
    user: null,
    token: null,
    refreshToken:null,
    loading: false,
    error:null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        logout:(state)=>{
            state.user = null;
            state.token = null;
            state.refreshToken= null;
            state.loading = false;
            state.error = null;
        },
        resetError:(state)=>{
            state.error= null
        }
    },
    extraReducers: (buider)=>{
        buider
        .addCase(signUp.pending, (state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(signUp.fulfilled, (state,action)=>{
            state.loading=false;
            state.token=action.payload.acсess_token;
            state.refreshToken=action.payload.refresh_token;
        })
        .addCase(signUp.rejected, (state, action)=>{
            state.loading=false;
            state.error= action.payload as string
        })
        .addCase(signIn.pending, state=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(signIn.fulfilled, (state,action)=>{
            state.loading=false;
            state.token=action.payload.acсess_token;
            state.refreshToken=action.payload.refresh_token;
        })
        .addCase(signIn.rejected, (state, action)=>{
            state.loading=false;
            state.error= action.payload as string
        })
    }
})

export const {
    logout,
    resetError
}=authSlice.actions