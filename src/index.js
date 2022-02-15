// Import React and ReactDOM
import React from 'react';
import ReactDOM from 'react-dom';

// Import Framework7
import Framework7 from 'framework7/bundle';

// Import Framework7-React plugin
import Framework7React from 'framework7-react';

// Import main App component
import App from './components/App.jsx';

// Import service worker
import * as serviceWorker from './serviceWorker';

// Framework7 styles
import 'framework7/framework7-bundle.min.css';

// Icons
import './css/icons.css';

// Custom app styles
import './css/app.css';

// Init Framework7-React plugin
Framework7.use(Framework7React);

// Mount React App
ReactDOM.render(
  React.createElement(App),
  document.getElementById('app'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
