import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/LoginForm/LoginForm';
import { RegisterForm } from './components/RegisterForm/RegisterForm';
import { Dashboard } from './components/Dashboard/Dashboard';
import { PrivateRoute } from './guards/PrivateRoute';

import LanguageSelector from './components/LanguageSelector/LanguageSelector';

function App() {
  return (
    <>
      {/* El selector de idioma debe estar fuera de <Routes> */}
      <LanguageSelector />

      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Rutas protegidas */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;




