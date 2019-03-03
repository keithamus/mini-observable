import Observable from './observable'
import {Observable as ObservableT} from './index'

// transform t: x => x * 2
// source s:  |--1--2--3--4--|
// map(t, s): |--2--4--6--8--|
export default function map<T, U>(source: ObservableT<T>, transform: (value: T) => U): ObservableT<U> {
  return new Observable(({error, next, complete}) => {
    return source.subscribe({
      error,
      complete,
      next: (value) => next(typeof transform === 'function' ? transform(value) : transform),
    })
  })
}

