import Observable from './observable'
import {Observable as ObservableT, Subscription} from './index'

// transform t: x => Observable.of(x+1, x+1, x+1))
// source:       |--1-----2--3--4--------|
// source t(1):  |--2--2--2--------------|
// source t(2):  |--------3--3--3--------|
// source t(3):  |-----------4--4--4-----|
// source t(4):  |--------------5--5--5--|
// switchLatest: |--2--2--3--4--5--5--5--|
export default function switchLatest<T, U>(source: ObservableT<T>, transform: (item: T) => ObservableT<U>): ObservableT<U> {
  let remaining = 0
  return new Observable(({error, next, complete}) => {
    let oldSubscription: Subscription | null = null
    const {unsubscribe} = source.subscribe({
      error,
      next: value => {
        remaining += 1
        if (oldSubscription) {
          remaining -= 1
          oldSubscription.unsubscribe()
        }
        oldSubscription = transform(value).subscribe({
          error, next,
          complete: () => {
            remaining -= 1
            if (remaining === 0) {
              complete()
              unsubscribe && unsubscribe()
            }
          }
        })
      },
    })
  })
}

