import Observable from './observable'
import {Observable as ObservableT} from './index'

// transform t: (a, b) => a + b
// source a:          |--1--2--1--2--|
// source b:          |--1--1--2--2--|
// combine(t, a, b):  |--2--3--3--4--|
//
// transform t: (a, b) => a + b
// source a:          |--1-----2-----3--|
// source b:          |--1--2--3--4--5--|
// combine(t, a, b):  |--2--3--5--6--8--|
export default function combine<T,U,V>(sourceA: ObservableT<T>, sourceB: ObservableT<U>, transform: (T, U) => V): ObservableT<V> {
  return new Observable(({error, next, complete}) => {
    let sourceAComplete = false
    let sourceBComplete = false
    let sourceAStarted
    let sourceBStarted
    let sourceAValue
    let sourceBValue
    sourceA.subscribe({
      error,
      complete() {
        sourceAComplete = true
        sourceBComplete && complete()
      },
      next(value) {
        sourceAValue = value
        sourceAStarted = true
        sourceBStarted && next(transform(sourceAValue, sourceBValue))
      }
    })
    sourceB.subscribe({
      error,
      complete() {
        sourceBComplete = true
        sourceAComplete && complete()
      },
      next(value) {
        sourceBValue = value
        sourceBStarted = true
        sourceAStarted && next(transform(sourceAValue, sourceBValue))
      }
    })
  })
}
