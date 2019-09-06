import Observable from './observable'
import {Observable as ObservableT} from './index'

// predicate p: x => x % 2 == 0
// source s:     |--1--2--3--4--5--6--|
// filter(p, s): |-----2-----4-----6--|
export default function filter<T>(source: ObservableT<T>, predicate: (item: T) => boolean): ObservableT<T> {
  return new Observable(({error, next, complete}) =>
    source.subscribe({
      error, complete,
      next: (value) => predicate(value) && next(value),
    })
  )
}

