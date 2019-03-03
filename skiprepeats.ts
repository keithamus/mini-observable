import Observable from './observable'
import {Observable as ObservableT} from './index'

// source s:       |--1--1--2--3--4--4--4--4--5-|
// skipRepeats(s): |--1-----2--3--4-----------5-|
export default function skipRepeats<T>(source: ObservableT<T>): ObservableT<T> {
  return new Observable(({error, next, complete}) => {
    let lastValue = {}
    return source.subscribe({
      error, complete,
      next: value => lastValue !== value && next(lastValue = value)
    })
  })
}

