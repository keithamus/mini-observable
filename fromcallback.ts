import Observable from './observable'
import {Observable as ObservableT} from './index'

export default function fromCallback<T>(func: Function): (...args: any[]) => ObservableT<T> {
  return (...args) => new Observable(({next}) => func(...args.concat(next)))
}
