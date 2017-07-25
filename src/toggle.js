/* @flow */
import Observable from './observable'

// source s:     |--1--2--3--4--5--6--7--8--|
// source t:     |-----T-----F-----T--F-----|
// toggle(s, t): |-----2--3--4-----6--7-----|
export default function toggle<T>(source: Observable<T>, toggler: Observable<boolean>): Observable<T> {
  return new Observable(({error, next, complete}) => {
    let doNext = false
    const togglerUnsubscribe = toggler.subscribe({ next: bool => doNext = bool })
    const unsubscribe = source.subscribe({
      error, complete,
      next: value => doNext && next(value)
    })
    return () => {
      togglerUnsubscribe()
      unsubscribe()
    }
  })
}

