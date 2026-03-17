import http from "../api/axiosConfig"
import store from "../store"
import type { RecipeCreate, RecipeOut } from '../types/recipe';

export const recipeService={
    async getRecipes(): Promise<RecipeOut[]>{
        const token = store.getState().auth.token;
        const responce= await http.get<RecipeOut[]>('/recipes',{
            headers: {Authorization: `Bearer ${token}`}
        })
        return responce.data
    },
    async createRecipe(data: RecipeCreate): Promise<RecipeOut> {
        const token = store.getState().auth.token;
        const response = await http.post<RecipeOut>('/recipes', data, {
        headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
    },
    async deleteRecipe(id: number): Promise<void> {
        const token = store.getState().auth.token;
        await http.delete(`/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
        });
  }
}