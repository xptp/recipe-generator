import React, { useState } from 'react';
import http from '../api/axiosConfig';
import { useAppSelector } from '../store/hooks';
import type { RecipeResponse } from '../types/recipe';

const GeneratorPage: React.FC = () => {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const token = useAppSelector(state => state.auth.token);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await http.post('/recipe-generator', { ingredients }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecipe(response.data);
    } catch (error) {
      console.error('Ошибка генерации:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '32px' }}>
      <h1>Генератор рецептов</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="ингредиенты через запятую (пример: курица, рис, лук)"
          rows={3}
          style={{ width: '50%', marginBottom: '10px', resize:'none' }}
        />
        <button type="submit" disabled={loading} style={{ width: '50%', marginBottom: '5px' }}>
          {loading ? 'Генерация...' : 'Сгенерировать'}
        </button>
      </form>

      {recipe && (
        <div style={{ marginTop: '22px' }}>
          <h2>{recipe.title || 'Рецепт'}</h2>
          <p><strong>Ингредиенты:</strong> {recipe.ingredients}</p>
          <p><strong>Инструкция:</strong> {recipe.instructions}</p>
          {recipe.cooking_time > 0 && <p><strong>Время:</strong> {recipe.cooking_time} мин</p>}
        </div>
      )}
    </div>
  );
};

export default GeneratorPage;