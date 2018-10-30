import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'rc-service';
import { LogServicePlugin, PersistServicePlugin } from 'rc-service/dist/plugins';
import App from './App';

render(
  <Provider plugins={[LogServicePlugin]}>
    <React.Suspense fallback={<div>Loading</div>} maxDuration={500}>
      <App />
    </React.Suspense>
  </Provider>,
  document.getElementById('root')
);
