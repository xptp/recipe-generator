import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './store/hooks';
import GeneratorPage from './pages/GeneratorPage';
import AuthForm from './components/authForm';

function App() {
  const token = useAppSelector(state => state.auth.token);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!token ? <AuthForm /> : <Navigate to="/" />} />
        <Route path="/" element={token ? <GeneratorPage /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
