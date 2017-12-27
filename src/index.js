import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { AppContainer } from 'react-hot-loader';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <BrowserRouter>
    <AppContainer>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </AppContainer>
  </BrowserRouter>, document.getElementById('root'));
registerServiceWorker();

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./components/App', () => { render(App); });
}
