/* globals AddEventListenerOptions, Event, CustomEvent */
import Observable from './observable'
import {Observable as ObservableT} from './index'

interface HTMLElementLike {
  addEventListener(name: string, next: Function, options?: boolean|AddEventListenerOptions): void,
  removeEventListener(name: string, next: Function, options?: boolean|AddEventListenerOptions): void,
}

export default function fromEvent(element: HTMLElementLike, name: string, options?: boolean|AddEventListenerOptions): ObservableT<Event|CustomEvent> {
  return new Observable(({next}) => {
    element.addEventListener(name, next, options)
    return () => element.removeEventListener(name, next, options)
  })
}
