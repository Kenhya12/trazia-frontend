// TestComponent.jsx
import React from 'react';

export function TestComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold">TestComponent funcionando ✅</h1>
      <div style={{
        position: 'fixed',
        top: '50px',
        left: '10px',
        background: 'red',
        color: 'white',
        padding: '10px',
        zIndex: 9999
      }}>
        ✅ TestComponent renderizado correctamente
      </div>
    </div>
  );
}