import * as React from 'react';
import { render } from 'react-dom';

import { Provider } from 'rc-service';
import { LogServicePlugin, PersistServicePlugin } from 'rc-service/dist/plugins';
import App from './App';

render(
  <Provider plugins={[LogServicePlugin]}>
    <App />
  </Provider>,
  document.getElementById('root')
);
