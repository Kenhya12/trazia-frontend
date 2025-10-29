import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/LoginForm/LoginForm';
import { RegisterForm } from './components/RegisterForm/RegisterForm';
import { Dashboard } from './components/Dashboard/Dashboard';
import { PrivateRoute } from './guards/PrivateRoute';
import { TestComponent } from './components/test/TestComponent';

import LanguageSelector from './components/LanguageSelector/LanguageSelector';

function App() {
  return (
    <>
      <LanguageSelector />

      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        
        {/* ✅ Usa TestComponent */}
        <Route path="/test" element={<TestComponent />} />
 
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




