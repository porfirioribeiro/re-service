import * as React from 'react';
import { render } from 'react-dom';

import { Provider } from '../../es6';
import { LogServicePlugin, PersistServicePlugin } from '../../es6/plugins';
import App from './App';

render(
  <Provider plugins={[LogServicePlugin]}>
    <App />
  </Provider>,
  document.getElementById('root')
);
