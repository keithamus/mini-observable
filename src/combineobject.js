/* @flow */
import Observable from './observable'

// sources o.a:      |------1----------2----------1----------2------|
// sources o.b:      |------1----------1----------2----------2------|
// combineObject(o): |--{a:1,b:1}--{a:1,b:1}--{a:1,b:1}--{a:1,b:1}--|
export default function combineObject(sources: {[name: string]: Observable<*>}): Observable<{[name: string]: *}> {
  return new Observable(({error, next, complete}) => {
    const total = Object.keys(sources).length
    let started = 0
    let completed = 0
    const values = {}
    for (const name in sources) {
      sources[name].subscribe({
        error,
        complete() {
          completed += 1
          completed === total && complete()
        },
        next(value) {
          started += 1
          values[name] = value
          started === total && next(values)
        }
      })
    }
  })
}

