import Observable from './observable'
import {Observable as ObservableT} from './index'

// source:        |--1-2-3-----4-5------6-------7----|
// debounce(200): |---------3-------5-----6-------7--|
export default function debounce<T>(source: ObservableT<T>, duration: number): ObservableT<T> {
  return new Observable(({error, next, complete}) => {
    let timer
    source.subscribe({
      error,
      complete: () => setTimeout(complete, duration),
      next: value => {
        clearTimeout(timer)
        timer = setTimeout(next, duration, value)
      },
    })
  })
}
