export interface RecipeCreate {
    title: string;
    ingredients: string;
    instructions: string;
    cooking_time?: number | null;
}

export interface RecipeOut {
    id: number;
    title: string;
    ingredients: string;
    instructions: string;
    cooking_time?: number | null;
    created_at: string;
    user_id: number;
}
export interface RecipeResponse {
  title: string;
  ingredients: string;
  instructions: string;
  cooking_time: number;
}