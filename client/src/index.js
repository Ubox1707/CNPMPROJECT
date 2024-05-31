import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SearchContextProvider } from './context/SearchContext';
import { AuthContextProvider } from './context/AuthContext';
import { SelectedRoomsProvider } from './context/SelectedRoomsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <SearchContextProvider>
      <SelectedRoomsProvider>
          <App />
        </SelectedRoomsProvider>
      </SearchContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
