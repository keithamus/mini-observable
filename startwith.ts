import Observable from './observable'
import {Observable as ObservableT} from './index'

// source:       |-----1--2--3--4--5--6--|
// startWith(1): |--1--1--2--3--4--5--6--|
export default function startWith<T,U>(source: ObservableT<U>, start: T): ObservableT<T|U> {
  return new Observable(({error, next, complete}) => {
    next(start)
    return source.subscribe({error, next, complete})
  })
}

