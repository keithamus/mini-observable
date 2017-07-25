/* @flow */
import Observable from './observable'

// source s:   |--1--2--3--4--5--6--7--|
// skip(3, s): |-----------4--5--6--7--|
export default function skip<T>(count: number, source: Observable<T>): Observable<T> {
  return new Observable(({error, next, complete}) => {
    return source.subscribe({
      error, complete,
      next: (value) => {
        if (count === 0) return next(value)
        count -= 1
      }
    })
  })
}

