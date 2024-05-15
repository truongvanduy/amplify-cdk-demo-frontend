import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Amplify } from 'aws-amplify';

Amplify.configure({
  API: {
    GraphQL: {
      endpoint:
        'https://cvmuwtlhgvhn5mujao4jik5ff4.appsync-api.ap-southeast-1.amazonaws.com/graphql',
      region: 'ap-southeast-1',
      defaultAuthMode: 'apiKey',
      apiKey: 'da2-j4iac7fm6jdk7eexykoutxulcm',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
