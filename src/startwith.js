/* @flow */
import Observable from './observable'

// source:       |-----1--2--3--4--5--6--|
// startWith(1): |--1--1--2--3--4--5--6--|
export default function startWith<T,U>(start: T, source: Observable<U>): Observable<T|U> {
  return new Observable(({error, next, complete}) => {
    next(start)
    return source.subscribe({error, next, complete})
  })
}

