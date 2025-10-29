// eslint.config.js
import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh' // 👈 NUEVO
import globals from 'globals'

export default [
  {
    // Configuración para archivos de configuración
    files: [
      'tailwind.config.js',
      'tailwind.config.jsx', 
      'vite.config.js',
      '*.config.js'
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      }
    },
    rules: {
      'no-undef': 'off'
    }
  },
  {
    // Configuración principal para archivos de fuente
    files: ['**/*.{js,jsx}'],
    ignores: ['**/*.config.js'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh, // 👈 NUEVO
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        React: 'readonly',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-refresh/only-export-components': 'warn', // 👈 NUEVO
      'no-unused-vars': ['error', { 
        'vars': 'all',
        'args': 'after-used', 
        'ignoreRestSiblings': true,
        'argsIgnorePattern': '^_'
      }],
    },
  },
]