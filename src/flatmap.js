/* @flow */
import Observable from './observable'

// transform t: x => Observable.of(x+1, x+2))
// source s:      |-1-------2-------3-------7-----|
// source t(1):   |-2--3--|
// source t(2):           |-3--4--|
// source t(3):                   |-4--5--|
// source t(7):                           |-8--9--|
// flatMap(t, s): |-2--3----3--4----4--5----8--9--|
export default function flatMap<T, U>(transform: (T) => Observable<U>, source: Observable<T>): Observable<U> {
  let observables = 0
  let unsubscribes = []
  return new Observable(({error, next, complete}) => {
    unsubscribes.push(source.subscribe({
      error,
      next: value => {
        observables += 1
        unsubscribes.push(transform(value).subscribe({
          error, next,
          complete: () => (observables -= 1) === 0 && complete()
        }))
      },
    }))
    return () => unsubscribes.forEach((unsubscribe) => unsubscribe())
  })
}

