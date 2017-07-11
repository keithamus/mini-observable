/* @flow */
import Observable from './observable'

// source a:    |--1-----2-----3-----4-----|
// source b:    |--9-----8--------7-----6--|
// merge(a, b): |--1-9---2-8---3--7--4--6--|
export default function merge(...sources: Array<Observable<*>>): Observable<*> {
  return new Observable(({error, next, complete}) => {
    let remaining = sources.length
    const unsubscribes = sources.map(source =>
      source.subscribe({
        error, next,
        complete: () => (remaining -= 1) === 0 && complete()
      })
    )
    return () => {
      for (const unsubscribe of unsubscribes) unsubscribe()
    }
  })
}

