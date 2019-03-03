import Observable from './observable'
import {Observable as ObservableT} from './index'

export default function fromPromise<T>(promise: Promise<T>): ObservableT<T> {
  return new Observable(({next, error, complete}) => {
    promise.then(next, error).then(complete)
  })
}

