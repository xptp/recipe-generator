import React, { useEffect, useState } from 'react';
import { recipeService } from '../service/recipeService';
import  type { RecipeOut } from '../types/recipe';

const RecipeList: React.FC = () => {
  const [recipes, setRecipes] = useState<RecipeOut[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const data = await recipeService.getRecipes();
      setRecipes(data);
    } catch (error) {
      console.error('ошибка загрузки рецептов:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Мои рецепты</h2>
      {recipes.length === 0 ? (
        <p>Пока нет рецептов</p>
      ) : (
        <ul>
          {recipes.map(recipe => (
            <li key={recipe.id}>
              <h3>{recipe.title}</h3>
              <p>Ингредиенты: {recipe.ingredients}</p>
              <p>Инструкция: {recipe.instructions}</p>
              {recipe.cooking_time && <p>Время: {recipe.cooking_time} мин</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecipeList;