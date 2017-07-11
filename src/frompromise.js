/* @flow */
import Observable from './observable'

export default function fromPromise<T>(promise: Promise<T>): Observable<T> {
  return new Observable(({next, error, complete}) => {
    promise.then(next, error).then(complete)
  })
}

