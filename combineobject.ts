import Observable from './observable'
import {Observable as ObservableT} from './index'

// sources o.a:      |------1----------2----------1----------2------|
// sources o.b:      |------1----------1----------2----------2------|
// combineObject(o): |--{a:1,b:1}--{a:1,b:1}--{a:1,b:1}--{a:1,b:1}--|
export default function combineObject<T>(sources: {[name: string]: ObservableT<T>}): ObservableT<{[name: string]: T}> {
  return new Observable(({error, next, complete}) => {
    const total = Object.keys(sources).length
    let started = 0
    let completed = 0
    const values: { [name: string]: T } = {}
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

