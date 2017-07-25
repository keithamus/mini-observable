/* @flow */
import Observable from './observable'

// source s:       |--1--1--2--3--4--4--4--4--5-|
// skipRepeats(s): |--1-----2--3--4-----------5-|
export default function skipRepeats<T>(source: Observable<T>): Observable<T> {
  return new Observable(({error, next, complete}) => {
    let lastValue = {}
    return source.subscribe({
      error, complete,
      next: value => lastValue !== value && next(lastValue = value)
    })
  })
}

