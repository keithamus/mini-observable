import Observable from './observable'
import {Observable as ObservableT} from './index'

export default function of<T>(...items: T[]): ObservableT<T> {
  return new Observable(({next, complete}) => {
    for (let item of items) next(item)
    complete()
  })
}
