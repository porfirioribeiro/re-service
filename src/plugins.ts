import { IServicePlugin } from './Plugin';
// import { Service } from './Service';

export const LogServicePlugin: IServicePlugin = {
  init(service) {
    console.groupCollapsed(
      `%cService#init %c${service.serviceName}`,
      'color: #9E9E9E; font-weight: bold',
      'color: inherit; font-weight: bold'
    );
    console.log('%c state', 'color: #4CAF50; font-weight: bold', service.state);
    console.groupEnd();
    
  },
  update(service, oldState, changes) {
    console.groupCollapsed(`%cService#update %c` + service.serviceName, 'color: #9E9E9E', 'color: inherit');
    console.log('%c prev state', 'color: #9E9E9E; font-weight: bold', oldState);
    console.log('%c state     ', 'color: #03A9F4; font-weight: bold', changes);
    console.log('%c next state', 'color: #4CAF50; font-weight: bold', service.state);
    // if (service['subscribers'].length > 0) {
    //   const allStates: { [k: string]: object } = {};
    //   service['subscribers'][0].context[CTX_KEY].forEach(
    //     (service, serviceClass) => (allStates[serviceClass.serviceName] = service.state)
    //   );
    //   console.log('%c all states', 'color: #03A9F4; font-weight: bold', allStates);
    // }
    console.groupEnd();

    // return state;
  }
};

export const PersistServicePlugin: IServicePlugin = {
  init(service) {
    const storage = localStorage.getItem(service.serviceName.toLowerCase());
    if (storage) {
      service.state = JSON.parse(storage);
      //Todo only log if has logger plugin and debounce for performance
      console.groupCollapsed(`%cService#rehydrate %c` + service.serviceName, 'color: #9E9E9E', 'color: inherit');
      console.log('%c state     ', 'color: #03A9F4; font-weight: bold', service.state);
      console.groupEnd();
    }
  },
  update(service) {
    localStorage.setItem(service.serviceName.toLowerCase(), JSON.stringify(service.state));
    // return state;
  }
};
