import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import type  {UserInDB,RegisterData} from "../../types/auth"
import authService from "../../service/authService";
import axios from "axios";


interface AuthState {
    user: UserInDB | null;
    token: string | null;
    refreshToken: string | null;
    loading: boolean;
    error: string | null;
}

export const signUp = createAsyncThunk<void, RegisterData, {rejectValue:string}>(
    'auth/signUp',
    async (credentials, {rejectWithValue })=>{
        try {
            await authService.register(credentials)
            
        } catch (e){
           if (axios.isAxiosError(e)){
            const errorMessage = e.response?.data || 'Ошибка регистрации'
            return rejectWithValue(errorMessage)
           }
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
        .addCase(signUp.fulfilled, (state)=>{
            state.loading=false;
        })
        .addCase(signUp.rejected, (state, action)=>{
            state.loading=false;
            state.error= action.payload as string
        })
    }
})

export const {
    logout,
    resetError
}=authSlice.actions