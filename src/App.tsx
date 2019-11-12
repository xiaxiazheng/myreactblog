import React from 'react';
import '@/App.scss';
import '@/assets/scss/Global.scss';
import Router from './router/Router';
import { IsLoginProvider } from './context/IsLoginContext';
import { ThemeProvider } from './context/ThemeContext';

const App: React.FC = () => {
  return (
    <div className="App darkTheme">
      <IsLoginProvider>
        <ThemeProvider>
          <Router></Router>
        </ThemeProvider>
      </IsLoginProvider>
    </div>
  );
}

export default App;
