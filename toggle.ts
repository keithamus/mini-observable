import Observable from './observable'
import {Observable as ObservableT} from './index'

// source s:     |--1--2--3--4--5--6--7--8--|
// source t:     |-----T-----F-----T--F-----|
// toggle(s, t): |-----2--3--4-----6--7-----|
export default function toggle<T>(source: ObservableT<T>, toggler: ObservableT<boolean>): ObservableT<T> {
  return new Observable(({error, next, complete}) => {
    let doNext = false
    const togglerSubscription = toggler.subscribe({ next: bool => doNext = bool })
    const sourceSubscription = source.subscribe({
      error, complete,
      next: value => doNext && next(value)
    })
    return () => {
      togglerSubscription.unsubscribe()
      sourceSubscription.unsubscribe()
    }
  })
}

