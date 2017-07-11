/* @flow */
import Observable from './observable'

// transform t: x => x * 2
// source s:  |--1--2--3--4--|
// map(t, s): |--2--4--6--8--|
export default function map<T, U>(transform: U|(T) => U, source: Observable<T>): Observable<U> {
  return new Observable(({error, next, complete}) => {
    return source.subscribe({
      error, complete,
      next: (value) => next(typeof transform === 'function' ? transform(value) : transform),
    })
  })
}

