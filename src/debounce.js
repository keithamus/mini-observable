import Observable from './observable'

// source:        |--1-2-3-----4-5------6-------7----|
// debounce(200): |---------3-------5-----6-------7--|
export default function debounce<T>(duration: number, source: Observable<T>): Observable<T> {
  return new Observable(({error, next, complete}) => {
    let timer = null
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
