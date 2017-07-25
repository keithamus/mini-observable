/* @flow */
import Observable from './observable'

// transform t: x => Observable.of(x+1, x+1, x+1))
// source:       |--1-----2--3--4--------|
// source t(1):  |--2--2--2--------------|
// source t(2):  |--------3--3--3--------|
// source t(3):  |-----------4--4--4-----|
// source t(4):  |--------------5--5--5--|
// switchLatest: |--2--2--3--4--5--5--5--|
export default function switchLatest<T, U>(transform: (T) => Observable<U>, source: Observable<T>): Observable<U> {
  let remaining = 0
  return new Observable(({error, next, complete}) => {
    let oldUnsubscribe = null
    const unsubscribe = source.subscribe({
      error,
      next: value => {
        remaining += 1
        if (oldUnsubscribe) {
          remaining -= 1
          oldUnsubscribe()
        }
        oldUnsubscribe = transform(value).subscribe({
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

