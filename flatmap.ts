import Observable from './observable'
import {Observable as ObservableT, Subscription} from './index'

// transform t: x => Observable.of(x+1, x+2))
// source s:      |-1-------2-------3-------7-----|
// source t(1):   |-2--3--|
// source t(2):           |-3--4--|
// source t(3):                   |-4--5--|
// source t(7):                           |-8--9--|
// flatMap(t, s): |-2--3----3--4----4--5----8--9--|
export default function flatMap<T, U>(source: ObservableT<T>, transform: (item: T) => ObservableT<U>): ObservableT<U> {
  let observables = 0
  let subscriptions: Subscription[] = []
  return new Observable(({error, next, complete}) => {
    subscriptions.push(source.subscribe({
      error,
      next: value => {
        observables += 1
        subscriptions.push(transform(value).subscribe({
          error, next,
          complete: () => (observables -= 1) === 0 && complete()
        }))
      },
    }))
    return () => subscriptions.forEach(({unsubscribe}) => unsubscribe())
  })
}

