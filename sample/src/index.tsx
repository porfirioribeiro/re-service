import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'rc-service/es6';
import { LogServicePlugin } from 'rc-service/es6/plugins';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Provider plugins={[LogServicePlugin]}>
    <React.Suspense fallback={<div>Loading</div>}>
      <App />
    </React.Suspense>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
