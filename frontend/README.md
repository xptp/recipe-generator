# Recipe Generator – AI-генерация рецептов

Это full-stack веб-приложение, которое позволяет пользователям регистрироваться,  генерировать рецепты по списку ингредиентов с помощью искусственного интеллекта. Проект построен модели T5, модель простенькая, хотел попробовать интеграцию моделей, рсчитывать на вкусный рецепт не стоит, может предложить смузи из гречки.

## 🚀 Функциональность

-  Регистрация и вход с выдачей пары токенов (access, refresh)
-  Защищённые маршруты (только для авторизованных)
-  AI-генерация рецепта по введённым ингредиентам (модель Hugging Face)
-  Сохранение токена в `localStorage` для сохранения сессии после перезагрузки

## 🛠️ Стек технологий

### Бэкенд
- **Python 3.10+**
- **FastAPI** – веб-фреймворк
- **SQLModel** – ORM для работы с базой
- **SQLite** – база данных
- **python-jose** – создание и проверка JWT
- **passlib[bcrypt]** – хеширование паролей
- **Transformers (Hugging Face)** – модель `flax-community/t5-recipe-generation`

 ### Фронтенд
- **React 18+** (создан через Vite)
- **TypeScript**
- **Redux Toolkit** – управление состоянием
- **React Router** – навигация
- **Axios** – HTTP-клиент (с интерцепторами)

 ### Запуск бек
  cd backend
  python -m venv venv
  # Активация окружения:
  # Windows (PowerShell):
  .\venv\Scripts\Activate.ps1
  # Linux/macOS:
  source venv/bin/activate

  pip install -r requirements.txt
  uvicorn main:app --reload

  После этого бэкенд будет доступен по адресу http://127.0.0.1:8000
  Документация Swagger: http://127.0.0.1:8000/docs

  ### Запуск фронт
  cd frontend
  npm install
  npm run dev