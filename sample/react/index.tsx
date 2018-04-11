import * as React from 'react';
import { render } from 'react-dom';

import { Provider } from '../../dist';
import { LogServicePlugin, PersistServicePlugin } from '../../dist/plugins';
import App from './App';

render(
  <Provider plugins={[LogServicePlugin, PersistServicePlugin]}>
    <App />
  </Provider>,
  document.getElementById('root')
);
