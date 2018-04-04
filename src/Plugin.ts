import { Service } from './Service';

export interface IServicePlugin<State = {}> {
  init(service: Service<State>): void;
  update(service: Service<State>, oldState: State, changes: Partial<State>): void;
}
