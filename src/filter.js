/* @flow */
import Observable from './observable'

// predicate p: x => x % 2 == 0
// source s:     |--1--2--3--4--5--6--|
// filter(p, s): |-----2-----4-----6--|
export default function filter<T>(predicate: (T) => boolean, source: Observable<T>): Observable<T> {
  return new Observable(({error, next, complete}) =>
    source.subscribe({
      error, complete,
      next: (value) => predicate(value) && next(value),
    })
  )
}

