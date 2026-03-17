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
      alert('Не удалось сгенерировать рецепт');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Генератор рецептов</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Введите ингредиенты через запятую (например: курица, рис, лук)"
          rows={3}
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Генерация...' : 'Сгенерировать'}
        </button>
      </form>

      {recipe && (
        <div style={{ marginTop: '20px' }}>
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