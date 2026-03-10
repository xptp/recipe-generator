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
    acess_token:string,
    token_type: string,
}