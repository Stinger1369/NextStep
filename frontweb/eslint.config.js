// eslint.config.js

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import a11y from 'eslint-plugin-jsx-a11y';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

// Utilisez FlatCompat pour la compatibilité avec les anciens fichiers .eslintrc
const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended
});

export default [
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        },
        project: './tsconfig.json'
      }
    },
    plugins: {
      react,
      '@typescript-eslint': ts,
      'jsx-a11y': a11y
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      ...react.configs.recommended.rules,
      ...ts.configs.recommended.rules,
      ...a11y.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ],
      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          components: ['Link'],
          specialLink: ['to'],
          aspects: ['invalidHref', 'preferButton']
        }
      ],
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-interface': [
        'error',
        {
          allowSingleExtends: true // Permet d'avoir des interfaces vides qui étendent une autre interface
        }
      ],
      'jsx-a11y/media-has-caption': [
        'error',
        {
          audio: ['Audio'], // Ajouter les balises audio personnalisées si nécessaire
          video: ['Video'] // Ajouter les balises vidéo personnalisées si nécessaire
        }
      ]
    }
  },
  ...compat.config({
    extends: ['plugin:prettier/recommended'],
    ignorePatterns: ['node_modules/', 'build/', 'dist/']
  })
];
