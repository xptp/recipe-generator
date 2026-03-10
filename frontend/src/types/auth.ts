export interface UserInDB{
    id:number,
    username:string,
    hashed_password:string
}

export interface RegisterData{
    username:string,
    password:string
}

export interface Token{
    acсess_token:string,
    refresh_token:string,
    token_type: string,
}