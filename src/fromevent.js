/* @flow */
/* globals EventListenerOptionsOrUseCapture, Event, CustomEvent */
import Observable from './observable'

type HTMLElementLike = {
  addEventListener(name: string, next: Function, options?: EventListenerOptionsOrUseCapture): void,
  removeEventListener(name: string, next: Function, options?: EventListenerOptionsOrUseCapture): void,
}

export default function fromEvent(name: string, element: HTMLElementLike, options?: EventListenerOptionsOrUseCapture): Observable<Event|CustomEvent> {
  return new Observable(({next}) => {
    element.addEventListener(name, next, options)
    return () => element.removeEventListener(name, next, options)
  })
}
